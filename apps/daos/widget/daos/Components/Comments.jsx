let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const { postId, commentId, showCreate } = props;
const accountId = context.accountId;

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const Post = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgb(241 241 241);
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
  width: 100%;
`;

const Body = styled.div`
  padding: 0rem 1rem;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: -3px 0 10px 0;
`;

const [showMore, setShowMore] = useState(null);
const [showReply, setShowReply] = useState({ [postId]: showCreate });

const comments = Near.view(contractName, "get_post_comments", {
  post_id: parseInt(postId),
});

if (!comments) return <Widget src="flashui.near/widget/Loading" />;

const isLikedByMe = (comment) =>
  comment.likes
    ? comment.likes.some((like) => like.author_id === accountId)
    : false;

const handleLike = (id) => {
  Near.call(contractName, "comment_like", { id });
};

const formatDate = (timestamp) =>
  new Date(parseInt(timestamp) / 1000000).toLocaleDateString();

const CommentCard = ({ comment }) => (
  <Body>
    <Content>
      <Widget
        src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
        props={{ text: comment.snapshot.description }}
      />
    </Content>

    <Actions>
      <div
        role="button"
        className="d-flex gap-2 align-items-center"
        onClick={() => handleLike(comment.id)}
      >
        <small className="blue">{comment.likes.length}</small>
        <i
          className={`bi blue ${
            isLikedByMe(comment) ? "bi-heart-fill" : "bi-heart"
          }`}
        />
      </div>
      <div
        role="button"
        onClick={() => setShowReply({ [comment.id]: !showReply[comment.id] })}
      >
        <small className="blue">{comment.child_comments.length}</small>
        <i className="bi blue bi-chat" />
      </div>
      <Link
        to={`//*__@replace:widgetPath__*/.App?page=comments&post_id=${postId}&comment_id=${comment.id}`}
      >
        <i class={"bi blue bi-share"} />
      </Link>
    </Actions>
  </Body>
);

const commentById = (id) => comments.find((c) => c.id === id);

const CommentsList = ({ comments }) => (
  <>
    {comments.map((comment) => (
      <>
        <Header>
          <div className="my-3 d-flex gap-3 align-items-center justify-content-between">
            <Widget
              src="near/widget/AccountProfile"
              props={{
                accountId: comment.author_id,
                hideAccountId: true,
              }}
            />
            <div className="d-flex gap-2 align-items-center justify-content-between">
              <i className="bi bi-clock" />
              <small>{formatDate(comment.snapshot.timestamp)}</small>
            </div>
          </div>
        </Header>
        <Post>
          <CommentCard comment={comment} />

          {comment.child_comments.length > 0 && (
            <CommentsList
              comments={comment.child_comments.map((childId) =>
                commentById(childId)
              )}
            />
          )}
        </Post>
      </>
    ))}
  </>
);

return (
  <>
    {!commentId && (
      <Widget
        src="/*__@replace:widgetPath__*/.Components.CreateReply"
        props={{ id: postId }}
      />
    )}

    <CommentsList
      comments={
        commentId
          ? comments.filter((c) => c.id === parseInt(commentId))
          : comments.filter((c) => !c.parent_comment)
      }
    />
  </>
);
