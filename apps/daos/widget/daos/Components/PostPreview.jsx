let { assets, contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, index, showMoreDefault, showCommentsDefault, type, preview } =
  props;

if (!item || !contractName) return <Widget src="flashui.near/widget/Loading" />;
const [itemState, setItemState] = useState(item);
const metrics = itemState.metrics ?? itemState;
assets = assets.home;
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

  .dao-img {
    width: 20px;
    height: 20px;
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
    @media screen and (max-width: 786px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  .tag {
    border-radius: 50px;
    background: #a4c2fd;
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

const Status = styled.div`
  border-radius: 50px;
  border: 1px solid ${(props) => props.color};
  width: max-content;
  padding: 4px 15px;
  font-size: 14px;
  text-align: center;
  color: ${(props) => props.color};
`;

const Comments = styled.div`
  border-top: 1px solid #efefef;
  padding-top: 1rem;
  @media screen and (max-width: 786px) {
    overflow: auto;
  }
`;

const StatusSelect = styled.div`
  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  height: 40px;
  padding: 10px 20px;
  background: #a4c2fd1a;
  border-radius: 18px;
  color: #686467;
  border: 1px solid #a4c2fd1a;

  &:hover {
    text-decoration: none;
    border: 1px solid #a4c2fd;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const CardContainer = styled.div`
  width: 100%;
  padding: 3px;
  margin-bottom: ${(p) => (p.marginBottom ? "30px" : "")};

  &:hover {
    position: relative;
    border-radius: 10px;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
  }
`;

const [showMore, setShowMore] = useState(showMoreDefault);
const [copiedShareUrl, setCopiedShareUrl] = useState(false);
const pageName = type === "Report" ? "reports" : "proposals";

const dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(itemState.dao_id),
});

if (!dao) return <Widget src="flashui.near/widget/Loading" />;

const statuses = [
  { key: "InReview", value: "In Review" },
  { key: "New", value: "New" },
  { key: "Approved", value: "Approved" },
  { key: "Rejected", value: "Rejected" },
  { key: "Closed", value: "Closed" },
];

const colorMap = (status) => {
  switch (status) {
    case "New":
      return "rgb(146 168 210)";
    case "Closed":
      return "rgb(196 196 196)";
    case "InReview":
      return "rgb(223 193 73)";
    case "Approved":
      return "rgb(99 222 100)";
    case "Rejected":
      return "rgb(214 113 113)";
    default:
      break;
  }
};

const CardItem = ({ item, index }) => (
  <CardContainer marginBottom={showCommentsDefault}>
    <Card key={index} className="d-flex flex-column gap-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <Widget
          src="mob.near/widget/Profile"
          props={{
            accountId: item.author_id,
            tooltip: true,
          }}
        />
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="d-flex gap-3 align-items-center justify-content-between">
          <h3>{item.title}</h3>
          {item.author_id === accountId && item.status === "InReview" && (
            <a
              href={`https://near.org/ndcdev.near/widget/daos.App?page=edit_post&id=${item.id}&dao_id=${dao.handle}`}
            >
              <i className="blue ph ph-pencil-simple fs-5" />
            </a>
          )}
          {snapshot.length > 1 && showCommentsDefault && (
            <div className="d-flex flex-column gap-1 align-items-center">
              <small>History</small>
              <select
                value={item.timestamp}
                onChange={changeHistory}
                className="form-control"
              >
                {snapshot.map((history) => (
                  <option value={history.timestamp}>
                    {new Date(history.timestamp / 1000000).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="d-flex flex-column gap-1">
          <div className="info">
            <span style={{ width: "12rem" }}>Updated at:</span>
            <span>
              {item.timestamp
                ? new Date(item.timestamp / 1000000).toLocaleString()
                : new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="info">
            <span style={{ width: "12rem" }}>
              {em.post_type === "Proposal"
                ? "Requested sponsor:"
                : "Reported to:"}
            </span>
            {dao && (
              <a
                href={`https://near.org/ndcdev.near/widget/daos.App?page=proposals&dao_id=${dao.handle}`}
                className="d-flex align-items-center gap-1"
              >
                <img className="dao-img" src={dao.logo_url} />
                <span>{dao.title}</span>
              </a>
            )}
          </div>
          {item.post_type === "Proposal" && (
            <div className="info">
              <span style={{ width: "12rem" }}>Requested amount:</span>
              <span>
                <b>${item.requested_amount ?? 0}</b>
              </span>
            </div>
          )}
          {item.attachments.length > 0 && (
            <div>
              <span style={{ width: "12rem" }}>Attachment:</span>
              <Widget
                src={"/*__@replace:widgetPath__*/.Components.Attachment"}
                props={{ attachments: item.attachments }}
              />
            </div>
          )}
        </div>
      </div>
      <a
        role="button"
        onClick={() => setShowMore(showMore === index ? null : index)}
      >
        <b>
          See More
          <i
            className={`blue ph ${
              showMore === index ? "ph-eye" : "ph-eye-slash"
            }`}
          />
        </b>
      </a>

      {showMore === index &&
        item.description &&
        item.post_type === "Proposal" && (
          <Widget
            src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
            props={{ text: item.description }}
          />
        )}

      {showMore === index && item.post_type === "Report" && (
        <>
          {metrics["audience"] && (
            <>
              <h5>
                How many people did your project reach during this funding
                period?
              </h5>
              <h3>
                <b>{metrics["audience"]}</b>
              </h3>
            </>
          )}
          {metrics["growth"] && (
            <>
              <h5>
                How does this month's audience reach compare to previous periods
                (provide a %)
              </h5>
              <h3>
                <b>{metrics["growth"]}</b>
              </h3>
            </>
          )}
          {metrics["average_engagement_rate"] && (
            <>
              <h5>
                What is the average engagement rate on your project's primary
                platform (choose one)? Use the formula (Total Likes, Shares &
                Comments / Total Followers) X 100 = AER %
              </h5>
              <h3>
                <b>{metrics["average_engagement_rate"]}</b>
              </h3>
            </>
          )}
          {metrics["performance_statement_1"] && (
            <>
              <h5>
                What is the biggest win (most improved part of project) during
                this funding period vs. the previous one (if applicable)?
              </h5>
              <Widget
                src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                props={{
                  text: metrics["performance_statement_1"],
                }}
              />
            </>
          )}
          {metrics["performance_statement_2"] && (
            <>
              <h5>
                What is the biggest challenge your project is facing? What did
                not improve during this funding period?
              </h5>
              <Widget
                src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                props={{
                  text: metrics["performance_statement_2"],
                }}
              />
            </>
          )}
        </>
      )}

      {item.labels?.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {item.labels?.map((tag) => (
            <div className="tag"># {tag}</div>
          ))}
        </div>
      )}

      {showComments && (
        <Comments>
          <Widget
            src="/*__@replace:widgetPath__*/.Components.Comments"
            props={{
              postId: item.id,
              showCreate: true,
            }}
          />
        </Comments>
      )}
    </Card>
  </CardContainer>
);

return (
  <>
    {(!itemState.is_spam || dao.owners.includes(accountId)) && (
      <CardItem item={itemState} index={index} />
    )}
  </>
);
