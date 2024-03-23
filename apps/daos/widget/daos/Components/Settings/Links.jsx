let { content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!content) return <Widget src="flashui.near/widget/Loading" />;

const { selectedDao } = props;

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

const [daoContactsName, setDaoContactsName] = useState("");
const [daoContactsTg, setDaoContactsTg] = useState("");
const [daoWebsite, setDaoWebsite] = useState("");
const [daoContacts, setDaoContacts] = useState({});

useEffect(() => {
  if (selectedDao) {
    setDaoWebsite(content.daos[selectedDao.handle].customUrl);
    setDaoContacts(content.daos[selectedDao.handle].sections.contacts);
  }
}, [selectedDao]);

const handleAddPOC = () => {
  const poc = [
    ...(daoContacts.poc ?? []),
    ...[
      {
        name: daoContactsName,
        tg: daoContactsTg,
      },
    ],
  ];
  console.log(content);
  daoContacts.poc = poc;
  setDaoContacts(daoContacts);
};

const handleSave = () => {};

return (
  <Form className="d-flex flex-column gap-3">
    <div className="form-element">
      <label className="form-label">Web Site</label>
      <input
        className="form-control"
        type="text"
        value={daoWebsite}
        onChange={(e) => setDaoWebsite(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Admin wallet</label>
      <input
        className="form-control"
        type="text"
        value={daoContacts.admin}
        onChange={(e) => {
          daoContacts.admin = e.target.value;
          setDaoContacts(daoContacts);
        }}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Dao Telegram</label>
      <input
        className="form-control"
        type="text"
        value={daoContacts.tg}
        onChange={(e) => {
          daoContacts.tg = e.target.value;
          setDaoContacts(daoContacts);
        }}
      />
    </div>

    {daoContacts?.poc && daoContacts?.poc.length > 0 && (
      <div className="form-element">
        <p>
          <b>List of POCs:</b>
        </p>
        <div className="d-flex flex-column gap-2">
          {daoContacts.poc.map(({ name, tg }) => (
            <div className="d-flex gap-3">
              {name}
              <a
                className="d-flex gap-1"
                href={`https://t.me/${tg.replace("@", "")}`}
              >
                (<i className="bi bi-telegram" />
                {tg.replace("@", "")})
              </a>
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <div className="d-flex gap-2">
        <div className="form-element">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            type="text"
            value={daoContactsName}
            onChange={(e) => setDaoContactsName(e.target.value)}
          />
        </div>
        <div className="form-element">
          <label className="form-label">Telegram handle</label>
          <input
            className="form-control"
            placeholder="@tg_handle"
            type="text"
            value={daoContactsTg}
            onChange={(e) => setDaoContactsTg(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-end">
          <button className="btn btn-primary" onClick={handleAddPOC}>
            <i className="bi bi-plus-lg" />
            Add new POC
          </button>
        </div>
      </div>
    </div>

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="bi bi-pencil" />
      Save
    </button>
  </Form>
);
