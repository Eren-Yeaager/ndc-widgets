let { contractName, content } = VM.require(
  `/*__@replace:widgetPath__*/.Config`,
);
if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;

  textarea {
    font-family: monospace;
    font-size: 12px;
  }

  div[role="tablist"] {
    width: 100%;
    overflow-x: scroll;

    button {
      text-wrap: nowrap;
    }
  }
`;

const daos = Near.view(contractName, "get_dao_list", {});

if (!daos) return <Widget src="flashui.near/widget/Loading" />;

const myDAOs = daos.filter((dao) => dao.owners.includes(context.accountId));

if (myDAOs.length === 0)
  return (
    <Container>
      <Wrapper>
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <h2>You're not allowed for DAO settings</h2>
          <p>Ask DAO member to add you through settings</p>
        </div>
      </Wrapper>
    </Container>
  );

const [selectedDao, setSelectedDao] = useState(
  props.dao ? myDAOs.find((dao) => dao.handle === props.dao) : myDAOs[0],
);

return (
  <Container>
    <Wrapper>
      <Widget
        src="/*__@replace:widgetPath__*/.Components.PageTitle"
        props={{ text: `${selectedDao.title} Settings` }}
      />

      <div className="form-element">
        <label className="form-label">Select DAO</label>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Select`}
          props={{
            options: myDAOs.map((dao) => [dao.handle, dao.title]),
            value: selectedDao.title,
          }}
        />
      </div>

      <Widget
        src="near/widget/DIG.Tabs"
        props={{
          variant: "line",
          size: "default",
          items: [
            {
              name: "General",
              value: 1,
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
              value: 2,
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Members"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-users",
            },
            {
              name: "Communities",
              value: 3,
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Communities"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-users-three",
            },
            {
              name: "Contacts",
              value: 4,
              content: (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Settings.Contacts"
                  props={{ selectedDao }}
                />
              ),
              icon: "ph ph-link",
            },
            {
              name: "Content",
              value: 5,
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
