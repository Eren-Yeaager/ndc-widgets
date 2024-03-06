const {
  comment,
  isLikedByMe,
  showReply,
  setShowReply,
  handleLike,
  isPreview,
  postId,
} = props;

const Body = styled.div`
  padding: 0rem 1rem;
`;

const Content = styled.div`
  .attachments {
    margin: 10px 0 20px 0;
    padding: 10px;
    border: 1px solid rgb(222 235 255);
    background: #f5f9ff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 300px;

    a {
      color: rgb(118 150 198);
      font-size: 13px;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      overflow: hidden;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: -3px 0 10px 0;

  a:hover {
    text-decoration: none;
  }
`;

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

  a:hover {
    text-decoration: none;
  }
`;

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp) / 1000000);

  return `${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`;
};

return (
  <>
    <Header>
      <div className="my-3 d-flex w-100 gap-3 align-items-center">
        <Widget
          src="near/widget/AccountProfile"
          props={{
            accountId: comment.author_id,
            hideAccountId: true,
          }}
        />
        <div className="d-flex gap-2 align-items-center justify-content-between text-secondary">
          <small>
            {comment.snapshot_history.length > 0
              ? "Edited at: "
              : "Created at: "}
            {formatDate(comment.snapshot.timestamp)}
          </small>
        </div>
        <Widget
          src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
          props={{
            text: `https://near.org/ndcdev.near/widget/daos.App?page=comments&post_id=${postId}&comment_id=${comment.id}`,
          }}
        />
        {comment.author_id === context.accountId && (
          <a
            href={`https://near.org/ndcdev.near/widget/daos.App?page=comments&post_id=${postId}&comment_id=${comment.id}&edit=true`}
          >
            <i className="bi blue bi-pencil" />
          </a>
        )}
      </div>
    </Header>
    <Post>
      <Body>
        <Content>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
            props={{ text: comment.snapshot.description }}
          />
          {comment.snapshot.attachments.length > 0 && (
            <div className="attachments">
              {comment.snapshot.attachments.map((src) => (
                <a href={src}>
                  <i className="bi bi-paperclip" /> {src}
                </a>
              ))}
            </div>
          )}
        </Content>

        {!isPreview && (
          <Actions>
            <div role="button" onClick={() => handleLike(comment.id)}>
              <small className="blue">{comment.likes.length}</small>
              <i
                className={`bi blue ${
                  isLikedByMe(comment) ? "bi-heart-fill" : "bi-heart"
                }`}
              />
            </div>
            <div
              role="button"
              onClick={() =>
                setShowReply({ [comment.id]: !showReply[comment.id] })
              }
            >
              <small className="blue">{comment.child_comments.length}</small>
              <i className="bi blue bi-chat" />
            </div>
            <Link
              to={`//*__@replace:widgetPath__*/.App?page=comments&post_id=${postId}&comment_id=${comment.id}`}
            >
              <i className={"bi blue bi-reply fs-5"} />
              <small className="blue">Reply</small>
            </Link>
          </Actions>
        )}
      </Body>
    </Post>
  </>
);
