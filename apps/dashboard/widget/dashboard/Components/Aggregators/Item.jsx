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
    <div className="value">{loading ? <Loading /> : formatValue(value)}</div>
    <div className="divider" />
    <div className="title">{text}</div>
  </div>
);
