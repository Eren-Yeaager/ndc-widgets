let { content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);
if (!contractName || !content)
  return <Widget src="flashui.near/widget/Loading" />;

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

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const Contact = styled.div`
  display: flex;
  flex-direction: row;

  .form-element {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const [daoContactsName, setDaoContactsName] = useState("");
const [daoContactsTg, setDaoContactsTg] = useState("");

const [daoContacts, setDaoContacts] = useState({});

useEffect(() => {
  if (selectedDao) {
    setDaoContacts(
      selectedDao.metadata.contacts
        ? JSON.parse(selectedDao.metadata.contacts)
        : {}
    );
  }
}, [selectedDao]);

const handleAddPOC = () => {
  if (daoContactsName === "" && daoContactsTg === "") return;

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
  setDaoContactsTg("");
  setDaoContactsName("");
};

const handleSave = () => {
  Near.call(contractName, "edit_dao", {
    id: selectedDao.id,
    body: {
      title: selectedDao.title,
      handle: selectedDao.handle,
      dao_type: selectedDao.dao_type,
      description: selectedDao.description,
      logo_url: selectedDao.logo_url,
      banner_url: selectedDao.banner_url,
      account_id: selectedDao.account_id,
    },
    verticals: selectedDao.verticals,
    metrics: selectedDao.metrics,
    metadata: {
      ...selectedDao.metadata,
      contacts: JSON.stringify(daoContacts),
    },
  });
};

return (
  <Form className="d-flex flex-column gap-3">
    <div className="form-element">
      <label className="form-label">Web Site</label>
      <input
        className="form-control"
        type="text"
        value={daoContacts.website}
        onChange={(e) => {
          daoContacts.website = e.target.value;
          setDaoContacts(daoContacts);
        }}
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

    <div className="form-element">
      <label className="form-label">Dao X (Twitter)</label>
      <input
        className="form-control"
        type="text"
        value={daoContacts.twitter}
        onChange={(e) => {
          daoContacts.twitter = e.target.value;
          setDaoContacts(daoContacts);
        }}
      />
    </div>

    <h3>Point of Contacts</h3>
    {daoContacts?.poc && daoContacts?.poc.length > 0 && (
      <div className="form-element">
        <p>
          <b>List of POCs:</b>
        </p>
        <div className="d-flex flex-column gap-2">
          {daoContacts.poc.map((poc) => (
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-3 align-items-center">
                {poc.name}
                {poc.tg && (
                  <small>
                    <a
                      className="d-flex gap-1 align-items-center bg-light p-2 rounded"
                      href={`https://t.me/${poc.tg.replace("@", "")}`}
                    >
                      <i className="ph ph-telegram-logo" />
                      {poc.tg.replace("@", "")}
                    </a>
                  </small>
                )}
              </div>
              <i
                role="button"
                className="bi bi-x-lg"
                onClick={() =>
                  setDaoContacts({
                    ...daoContacts,
                    poc: daoContacts.poc.filter((p) => p.tg != poc.tg),
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    )}
    <Contact className="w-100 gap-2">
      <div className="w-100 d-flex gap-2">
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
      </div>
      <div className="form-element d-flex align-items-end">
        <button
          className="btn btn-secondary"
          disabled={daoContactsName === "" && daoContactsTg === ""}
          onClick={handleAddPOC}
        >
          <i className="ph ph-plus fs-5" />
          Add POC
        </button>
      </div>
    </Contact>

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="ph ph-pencil-simple fs-5" />
      Save
    </button>
  </Form>
);
