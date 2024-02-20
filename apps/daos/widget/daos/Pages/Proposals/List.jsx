let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { id, daoId, type } = props;
daoId = daoId ?? 1;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const items = Near.view(contractName, "get_all_posts", {
  page: 0,
  limit: 100,
});

if (!items) return <Widget src="flashui.near/widget/Loading" />;

return (
  <Container>
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
  </Container>
);
