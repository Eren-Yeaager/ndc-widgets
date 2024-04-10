let { assets, content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);

content = content.home;

let projects = []


// NDC
let projectsDaoId1 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(1),
});

let projectsDaoId2 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(2),
});

// Marketing DAO
let projectsDaoId4 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(4),
});

// Gaming DAO
let projectsDaoId3 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(3),
});

// Aurora Community DAO
let projectsDaoId8 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(8),
});

let projectsDaoId10 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(10),
});

if (!contractName || !content || !projects || !projectsDaoId1 || !projectsDaoId2 || !projectsDaoId4 || !projectsDaoId3 || !projectsDaoId8 || !projectsDaoId10)
  return <Widget src="flashui.near/widget/Loading" />;

projects = [...projectsDaoId1, ...projectsDaoId2, ...projectsDaoId4, ...projectsDaoId3, ...projectsDaoId8, ...projectsDaoId10] 

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 50px;
`;

return (
  <>
    {projects?.length > 0 ? (
      <Wrapper>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Dao.Communities`}
          props={{
            title: content.featuredProducts.title,
            projects: content.featuredProducts.projects.map((title) =>
              projects.find((p) => p.title === title)
            ),
          }}
        />
      </Wrapper>
    ) : (
      <></>
    )}
  </>
)