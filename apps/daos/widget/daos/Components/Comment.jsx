const {
  dao,
  comment,
  isLikedByMe,
  showReply,
  setShowReply,
  handleLike,
  handleSpam,
  isPreview,
  postId,
} = props;

const Body = styled.div`
  padding: 0rem 1rem;
  @media screen and (max-width: 786px) {
    padding-bottom: 50px;
  }
`;

const Content = styled.div`
  .datetime {
    font-style: italic;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin: -3px 0 10px 0;

  a:hover {
    text-decoration: none;
  }

  @media screen and (max-width: 786px) {
    justify-content: space-between;
    gap: 5px;
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
      <div className="mt-3 d-flex w-100 gap-3 align-items-center">
        <Widget
          src="near/widget/AccountProfile"
          props={{
            accountId: comment.author_id,
            hideAccountId: true,
          }}
        />
        {comment.author_id === context.accountId && (
          <a
            href={`https://near.org/ndcdev.near/widget/daos.App?page=comments&post_id=${postId}&comment_id=${comment.id}&edit=true`}
          >
            <i className="bi blue bi-pencil-fill" />
          </a>
        )}
      </div>
    </Header>
    <Post>
      <Body>
        <Content>
          <div className="datetime d-flex gap-2 mb-2 mt-1 align-items-center justify-content-between text-secondary">
            Updated at: {formatDate(comment.snapshot.timestamp)}
          </div>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
            props={{ text: comment.snapshot.description }}
          />
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.Attachment"}
            props={{ attachments: comment.snapshot.attachments }}
          />
        </Content>

        {!isPreview && (
          <Actions>
            <div
              role="button"
              className="d-flex gap-1 align-items-center"
              onClick={() => {
                if(isLikedByMe(comment)) return;
                handleLike(comment.id)
              }}
            >
              <small className="blue">{comment.likes.length}</small>
              <i
                className={`bi blue ${
                  isLikedByMe(comment) ? "bi-heart-fill" : "bi-heart"
                }`}
              />
            </div>
            <Link
              className="d-flex gap-1 align-items-center"
              to={`//*__@replace:widgetPath__*/.App?page=comments&post_id=${postId}&comment_id=${comment.id}`}
            >
              <small className="blue">{comment.child_comments.length}</small>
              <i className={"bi blue bi-reply fs-5"} />
            </Link>

            <Widget
              src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
              props={{
                text: `https://near.org/ndcdev.near/widget/daos.App?page=comments&post_id=${postId}&comment_id=${comment.id}`,
              }}
            />
            {dao.owners.includes(context.accountId) && (
              <div role="button" onClick={() => handleSpam(comment)}>
                <i
                  className={
                    comment.snapshot.is_spam
                      ? "bi red bi-flag-fill"
                      : "bi blue bi-flag"
                  }
                />
              </div>
            )}
          </Actions>
        )}
      </Body>
    </Post>
  </>
);
