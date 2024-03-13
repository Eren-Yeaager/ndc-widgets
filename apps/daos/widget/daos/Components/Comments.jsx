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

const [showMore, setShowMore] = useState(null);
const [showReply, setShowReply] = useState({ [postId]: showCreate });

let post = Near.view(contractName, "get_post_by_id", {
  id: parseInt(postId),
});

if (!post) return <Widget src="flashui.near/widget/Loading" />;

let dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(post.dao_id),
});

let comments = Near.view(contractName, "get_post_comments", {
  post_id: parseInt(postId),
});

if (!comments || !dao) return <Widget src="flashui.near/widget/Loading" />;

const isLikedByMe = (comment) =>
  comment.likes
    ? comment.likes.some((like) => like.author_id === accountId)
    : false;

const handleLike = (id) => {
  if(!accountId) return
  Near.call(contractName, "comment_like", { id });
};

const handleSpam = (comment) => {
  if(!accountId) return
  Near.call(contractName, "change_comment_is_spam", {
    id: comment.id,
    is_spam: !comment.snapshot.is_spam,
  });
};

const commentById = (id) => comments.find((c) => c.id === id);

const CommentsList = ({ comments }) => (
  <>
    {comments.map((comment) => (
      <>
        {(!comment.snapshot.is_spam ||
          dao.owners.includes(context.accountId)) && (
          <Widget
            src="/*__@replace:widgetPath__*/.Components.Comment"
            props={{
              dao,
              comment,
              isLikedByMe,
              showReply,
              setShowReply,
              handleLike,
              handleSpam,
              isPreview: false,
              postId,
            }}
          />
        )}
        <Post>
          {comment.child_comments.length > 0 && (
            <CommentsList
              comments={comment.child_comments.map((childId) =>
                commentById(childId),
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
        props={{ postId }}
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
