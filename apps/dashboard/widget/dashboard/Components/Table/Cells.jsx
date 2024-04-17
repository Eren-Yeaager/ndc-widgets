const Row = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 72px;
  align-self: stretch;
  border-bottom: 1px solid #e3e3e0;
`;

const Cell = styled.div`
  min-width: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  position: relative;
  border-radius: 100px;
  background: #f5f5f5;
  padding: 5px 0;

  &.dao-name {
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
    font-size: 16px;
    font-weight: 600;
    justify-content: flex-start;
    background: transparent;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  padding-top: 1rem;
  -webkit-overflow-scrolling: touch;

  @media screen and (max-width: 1341px) {
    padding-bottom: 1rem;
  }
`;

const Colored = styled.div`
  height: 100%;
  position: absolute;
  left: 0;
  width: ${(props) => props.width}%;
  background: ${(props) => props.color};
  border-radius: ${(props) =>
    props.width === 100 ? "100px" : "100px 0 0 100px"};
`;

const getPercentage = (start, end, divider) => {
  const val = parseInt(((end / start) * 100) / (divider ?? 1));

  return val > 100 ? 100 : val;
};

const formatValue = (value) => {
  const val = value ? parseFloat(value) : null;

  if (!val) return "n/a";

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

const { dataSet } = props;

const TooltipContent = ({ key, value }) => (
  <div className="justify-content-between w-100 d-flex gap-2">
    <div>{key}:</div> <div>{formatValue(value)}</div>
  </div>
);

const DaoName = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

return (
  <Container>
    {dataSet.map(
      ({ title, userRetentions, dappsUsed, acquisitionCost }, index) => (
        <Row key={index}>
          <Cell className="dao-name">{title}</Cell>
          <Cell>
            <Colored
              width={getPercentage(userRetentions, 10, 2)}
              color={userRetentions >= 1 ? "#51D38E" : "#FC6F60"}
            />
            <div className="position-relative">
              <Widget
                src={`/*__@replace:widgetPath__*/.Components.Tooltip`}
                props={{
                  content: (
                    <>
                      <TooltipContent key="Start" value={userRetentions} />
                    </>
                  ),
                  minWidth: "max-content",
                  icon: <i>{formatValue(userRetentions)}</i>,
                }}
              />
            </div>
          </Cell>
          <Cell>
            <Colored
              width={getPercentage(dappsUsed, 10, 2)}
              color={"#51D38E"}
            />
            <div className="position-relative">{formatValue(dappsUsed)}</div>
          </Cell>
          <Cell>
            <Colored
              width={getPercentage(acquisitionCost, 10, 2)}
              color={acquisitionCost < 1 ? "#51D38E" : "#FC6F60"}
            />
            <div className="position-relative">
              <Widget
                src={`/*__@replace:widgetPath__*/.Components.Tooltip`}
                props={{
                  content: (
                    <>
                      <TooltipContent key="Accounts" value={acquisitionCost} />
                    </>
                  ),
                  minWidth: "max-content",
                  icon: <i>{formatValue(acquisitionCost)}</i>,
                }}
              />
            </div>
          </Cell>
        </Row>
      )
    )}
  </Container>
);
