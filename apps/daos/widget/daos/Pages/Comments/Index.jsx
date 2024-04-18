let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { post_id, comment_id, edit } = props;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem;
  margin: 3rem 0;
  border-radius: 20px;
  background: white;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const post = Near.view(contractName, "get_post_by_id", {
  id: parseInt(post_id),
});

return (
  <div className="w-100 d-flex flex-column justify-content-start">
    <Widget
      src="/*__@replace:widgetPath__*/.Components.PageTitle"
      props={{ text: "Comments" }}
    />
    <Container>
      <Widget
        src="/*__@replace:widgetPath__*/.Components.Comments"
        props={{
          postId: post_id,
          commentId: comment_id,
          showCreate: true,
        }}
      />
      <Widget
        src="/*__@replace:widgetPath__*/.Components.CreateReply"
        props={{
          postId: post_id,
          commentId: comment_id,
          edit,
        }}
      />
    </Container>
  </div>
);
