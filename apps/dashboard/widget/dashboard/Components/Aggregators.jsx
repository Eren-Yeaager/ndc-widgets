const Items = styled.div`
  display: flex;
  width: 100%;
  height: 220px;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;

  .item {
    display: flex;
    flex-direction: column;
    gap: 1reml
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    border: 1px solid #e3e3e0;
    background: #fff;
    padding: 16px 32px;
    width: 240px;
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
      text-align: center;
      width: 115px;
    }

    @media screen and (max-width: 975px) {
      width: 100%;
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

const {
  totalTx,
  totalAccounts,
  uniqueAccounts,
  totalBalance,
  totalDistributed,
} = props;

const Item = ({ value, text }) => {
  const formatValue = (value) => {
    const val = parseFloat(value);

    return val >= 1000000000
      ? `${parseFloat(val / 1000000000).toFixed(2)}B`
      : val >= 1000000
      ? `${parseFloat(val / 1000000).toFixed(2)}M`
      : val >= 1000
      ? `${parseFloat(val / 1000).toFixed(2)}K`
      : Number.isInteger(val)
      ? val
      : val.toFixed(2);
  };
  return (
    <div className="item">
      <div className="value">{value ? formatValue(value) : "n/a"}</div>
      <div className="title">{text}</div>
    </div>
  );
};

return (
  <Items>
    <Item value={totalBalance} text="Total amount of NEAR" />
    <Item value={totalDistributed} text="Total distributed amount of NEAR" />
    <Item value={totalTx} text="Number of Transactions" />
    <Item value={totalAccounts} text="Number of Accounts" />
    <Item value={uniqueAccounts} text="Unique Active Users" />
  </Items>
);
