let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

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

const AutoComplete = styled.div`
  margin: 5px 0;
`;

const [memberText, setMemberText] = useState("");
const [handler, setHandler] = useState(null);
const [mentionInput, setMentionInput] = useState("");
const [mentionsArray, setMentionsArray] = useState([]);
const [showAccountAutocomplete, setShowAccountAutocomplete] = useState(false);

const [daoTitle, setDaoTitle] = useState("");
const [daoDescription, setDaoDescription] = useState("");
const [daoLogoUrl, setDaoLogoUrl] = useState("");
const [daoBannerUrl, setDaoBannerUrl] = useState("");
const [daoMembers, setDaoMembers] = useState([]);
const [daoAccountId, setDaoAccountId] = useState("");

useEffect(() => {
  if (selectedDao) {
    setDaoTitle(selectedDao.title);
    setDaoDescription(selectedDao.description);
    setDaoLogoUrl(selectedDao.logo_url);
    setDaoBannerUrl(selectedDao.banner_url);
    setDaoMembers(selectedDao.owners);
    setDaoAccountId(selectedDao.account_id);
  }
}, [selectedDao]);

function handleMembersChange(e) {
  const value = e.target.value;

  setMemberText(value);
  setShowAccountAutocomplete(true);
  setMentionInput(value);
  setMentionsArray([value]);
}

function handleAutoComplete(id) {
  setHandler("autocompleteSelected");
  setDaoMembers([...daoMembers, id]);
  setShowAccountAutocomplete(false);
}

const handleSave = () => {
  Near.call(contractName, "edit_dao", {
    id: selectedDao.id,
    body: {
      title: daoTitle,
      handle: selectedDao.handle,
      dao_type: selectedDao.dao_type,
      description: daoDescription,
      logo_url: daoLogoUrl,
      banner_url: daoBannerUrl,
      account_id: daoAccountId,
    },
    owners: daoMembers,
    verticals: selectedDao.verticals,
    metrics: selectedDao.metrics,
    metadata: selectedDao.metadata,
  });
};

return (
  <Form className="d-flex flex-column gap-3">
    <div className="form-element">
      <label className="form-label">Account ID</label>
      <input
        className="form-control"
        type="text"
        value={daoAccountId}
        onChange={(e) => setDaoAccountId(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Title</label>
      <input
        className="form-control"
        type="text"
        value={daoTitle}
        onChange={(e) => setDaoTitle(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Description</label>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.MarkdownEditor`}
        props={{
          element: { value: daoDescription },
          handleChange: (_element, value) => setDaoDescription(value),
        }}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Logo URL</label>
      {daoLogoUrl && (
        <div className="mb-2 w-25">
          <img className="w-25 object-fit-contain" src={daoLogoUrl} />
        </div>
      )}
      <input
        className="form-control"
        type="text"
        value={daoLogoUrl}
        onChange={(e) => setDaoLogoUrl(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Banner URL</label>
      {daoBannerUrl && (
        <div className="mb-2 w-100">
          <img className="object-fit-contain" src={daoBannerUrl} />
        </div>
      )}
      <input
        className="form-control"
        type="text"
        value={daoBannerUrl}
        onChange={(e) => setDaoBannerUrl(e.target.value)}
      />
    </div>

    <div className="form-element">
      <p>
        <b>List of members:</b>
      </p>
      <div className="my-3 d-flex flex-column gap-2">
        {daoMembers.flatMap((member) => (
          <div className="d-flex justify-content-between align-items-center">
            <Widget
              src="near/widget/AccountProfile"
              props={{ accountId: member }}
            />
            <i
              role="button"
              className="bi bi-x-lg"
              onClick={() =>
                setDaoMembers(daoMembers.filter((m) => m !== member))
              }
            />
          </div>
        ))}
      </div>

      <label className="form-label">Add new member</label>
      <input
        className="form-control"
        type="text"
        value={memberText}
        onChange={handleMembersChange}
      />

      {showAccountAutocomplete && (
        <AutoComplete>
          <Widget
            src="devhub.near/widget/devhub.components.molecule.AccountAutocomplete"
            props={{
              term: mentionInput,
              onSelect: handleAutoComplete,
              onClose: () => setShowAccountAutocomplete(false),
            }}
          />
        </AutoComplete>
      )}
    </div>

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="bi bi-pencil" />
      Save
    </button>
  </Form>
);
