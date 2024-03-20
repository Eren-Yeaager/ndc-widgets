const config = Social.get(`/*__@replace:widgetPath__*/.Config`);

if (!config) return <Widget src="flashui.near/widget/Loading" />;
const [user, widget, name] = `/*__@replace:widgetPath__*/.Config`.split("/");
const [value, setValue] = useState(config);

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 65vh;
  margin-bottom: 5rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: space-between;

  textarea {
    font-family: monospace;
    font-size: 12px;
  }
`;

const handleSave = () => {
  if (user !== context.accountId) return;

  Social.set({
    [widget]: {
      [name]: {
        "": value,
      },
    },
  });
};

return (
  <Container>
    <Wrapper>
      <h2>Global DAOs Config File</h2>

      {user !== context.accountId && (
        <small>
          <i className="bi bi-info-circle" />
          <i>
            Config editing available only for Admin account (<b>{user}</b>)
          </i>
        </small>
      )}

      <textarea
        className="w-100 h-100"
        defaultValue={config}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={user !== context.accountId}
      >
        Edit Config
        <i className="bi bi-pencil" />
      </button>
    </Wrapper>
  </Container>
);
