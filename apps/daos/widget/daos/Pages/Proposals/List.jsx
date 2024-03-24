let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { dao_id, type, accountId } = props;

const Container = styled.div`
  width: 100%;

  .dao-img {
    width: 50px;
    height: 50px;
  }

  h4 {
    margin-bottom: 0;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: left;
  img {
    margin-right: 1rem;
  }

  @media screen and (max-width: 768px) {
    align-items: center;
    flex-direction: column;
    img {
      margin-bottom: 1rem;
    }
  }
`;

let items = null;
let dao = null;

if (dao_id) {
  dao = Near.view(contractName, "get_dao_by_handle", {
    handle: dao_id,
  });

  if (!dao) <Widget src="flashui.near/widget/Loading" />;

  items = Near.view(contractName, "get_dao_posts", {
    dao_id: dao.id,
    page: 0,
    limit: 100,
  });
} else if (accountId)
  items = Near.view(contractName, "get_posts_by_author", {
    author: accountId,
    page: 0,
    limit: 100,
  });
else items = Near.view(contractName, "get_all_posts", { page: 0, limit: 100 });

if (!items) return <Widget src="flashui.near/widget/Loading" />;

return (
  <Container>
    <>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.TopNavBar`}
        props={{
          ...props,
          daoId: dao ? dao.handle : null,
          accountId,
          title: (
            <Widget
              src="/*__@replace:widgetPath__*/.Components.PageTitle"
              props={{
                text: (
                  <>
                    {dao ? dao.title : accountId ? "My" : "All"}
                    {type}s
                  </>
                ),
              }}
            />
          ),
        }}
      />

      <div className="d-flex flex-column gap-4 mt-4">
        {items && items.length > 0 ? (
          items
            .filter((i) => i.post_type === type)
            .map((item, index) => (
              <Widget
                src="/*__@replace:widgetPath__*/.Components.Post"
                props={{ item, index, type, id: item.id }}
              />
            ))
        ) : (
          <div className="w-100 my-5 d-flex justify-content-center align-tems-center">
            <h1>No active {type}s</h1>
          </div>
        )}
      </div>
    </>
  </Container>
);
