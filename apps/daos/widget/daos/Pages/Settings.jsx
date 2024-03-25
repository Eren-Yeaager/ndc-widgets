let { contractName, content } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);
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

const [selectedDao, setSelectedDao] = useState(myDAOs[0]);

const handleSelectDao = (e) =>
  setSelectedDao(myDAOs.find((dao) => dao.id === parseInt(e.target.value)));

return (
  <Container>
    <Wrapper>
      <h2>Settings</h2>

      <div className="form-element">
        <label className="form-label">Select DAO</label>
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

      <Widget
        src="near/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "default",
          items: [
            {
              name: "General",
              value: "1",
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.General"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-gear",
            },
            {
              name: "Members",
              value: "2",
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Members"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-users",
            },
            {
              name: "Links",
              value: "3",
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Links"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-link",
            },
            {
              name: "Content",
              value: "4",
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Content"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-clipboard-text",
            },
          ],
        }}
      />
    </Wrapper>
  </Container>
);
