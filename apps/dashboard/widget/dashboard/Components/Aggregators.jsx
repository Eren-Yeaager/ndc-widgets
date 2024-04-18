const Items = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;

  .item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    border: 1px solid #e3e3e0;
    background: #fff;
    padding: 16px 32px;
    width: 400px;
    gap: 1.5rem;
    box-shadow:
      0px 97px 27px 0px rgba(0, 0, 0, 0),
      0px 62px 25px 0px rgba(0, 0, 0, 0),
      0px 35px 21px 0px rgba(0, 0, 0, 0.02),
      0px 16px 16px 0px rgba(0, 0, 0, 0.03),
      0px 4px 9px 0px rgba(0, 0, 0, 0.03);

    .title {
      color: #5c656a;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 18px;
      width: 120px;
    }

    @media screen and (max-width: 975px) {
      width: 100%;
    }

    .divider {
      width: 1px;
      height: 50px;
      background: #e3e3e0;
    }

    .value {
      color: #1b1b18;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-align: center;
    }
  }
`;

const { totalTx, totalAccounts, uniqueAccounts } = props;

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
    <Item value={totalTx} text="Total Number of Transactions" color="#A39ACD" />
    <Item
      value={totalAccounts}
      text="Total Number of Accounts"
      color="#5398DD"
    />
    <Item
      value={uniqueAccounts}
      text="Today Unique Active Users"
      color="#E89DBB"
    />
  </Items>
);
