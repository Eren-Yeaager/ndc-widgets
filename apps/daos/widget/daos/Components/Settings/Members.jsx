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

  @media screen and (max-width: 768px) {
    padding: 1rem;
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
const [daoMembers, setDaoMembers] = useState([]);

useEffect(() => {
  if (selectedDao) {
    setDaoMembers(selectedDao.owners);
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
  Near.call(contractName, "edit_dao_owners", {
    id: selectedDao.id,
    owners: daoMembers,
  });
};

return (
  <Form className="d-flex flex-column gap-3">
    <div className="form-element">
      <div className="mb-4 d-flex flex-column gap-3">
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
      <i className="ph ph-pencil-simple fs-5" />
      Save
    </button>
  </Form>
);
