const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  gap: 1rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const PeriodSelect = styled.div`
  width: 150px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const DAOSelect = styled.div`
  width: 50%;
  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 150px;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;

  @media screen and (max-width: 1188px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
`;

const { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

const PERIODS = [
  { name: "daily", value: 1 },
  { name: "weekly", value: 7 },
  { name: "monthly", value: 30 },
];
const defaultDAOOption = "All DAOs";
const dailyTotal = { labels: [], data: [] };
const dailyTotalUsers = { labels: [], data: [] };

const [loading, setLoading] = useState(false);
const [period, setPeriod] = useState(PERIODS[0].name);
const [selectedDAOs, setSelectedDAOs] = useState([]);
const [dataState, setDataState] = useState({
  totalTx: 0,
  totalAccounts: 0,
  uniqueAccounts: 0,
  dailyStats: [],
});

const baseUrl = "https://dashboard.chatme.page";

const get = async (url) => {
  try {
    return asyncFetch(`${baseUrl}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const daos = Near.view(contractName, "get_dao_list");
if (!daos) return <Widget src="flashui.near/widget/Loading" />;

const formatDate = () => {
  const diff = PERIODS.find((p) => p.name === period).value;
  const dateNow = new Date();
  const prevDate = new Date(new Date().setDate(new Date().getDate() - diff));

  const fmt = (date) => date.toLocaleDateString().split("/");
  return {
    startDate: `${fmt(prevDate)[2]}-${fmt(prevDate)[1]}-${fmt(prevDate)[0]}`,
    endDate: `${fmt(dateNow)[2]}-${fmt(dateNow)[1]}-${fmt(dateNow)[0]}`,
  };
};

// /api/total - General Stats
// /api/user-retention - User Retention
// /api/dapps-used - Dapps Used
// /api/social-engagement - Social Engagement
const params = `start_date=${formatDate().startDate}&end_date=${
  formatDate().endDate
}`;

const API = {
  getTotal: () =>
    get(`api/total?${params}&&dao_list=[${daos.map((d) => d.id)}]`),
  getDailyStats: () =>
    get(`api/daily-stats?${params}&&dao_list=[${daos.map((d) => d.id)}]`),
  userRetentions: (daos) =>
    get(`api/user-retention?${params}&dao_list=[${daos.map((d) => d.id)}]`),
  dappsUsed: (daos) =>
    get(`api/dapps-used?${params}&dao_list=[${daos.map((d) => d.id)}]`),
  acquisitionCost: (daos) =>
    get(`api/acquisition-cost?${params}&dao_list=[${daos.map((d) => d.id)}]`),
  socialEngagement: (daos) =>
    get(`api/social-engagement?${params}&dao_list=[${daos.map((d) => d.id)}]`),
};

const fetchData = () => {
  setLoading(true);

  API.getTotal().then((resp) => {
    if (!resp.body) return;

    const data = resp.body.data;
    const newState = dataState;
    newState.totalTx = data.transactions;
    newState.totalAccounts = data.accounts;
    newState.uniqueAccounts = data.active_users;
    setDataState(newState);
    setLoading(false);
  });

  API.getDailyStats().then((resp) => {
    if (!resp.body) return;

    const data = resp.body.data;
    const newState = dataState;
    newState.dailyStats = data;
    setDataState(newState);
    setLoading(false);
  });
};

useEffect(() => {
  fetchData();
}, [selectedDAOs, period]);

const onSelectChange = (value) => {
  const isDefaultOption = value === defaultDAOOption;

  const updateSelectedDAOs = () => {
    if (isDefaultOption) {
      const all = [...daos, defaultDAOOption];
      if (selectedDAOs.length === all.length) {
        return [];
      }
      return all;
    } else if (selectedDAOs.includes(value)) {
      return selectedDAOs.filter(
        (dao) => dao !== value && dao !== defaultDAOOption
      );
    } else {
      return [...selectedDAOs, value];
    }
  };

  setSelectedDAOs(updateSelectedDAOs());
};

const SelectContainer = styled.div`
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

return (
  <Container>
    <SelectContainer className="d-flex w-100 gap-3 justify-content-between">
      <DAOSelect>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Select`}
          props={{
            options: daos.map((d) => d.title),
            defaultValue: defaultDAOOption,
            multiple: true,
            values: selectedDAOs,
            containerClass: "selected-container",
            onClear: () => setSelectedDAOs([]),
            onChange: onSelectChange,
          }}
        />
      </DAOSelect>
      <PeriodSelect>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Select`}
          props={{
            options: PERIODS.map((v) => capitalizeFirstLetter(v.name)),
            isOpen: selectOpen,
            values: period,
            onChange: (v) => setPeriod(v.toLowerCase()),
            containerClass: "selected-container",
          }}
        />
      </PeriodSelect>
    </SelectContainer>
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Aggregators`}
      props={{
        totalTx: dataState.totalTx,
        totalAccounts: dataState.totalAccounts,
        uniqueAccounts: dataState.uniqueAccounts,
        loading,
      }}
    />
    <ChartContainer>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Chart`}
        props={{
          title: "DAILY NUMBER OF TRANSACTIONS",
          data: dataState.dailyStats,
          key: "total_transactions",
          loading,
        }}
      />
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Chart`}
        props={{
          title: "UNIQUE ACTIVE USERS",
          data: dataState.dailyStats,
          key: "unique_wallets",
          loading,
        }}
      />
    </ChartContainer>
    <div className="section py-5 flex-column">
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Table`}
        props={{ daos, API }}
      />
    </div>
  </Container>
);
