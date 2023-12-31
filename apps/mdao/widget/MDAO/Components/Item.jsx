const { item, index, showMoreDefault, showRepliesDefault } = props;
let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
assets = assets.home;
content = content.home;
const accountId = context.accountId;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);
  padding: 2rem 3rem;

  h3 {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    margin: 10px 0;
  }

  p {
    font-size: 14px;
  }

  .metric {
    border-radius: 10px;
    height: 80px;
    width: 120px;
    background: linear-gradient(
      258deg,
      rgba(162, 195, 254, 0.5) 0%,
      rgba(225, 197, 252, 0.5) 28.72%,
      rgba(241, 220, 210, 0.5) 100%
    );
    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .info {
    display: flex;
    align-items: center;
  }

  .actions {
    margin-top: 1rem;
    gap: 3rem;

    @media screen and (max-width: 786px) {
      gap: 0;
      justify-content: space-between;
    }
  }

  .tag {
    border-radius: 50px;
    background: #a4c2fd;
    width: 140px;
    padding: 2px 0;
    text-align: center;
    color: white;
  }

  @media screen and (max-width: 786px) {
    padding: 1.5rem;
  }
`;

const Replies = styled.div`
  border-top: 1px solid #efefef;
  padding-top: 1rem;
`;

const [showMore, setShowMore] = useState(showMoreDefault);
const [showReply, setShowReply] = useState(showRepliesDefault);
const [copiedShareUrl, setCopiedShareUrl] = useState(false);

const [replies, setReplies] = useState([]);
const [liked, setLiked] = useState(false);

const likes = Social.index("graph", "v3.ndc.mdao.like", { order: "desc" });
likes = likes ? likes.filter((like) => like.value.parentId === item.id) : [];
const myLike = likes ? likes.some((like) => like.value[accountId]) : false;
setLiked(myLike);

const handleLike = () => {
  Social.set({
    index: {
      graph: JSON.stringify({
        key: "v3.ndc.mdao.like",
        value: {
          parentId: item.id,
          [accountId]: !myLike,
        },
      }),
    },
  });
};

const CardItem = ({ item, index }) => (
  <div>
    <Card key={index} className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <Widget
          src="mob.near/widget/Profile"
          props={{
            accountId: item.accountId,
            tooltip: true,
          }}
        />
        <div className="d-flex gap-2">
          <small>
            <i className="bi bi-clock" />
            {new Date(item.id).toLocaleDateString()}
          </small>
        </div>
      </div>
      <div className="d-flex flex-column gap-1">
        <h3>
          <Link
            to={`//*__@replace:widgetPath__*/.App?page=proposals&id=${item.id}`}
          >
            {item.project_name}
          </Link>
        </h3>
        <div className="d-flex flex-column gap-1">
          {item.type === "proposal" && (
            <div className="info">
              <small style={{ width: "150px" }}>Requested amount:</small>
              <small>{item.requested_amount ?? 0} USD</small>
            </div>
          )}
          <div className="info">
            <small style={{ width: "150px" }}>Requested sponsor:</small>
            <div className="d-flex align-items-center gap-1">
              <small>
                <Widget
                  src="mob.near/widget/ProfileImage"
                  props={{
                    accountId: content.daoAccountId,
                    style: { height: "20px", width: "20px" },
                  }}
                />
              </small>
              <small>{content.dao}</small>
            </div>
          </div>
          {item.attachments && (
            <div className="info">
              <small style={{ width: "150px" }}>Attachments:</small>
              <small>
                <a href={item.attachments} download>
                  <i className="bi bi-download" />
                  Download File
                </a>
              </small>
            </div>
          )}
          {item.contact && (
            <div className="info">
              <small style={{ width: "150px" }}>Contact telegram:</small>
              <small>{item.contact}</small>
            </div>
          )}
        </div>
      </div>
      <small>
        <div
          role="button"
          className="d-flex gap-2 align-items-center"
          onClick={() => setShowMore(showMore === index ? null : index)}
        >
          <i
            className={`fs-5 bi ${
              showMore === index ? "bi-eye-slash" : "bi-eye"
            }`}
          />
          <b>See more</b>
        </div>
      </small>

      {showMore === index && (
        <>
          {item.type === "report" ? (
            <>
              <div>
                <small>
                  <b>Metrics</b>
                </small>
                <div className="d-flex flex-wrap gap-2">
                  <div className="metric d-flex flex-column justify-content-center align-items-center">
                    <small>Audience</small>
                    <b>{item["metric:audience"]}%</b>
                  </div>
                  <div className="metric d-flex flex-column justify-content-center align-items-center">
                    <small>AER</small>
                    <b>{item["metric:average_engagement_rate"]}%</b>
                  </div>
                  <div className="metric d-flex flex-column justify-content-center align-items-center">
                    <small>Growth</small>
                    <b>{item["metric:growth"]}%</b>
                  </div>
                </div>
              </div>
              <div>
                <small>
                  <b>
                    Performance Statement: What is the biggest win (most
                    improved part of project) during this funding period vs. the
                    previous one (if applicable)?
                  </b>
                </small>
                <Widget
                  src="mob.near/widget/SocialMarkdown"
                  props={{ text: item["performance_statement:answer_1"] }}
                />
              </div>
              <div>
                <small>
                  <b>
                    Performance statement: What is the biggest challenge your
                    project is facing? What did not improve during this funding
                    period?
                  </b>
                </small>
                <Widget
                  src="mob.near/widget/SocialMarkdown"
                  props={{ text: item["performance_statement:answer_2"] }}
                />
              </div>
            </>
          ) : (
            <p>
              <Widget
                src="mob.near/widget/SocialMarkdown"
                props={{ text: item.description }}
              />
            </p>
          )}
        </>
      )}

      {item.tag && (
        <div className="d-flex flex-wrap gap-2">
          {item.tag?.map((tag) => (
            <div className="tag">{tag}</div>
          ))}
        </div>
      )}
      <div className="actions d-flex">
        <div role="button" className="d-flex gap-2" onClick={handleLike}>
          {likes.length}
          <i className={`bi bi-heart${liked ? "-fill" : ""}`} /> Like
        </div>

        <div
          role="button"
          className="d-flex gap-2"
          onClick={() => setShowReply(!showReply)}
        >
          <i className="bi bi-chat" />
          Reply
        </div>
        <div
          role="button"
          className="d-flex gap-2"
          onClick={() => {
            clipboard
              .writeText(
                `https://near.org//*__@replace:widgetPath__*/.App?page=${item.type}s&id=${item.id}`,
              )
              .then(() => setCopiedShareUrl(true));
          }}
        >
          <i className="bi bi-share" />
          {copiedShareUrl ? "Copied Url" : "Share"}
        </div>
      </div>

      <Replies>
        {showReply && (
          <Widget
            src="/*__@replace:widgetPath__*/.Components.ReplyItem"
            props={{ item, showCreate: true }}
          />
        )}
      </Replies>
    </Card>
  </div>
);

return <CardItem item={item} index={index} />;
