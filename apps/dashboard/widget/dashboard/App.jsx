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

const SelectContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  color: #1b1b18;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Filters = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
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

const defaultDAOOption = "All DAOs";
const dailyTotal = { labels: [], data: [] };
const dailyTotalUsers = { labels: [], data: [] };
const today = new Date();

const [loading, setLoading] = useState(false);
const [period, setPeriod] = useState([
  today,
  new Date(today.setMonth(today.getMonth() - 1)),
]);
const [dateRange, setDateRange] = useState("");
const [selectedDAOs, setSelectedDAOs] = useState([]);
const [dashboardView, setDashboardView] = useState("Table");
const [dataState, setDataState] = useState({
  totalTx: 0,
  totalAccounts: 0,
  uniqueAccounts: 0,
  totalBalance: 0,
  distributed: 0,
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

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const daos = Near.view(contractName, "get_dao_list");
if (!daos) return <Widget src="flashui.near/widget/Loading" />;

const formatDate = () => {
  const fmt = (date) => date.toLocaleDateString().split("/");
  const startDate = `${fmt(period[0])[2]}-${fmt(period[0])[1]}-${
    fmt(period[0])[0]
  }`;
  const endDate = `${fmt(period[1])[2]}-${fmt(period[1])[1]}-${
    fmt(period[1])[0]
  }`;

  setDateRange(`start_date=${startDate}&end_date=${endDate}`);
};

const API = {
  getTotal: () =>
    get(`api/total?${dateRange}&&dao_list=[${daos.map((d) => d.id)}]`),
  getDailyStats: () =>
    get(`api/daily-stats?${dateRange}&&dao_list=[${daos.map((d) => d.id)}]`),
  userRetentions: (daos) =>
    get(`api/user-retention?${dateRange}&dao_list=[${daos.map((d) => d.id)}]`),
  dappsUsed: (daos) =>
    get(`api/dapps-used?${dateRange}&dao_list=[${daos.map((d) => d.id)}]`),
  acquisitionCost: (daos) =>
    get(
      `api/acquisition-cost?${dateRange}&dao_list=[${daos.map((d) => d.id)}]`
    ),
  socialEngagement: (daos) =>
    get(
      `api/social-engagement?${dateRange}&dao_list=[${daos.map((d) => d.id)}]`
    ),
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
    newState.totalBalance = data.totalBalance;
    newState.distributed = data.distributed;
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
  formatDate();
}, [period]);

useEffect(() => {
  if (dateRange) fetchData();
}, [selectedDAOs, daos, dateRange]);

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

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

return (
  <Container>
    <SelectContainer>
      <Title>NDC Dashboard</Title>
      <Filters>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.DatePicker`}
          props={{
            period,
            handleChange: ({ startDate, endDate }) =>
              setPeriod([startDate, endDate]),
          }}
        />

        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Switch`}
          props={{
            options: [
              { title: "Charts", icon: "ph ph-chart-bar" },
              { title: "Table", icon: "ph ph-table" },
            ],
            value: dashboardView,
            onChange: () =>
              setDashboardView(dashboardView === "Charts" ? "Table" : "Charts"),
          }}
        />
      </Filters>
    </SelectContainer>
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Aggregators`}
      props={{
        totalTx: dataState.totalTx,
        totalAccounts: dataState.totalAccounts,
        uniqueAccounts: dataState.uniqueAccounts,
        totalBalance: dataState.totalBalance,
        totalDistributed: dataState.distributed,
      }}
    />
    {dashboardView === "Charts" ? (
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
    ) : (
      <div className="w-100 flex-column">
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Table`}
          props={{ daos, API, period }}
        />
      </div>
    )}
  </Container>
);
