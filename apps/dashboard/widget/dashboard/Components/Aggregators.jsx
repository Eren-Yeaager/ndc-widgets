const Items = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: 1188px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .item {
    color: #fcf8ff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200px;
    gap: 1rem;
    border-radius: 30px;
    background: #1e1d22;
    box-shadow: 0px 30px 40px 0px rgba(0, 0, 0, 0.3);
    font-size: 20px;
    font-weight: 750;
    text-align: center;

    @media screen and (max-width: 975px) {
      width: 100%;
    }

    .inner {
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      padding: 10px 20px;
      span {
        font-size: 60px;
      }
    }
  }
`;

const { totalTx, totalAccounts, uniqueAccounts, loading } = props;

const Item = ({ value, text, color }) => {
  return (
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Aggregators.Item`}
      props={{ value, text, color }}
    />
  );
};

return (
  <Items>
    <Item
      value={totalTx}
      loading={loading}
      text="Total Number of Transactions"
      color="#A39ACD"
    />
    <Item
      value={totalAccounts}
      loading={loading}
      text="Total Number of Accounts"
      color="#5398DD"
    />
    <Item
      value={uniqueAccounts}
      loading={loading}
      text="Today Unique Active Users"
      color="#E89DBB"
    />
  </Items>
);
