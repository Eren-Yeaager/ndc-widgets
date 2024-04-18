const ScrollableWrapper = styled.div`
  width: 100%;
  min-height: 15rem;
  @media screen and (max-width: 1341px) {
    overflow-y: hidden;
    overflow-x: scroll;

    ::-webkit-scrollbar {
      height: 15px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #8799d2;
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
  -webkit-overflow-scrolling: touch;
`;

const FiltersContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 14px;
  align-items: flex-start;
  gap: 72px;
  align-self: stretch;
  border-radius: 6px;
  background: #f8f8f8;

  .selected-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 16px;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;

    i {
      color: #b0afb1;
    }
  }
`;

const { daos, API, period } = props;
const Loading = () => <Widget src="flashui.near/widget/Loading" />;

const defaultDAOOption = "All DAOs";

const FILTER_IDS = {
  dao: "dao",
  userRetentions: "userRetentions",
  dappsUsed: "dappsUsed",
  acquisitionCost: "acquisitionCost",
};

const FILTER_OPENS = Object.keys(FILTER_IDS).map((item) => {
  return { [item]: false };
});

const [dataSet, setDataSet] = useState([]);
const [loading, setLoading] = useState(false);
const [selectedDAOs, setSelectedDAOs] = useState([]);
const [filtersIsOpen, setFiltersIsOpen] = useState(FILTER_OPENS);

const onFilterClick = (value) =>
  setFiltersIsOpen({ ...FILTER_OPENS, [value]: !filtersIsOpen[value] });

const filterDAO = (value) => {
  let newSelection;

  if (value === defaultDAOOption) {
    const all = [defaultDAOOption, ...daos.map((d) => d.title)];
    const isCurrentSelectionFull = selectedDAOs.length === all.length;
    newSelection = isCurrentSelectionFull ? [] : all;
  } else if (selectedDAOs.includes(value)) {
    newSelection = selectedDAOs.filter(
      (daoId) => daoId !== value && daoId !== defaultDAOOption,
    );
  } else {
    newSelection = [...selectedDAOs, value];
  }

  setSelectedDAOs(newSelection);
};

const fetchData = async (key) => {
  setLoading(true);
  const filtredDAOs = selectedDAOs.length
    ? daos.filter((d) => selectedDAOs.includes(d.title))
    : daos;

  const newDataSet = dataSet;

  API[key](filtredDAOs).then((resp) => {
    if (!resp.body) return;

    const data = resp.body;
    if (data)
      Object.entries(data).map(([id, value]) => {
        const targetData = newDataSet.find((d) => d.id === parseInt(id));
        targetData[key] = value;
      });

    setDataSet(newDataSet);
    setLoading(false);
  });
};

useEffect(() => {
  const filtredDAOs = selectedDAOs.length
    ? daos.filter((d) => selectedDAOs.includes(d.title))
    : daos;

  if (dataSet.length > 0) {
    fetchData(FILTER_IDS.userRetentions);
    fetchData(FILTER_IDS.dappsUsed);
    fetchData(FILTER_IDS.acquisitionCost);
  } else
    setDataSet(
      filtredDAOs.map((dao) => {
        return {
          id: dao.id,
          title: dao.title,
          [FILTER_IDS.userRetentions]: 0,
          [FILTER_IDS.dappsUsed]: 0,
          [FILTER_IDS.acquisitionCost]: 0,
        };
      }),
    );
}, [daos, selectedDAOs, period]);

const sortData = (field) =>
  setDataSet(dataSet.sort((a, b) => b[field] - a[field]));

const SortingRow = ({ title, field }) => (
  <div className="selected-container" onClick={() => sortData(field)}>
    <i className="ph ph-info fs-5" />
    <div>{title}</div>
    <i className="ph ph-caret-up-down fs-5" />
  </div>
);

return (
  <ScrollableWrapper>
    <FiltersContainer>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Select`}
        props={{
          id: FILTER_IDS.dao,
          text: "DAO",
          hintText: "NDC grassroots DAOs",
          options: daos.map((d) => d.title),
          values: selectedDAOs,
          defaultValue: defaultDAOOption,
          multiple: true,
          filterIsOpen: filtersIsOpen[FILTER_IDS.dao],
          onFilterClick,
          onChange: (value) => filterDAO(value),
          onClear: () => {
            setSelectedDAOs([]);
          },
          isTooltipVisible: true,
          noBorder: true,
          containerClass: "selected-container",
        }}
      />
      <SortingRow title="User Retention" field={FILTER_IDS.userRetentions} />
      <SortingRow title="DApp's Used" field={FILTER_IDS.dappsUsed} />
      <SortingRow title="Acquisition Cost" field={FILTER_IDS.acquisitionCost} />
    </FiltersContainer>
    {loading ? (
      <Loading />
    ) : (
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Table.Cells`}
        props={{ dataSet }}
      />
    )}
  </ScrollableWrapper>
);
