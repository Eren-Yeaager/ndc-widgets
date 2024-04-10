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

const { daos, API } = props;
const Loading = () => <Widget src="flashui.near/widget/Loading" />;

const defaultDAOOption = "All DAOs";
const CURRENCIES = {
  NEAR: "Near",
  "USDC.e": "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
  "USDT.e": "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
};
const RETENTIONS = ["1 month", "2 months", "3 months", "4 months"];
const DAPPS_USED_PERIOD = ["All Time"];

const FILTER_IDS = {
  dao: "dao",
  userRetention: "userRetention",
  dapUsed: "dapUsed",
  aquisitionCost: "aquisitionCost",
};

const FILTER_OPENS = Object.keys(FILTER_IDS).map((item) => {
  return { [item]: false };
});

const [dataSet, setDataSet] = useState({});
const [loading, setLoading] = useState(false);
const [selectedDAOs, setSelectedDAOs] = useState([]);
const [selectedRetention, setSelectedRetention] = useState(0);
const [selectedCurrency, setSelectedCurrency] = useState(
  Object.keys(CURRENCIES)[0],
);

const [filtersIsOpen, setFiltersIsOpen] = useState(FILTER_OPENS);
const onFilterClick = (value) =>
  setFiltersIsOpen({ ...FILTER_OPENS, [value]: !filtersIsOpen[value] });

const FILTERS = [
  {
    id: FILTER_IDS.dao,
    text: "DAO",
    hintText: "NDC grassroots DAOs",
    options: [defaultDAOOption, ...daos.map((d) => d.title)],
    values: selectedDAOs,
    defaultValue: defaultDAOOption,
    multiple: true,
    filterIsOpen: filtersIsOpen[FILTER_IDS.dao],
    onFilterClick,
    onChange: (value) => filterDAO(value),
    onClear: () => {
      setSelectedDAOs([]);
    },
  },
  {
    id: FILTER_IDS.userRetention,
    text: "User Retention",
    hintText:
      "The percentage of accounts who continue interacting on chain recently: Accounts onboarded/Accounts left",
    options: RETENTIONS,
    values: [RETENTIONS[selectedRetention]],
    filterIsOpen: filtersIsOpen[FILTER_IDS.userRetention],
    onFilterClick,
    onChange: (value) => setSelectedRetention(RETENTIONS.indexOf(value)),
  },
  {
    id: FILTER_IDS.dapUsed,
    text: "DApp's Used",
    hintText:
      "Median number of dApps used by accounts retained for more then a week",
    options: DAPPS_USED_PERIOD,
    values: [DAPPS_USED_PERIOD[0]],
    filterIsOpen: filtersIsOpen[FILTER_IDS.dapUsed],
    onFilterClick,
    onChange: (value) => {},
  },
  {
    id: FILTER_IDS.aquisitionCost,
    text: "Acquisition Cost",
    hintText:
      "Budget divided by the number of accounts interacting  through the funded initiative",
    options: Object.keys(CURRENCIES),
    values: [selectedCurrency],
    filterIsOpen: filtersIsOpen[FILTER_IDS.aquisitionCost],
    onFilterClick,
    onChange: (value) => setSelectedCurrency(value),
  },
];

const sortByDAOName = (keys) =>
  Object.keys(keys)
    .sort()
    .reduce((obj, key) => {
      obj[key] = keys[key];
      return obj;
    }, {});

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
  let newDataSet = dataSet;

  API[key](filtredDAOs).then((resp) => {
    if (!resp.body) return;

    const data = resp.body;
    if (data) {
      Object.entries(data).map(([id, value], i) => {
        newDataSet[id]
          ? (newDataSet[id][key] = value)
          : (newDataSet[id] = { [key]: value });
      });
    }

    setDataSet(newDataSet);
    setLoading(false);
  });
};

useEffect(() => {
  fetchData("userRetentions");
  fetchData("dappsUsed");
  fetchData("acquisitionCost");
}, [selectedDAOs, selectedRetention, selectedCurrency, daos]);

return (
  <ScrollableWrapper>
    <div className="d-flex gap-2 w-100">
      {FILTERS.map((filter) => (
        <Widget
          key={filter.id}
          src={`/*__@replace:widgetPath__*/.Components.Table.Filters`}
          props={{ ...filter }}
        />
      ))}
    </div>
    {loading ? (
      <Loading />
    ) : (
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Table.Cells`}
        props={{ dataSet, daos }}
      />
    )}
  </ScrollableWrapper>
);
