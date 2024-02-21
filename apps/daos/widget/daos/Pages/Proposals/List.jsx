let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { id, dao_id, type } = props;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem 0;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

let items = null;

if (dao_id)
  items = Near.view(contractName, "get_dao_posts", {
    dao_id: parseInt(dao_id),
  });
else if (id)
  items = [Near.view(contractName, "get_post_by_id", { id: parseInt(id) })];
else items = Near.view(contractName, "get_all_posts", { page: 0, limit: 100 });

if (!items) return <Widget src="flashui.near/widget/Loading" />;

return (
  <Container>
    {id ? (
      <Widget
        src="/*__@replace:widgetPath__*/.Components.Item"
        props={{
          item: items[0],
          index: items[0].id,
          type,
          id: items[0].id,
          showMoreDefault: items[0].id,
        }}
      />
    ) : (
      <>
        <div className="mb-4">
          <a
            style={{ fontSize: "24px" }}
            className="btn-primary"
            href={`//*__@replace:widgetPath__*/.App?page=create_proposal&dao_id=${dao_id}`}
          >
            CREATE POST
          </a>
        </div>
        <div className="d-flex flex-column gap-4">
          {items &&
            items
              .filter((i) => i.post_type === type)
              .map((item, index) => (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Item"
                  props={{ item, index, type, id: item.id }}
                />
              ))}
        </div>
      </>
    )}
  </Container>
);
