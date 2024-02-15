// Copy of old version of src/Posts/Post.jsx
let { socialKey } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, showCreate } = props;
const accountId = context.accountId;

if (!socialKey)
  return <Widget src="flashui.near/widget/Loading" />;

const Post = styled.div`
  position: relative;
  width: 100%;

  &::before {
    content: "";
    display: ${showCreate ? "none" : "block"};
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: 12px;
    width: 2px;
    background: #eceef0;
  }
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
  width: 100%;
`;

const Body = styled.div`
  padding-left: ${showCreate ? "0" : "50px"};
  padding-bottom: 5px;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: -3px 0 10px 0;
`;

const Comments = styled.div`
  > div > div:first-child {
    padding-top: 12px;
  }
`;

const CommentContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: auto;
  height: 40px;
  width: 180px;
  padding: 10px;
  background-color: #A4C2FD1A;
  border-radius: 18px;
  color: #686467;
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  
`
const [showMore, setShowMore] = useState(null);
const [liked, setLiked] = useState(false);
const [showReply, setShowReply] = useState({ [item.id]: showCreate });

const comments = Social.index("graph", `${socialKey}.reply`, { order: "desc" });
let likes = Social.index("graph", `${socialKey}.like`, { order: "desc" });
likes = likes ? likes.filter((like) => like.value.parentId === item.id) : [];
const myLike = likes ? likes.some((like) => like.value[accountId]) : false;
setLiked(myLike);

const [replies, setReplies] = useState([]);
replies = comments
  ? comments.filter((repl) => repl.value.parentId === item.id)
  : [];
setReplies(replies);

const handleLike = () => {
  Social.set({
    index: {
      graph: JSON.stringify({
        key: `${socialKey}.like`,
        value: {
          parentId: item.id,
          [accountId]: !myLike,
        },
      }),
    },
  });
};

return (
  <Post>
    {item.text && (
      <Header>
        <div className="row" style={{ width: "100%"}}>
          <div>
            <div className="d-flex gap-3 align-items-center justify-content-between">
              <Widget
                src="near/widget/AccountProfile"
                props={{
                  accountId: item.accountId,
                  hideAccountId: true,
                }}
              />
              <div className="d-flex gap-3 align-items-center justify-content-between">
                    <small>
                      {new Date(item.id).toLocaleDateString()}
                    </small>
                    <Widget
                      src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
                      props={{ text: `https://near.org/ndcdev.near/widget/daos.App?page=comments&id=${item.id}` }}
                    />
              </div>
            </div>
          </div>
        </div>
      </Header>
    )}

    <Body>
      {item.text && (
        <Content>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
            props={{ text: item.text }}
          />
        </Content>
      )}
      {item.text && item.id && (
        <Actions>
          <div
            role="button"
            className="d-flex gap-2 align-items-center"
            onClick={handleLike}
          >
            <small>{likes.length}</small>
            <i style={{color: 'black'}} className="bi bi-heart-fill" />
            Like
          </div>
          <div
            role="button"
            onClick={() => setShowReply({ [item.id]: !showReply[item.id] })}
          >
            
            <i style={{color: 'black'}} className="bi bi-chat-fill" />
            Reply
          </div>
          <div onClick={() => setShowReply({ [item.id]: !showReply[item.id] })}>
            <i className="bi bi-chevron-down fs-5 mt-1" />
              Expand Replies
              <small>({replies.length})</small>
          </div>
          <CommentContent>
            <span>
              Go to Comment
            </span>
            <Link
              to={`//*__@replace:widgetPath__*/.App?page=comments&id=${item.id}`}
            >
             <i style={{color: "#A4C2FD"}} class={'bi bi-box-arrow-up-right'}/>
            </Link>
          </CommentContent>
        </Actions>
      )}

      {showReply[item.id] && (
        <Widget
          src="/*__@replace:widgetPath__*/.Components.CreateReply"
          props={{ id: item.id }}
        />
      )}
      {(comments.length > 0 && showReply[item.id]) && (
        <div>
          {comments
            .filter((repl) => repl.value.parentId === item.id)
            .map((item) => (
              <Widget
                src="/*__@replace:widgetPath__*/.Components.ReplyItem"
                props={{ item: item.value, showCreate: false }}
              />
            ))}
        </div>
      )}
    </Body>
  </Post>
);
