let { content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!content) return <Widget src="flashui.near/widget/Loading" />;

const handleSave = () => {};

return (
  <div className="d-flex flex-column gap-3">
    <h2>TBD</h2>
  </div>
);
