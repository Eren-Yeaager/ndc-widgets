const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.color};
`;

const { value, text, color, loading } = props;

const Loading = () => <Widget src="flashui.near/widget/Loading" />;

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

return (
  <div className="item">
    <div className="inner">
      {loading ? <Loading /> : <span>{formatValue(value)}</span>}
    </div>
    <div className="d-flex justify-content-center align-items-center gap-2">
      <Circle color={color} /> <span>{text}</span>
    </div>
  </div>
);
