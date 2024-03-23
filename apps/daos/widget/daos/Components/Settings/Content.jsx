let { content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!content) return <Widget src="flashui.near/widget/Loading" />;

const Form = styled.div`
  border-radius: 20px;
  background: white;
  padding: 3rem;

  label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .form-control.error {
    border: 1px solid red;
  }

  .title {
    b {
      font-weight: 600;
    }
    font-weight: 300;

    a {
      text-decoration: underline;
    }
  }
`;

const handleSave = () => {};

return (
  <Form className="d-flex flex-column gap-3">
    <h2>TBD</h2>
  </Form>
);
