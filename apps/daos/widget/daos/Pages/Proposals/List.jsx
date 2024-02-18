let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const { id, daoId, type } = props;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const items = Near.view(contractName, "get_dao_posts", {
  dao_id: parseInt(daoId),
  status: "InReview",
});

return (
  <Container>
    {daoId && (
      <>
        <div className="mb-4">
          <a
            style={{ background: "#A4C2FD" }}
            className="btn-primary"
            href={`//*__@replace:widgetPath__*/.App?page=create_proposal&daoId=${daoId}`}
          >
            <span style={{ fontSize: "24px", width: "20%", margin: "auto" }}>
              CREATE POST
            </span>
          </a>
        </div>
        <div className="d-flex flex-column gap-4">
          {items &&
            items
              .filter((i) => i.post_type === type)
              .map((item, index) => (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Item"
                  props={{ item, index, type }}
                />
              ))}
        </div>
      </>
    )}
  </Container>
);
