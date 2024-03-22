let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 5rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  textarea {
    font-family: monospace;
    font-size: 12px;
  }
`;

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

const daos = Near.view(contractName, "get_dao_list", {});

if (!daos) return <Widget src="flashui.near/widget/Loading" />;

const myDAOs = daos.filter((dao) => dao.owners.includes(context.accountId));

if (myDAOs.length === 0)
  return (
    <Container>
      <Wrapper>
        <h2>You're not allowed to make DAOs changes</h2>
      </Wrapper>
    </Container>
  );

const [memberText, setMemberText] = useState("");
const [handler, setHandler] = useState(null);
const [mentionInput, setMentionInput] = useState("");
const [mentionsArray, setMentionsArray] = useState([]);
const [showAccountAutocomplete, setShowAccountAutocomplete] = useState(false);

const defaultDao = myDAOs[0];
const [selectedDao, setSelectedDao] = useState(defaultDao);
const [daoTitle, setDaoTitle] = useState(defaultDao.title);
const [daoDescription, setDaoDescription] = useState(defaultDao.description);
const [daoLogoUrl, setDaoLogoUrl] = useState(defaultDao.logo_url);
const [daoBannerUrl, setDaoBannerUrl] = useState(defaultDao.banner_url);
const [daoMembers, setDaoMembers] = useState(defaultDao.owners);
const [daoAccountId, setDaoAccountId] = useState(defaultDao.account_id);

useEffect(() => {
  setDaoTitle(selectedDao.title);
  setDaoDescription(selectedDao.description);
  setDaoLogoUrl(selectedDao.logo_url);
  setDaoBannerUrl(selectedDao.banner_url);
  setDaoMembers(selectedDao.owners);
  setDaoAccountId(selectedDao.account_id);
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

const handleSelectDao = (e) =>
  setSelectedDao(myDAOs.find((dao) => dao.id === parseInt(e.target.value)));

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
  <Container>
    <Wrapper>
      <h2>Settings</h2>

      <div className="form-element">
        <label>Select DAO</label>
        <select
          className="form-control"
          value={selectedDao.id}
          onChange={handleSelectDao}
        >
          {myDAOs.map((dao) => (
            <option value={dao.id}>{dao.title}</option>
          ))}
        </select>
      </div>

      <Form className="d-flex flex-column gap-3">
        <h3>DAO Info</h3>
        <div className="form-element">
          <label>Account ID</label>
          <input
            className="form-control"
            type="text"
            value={daoAccountId}
            onChange={(e) => setDaoAccountId(e.target.value)}
          />
        </div>

        <div className="form-element">
          <label>Title</label>
          <input
            className="form-control"
            type="text"
            value={daoTitle}
            onChange={(e) => setDaoTitle(e.target.value)}
          />
        </div>

        <div className="form-element">
          <label>Description</label>
          <textarea
            className="form-control"
            value={daoDescription}
            onChange={(e) => setDaoTitle(e.target.value)}
          />
        </div>

        <div className="form-element">
          <label>Logo URL</label>
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
          <label>Banner URL</label>
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
          <div className="my-3 d-flex flex-column gap-1">
            {daoMembers.flatMap((member) => (
              <div className="d-flex w-25 justify-content-between align-items-center">
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

          <label>Add new member</label>
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
    </Wrapper>
  </Container>
);
