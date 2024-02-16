const { item, index, showMoreDefault, showRepliesDefault } = props;
let { assets, content, socialKey } = VM.require(
  `/*__@replace:widgetPath__*/.Config`,
);
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
    min-width: 140px;
    width: max-content;
    padding: 4px 15px;
    font-size: 14px;
    text-align: center;
    color: white;
  }

  @media screen and (max-width: 786px) {
    padding: 1.5rem;
  }

  :hover {
    background: #ffffff;
  } 
`;

const Replies = styled.div`
  border-top: 1px solid #efefef;
  padding-top: 1rem;
`;

const ProposalContent = styled.div`
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

const CardContainer = styled.div`
  padding: 3px;
  :hover {
    position: relative;
    border-radius: 10px;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
  }
`

const [showMore, setShowMore] = useState(showMoreDefault);
const [showReply, setShowReply] = useState(showRepliesDefault);
const [copiedShareUrl, setCopiedShareUrl] = useState(false);
const pageName = props.type === 'report' ? 'reports' : 'proposals';

const [liked, setLiked] = useState(false);
const likes = Social.index("graph", `${socialKey}.like`, { order: "desc" });
likes = likes ? likes.filter((like) => like.value.parentId === item.id) : [];
const myLike = likes ? likes.some((like) => like.value[accountId]) : false;
setLiked(myLike);

const [replies, setReplies] = useState([]);
const repl = Social.index("graph", `${socialKey}.reply`, { order: "desc" });
replies = repl ? repl.filter((repl) => repl.value.parentId === item.id) : [];
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

const CardItem = ({ item, index }) => (
  <CardContainer>
    <Card key={index} className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <Widget
          src="mob.near/widget/Profile"
          props={{
            accountId: item.accountId,
            tooltip: true,
          }}
        />
        <div className="d-flex gap-3 align-items-center justify-content-between">
          <small>
            {new Date(item.id).toLocaleDateString()}
          </small>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
            props={{ text: `https://near.org/ndcdev.near/widget/daos.App?page=${pageName}&id=${item.id}` }}
          />
        </div>
      </div>
      <div className="d-flex flex-column gap-1">
        <h3>{item.project_name}</h3>
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
          <i style={{ color: '#A4C2FD' }}
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
                  src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
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
                  src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                  props={{ text: item["performance_statement:answer_2"] }}
                />
              </div>
            </>
          ) : (
            <p>
              <Widget
                src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
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
      <div className="actions d-flex align-items-center justify-content-between">
        <div role="button" className="d-flex gap-2" onClick={handleLike}>
          {likes.length}
          <i style={{color: liked ? '#EE9CBF' : '#303030'}} className="bi bi-heart-fill" />
          Like
        </div>

        <div
          role="button"
          className="d-flex gap-2"
          onClick={() => setShowReply(!showReply)}
        >
          <i style={{color: '#303030'}} className="bi bi-chat-fill" />
          Reply
        </div>
        <div onClick={() => setShowReply(!showReply)}>
            <i className="bi bi-chevron-down fs-5 mt-1" />
              Expand Replies
              <small>({replies.length})</small>
          </div>
        <div>
        </div>
        <ProposalContent>
            <span>
              {`Go to ${props.type === 'report' ? 'Report': 'Proposal'}`}
            </span>
            <Link
              to={`//*__@replace:widgetPath__*/.App?page=${pageName}&id=${item.id}`}
            >
             <i style={{color: "#A4C2FD"}} class={'bi bi-box-arrow-up-right'}/>
            </Link>
          </ProposalContent>
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
  </CardContainer>
);

return <CardItem item={item} index={index} />;
