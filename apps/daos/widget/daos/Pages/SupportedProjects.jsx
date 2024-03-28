let { assets, content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);

content = content.home;

const projects = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(2),
});

if (!contractName || !content || !projects)
  return <Widget src="flashui.near/widget/Loading" />;


const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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