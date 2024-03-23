let { content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!content) return <Widget src="flashui.near/widget/Loading" />;

const { selectedDao } = props;

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

  daoContacts.poc = poc;
  setDaoContacts(daoContacts);
};

const handleSave = () => {};

return (
  <div className="d-flex flex-column gap-3">
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
                className="d-flex gap-1 align-items-center"
                href={`https://t.me/${tg.replace("@", "")}`}
              >
                <i className="ph ph-telegram-logo" />
                {tg.replace("@", "")}
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
          <button className="btn btn-secondary" onClick={handleAddPOC}>
            <i className="ph ph-plus fs-6" />
            Add new POC
          </button>
        </div>
      </div>
    </div>

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="ph ph-pencil-simple fs-6" />
      Save
    </button>
  </div>
);
