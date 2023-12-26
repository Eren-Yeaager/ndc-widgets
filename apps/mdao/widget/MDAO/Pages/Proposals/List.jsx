let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
assets = assets.home;
content = content.home;

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

  .actions {
    gap: 3rem;

    @media screen and (max-width: 786px) {
      gap: 0;
      justify-content: space-between;
    }
  }

  @media screen and (max-width: 786px) {
    padding: 1.5rem;
  }
`;

const items = Social.index("graph", "ndc.mdao", { order: "desc" });
const [showMore, setShowMore] = useState(null);

return (
  <Container>
    <div className="d-flex flex-column gap-4">
      {items &&
        items
          .filter((i) => i.value.type === props.type)
          .map((report, i) => (
            <Card key={i} className="d-flex flex-column gap-4">
              <Widget
                src="mob.near/widget/Profile"
                props={{
                  accountId: report.value.accountId,
                  tooltip: true,
                }}
              />
              <div className="d-flex flex-column gap-1">
                <h3>{report.value.project_name}</h3>
                <div className="d-flex flex-wrap align-items-center mb-1 gap-2">
                  <small style={{ width: "150px" }}>Requested sponsor:</small>
                  <small>
                    <Widget
                      src="mob.near/widget/Profile.ShortInlineBlock"
                      props={{
                        accountId: content.dao,
                        tooltip: true,
                      }}
                    />
                  </small>
                </div>
                {port.value.attachments && (
                  <div className="d-flex align-items-center gap-2">
                    <small style={{ width: "150px" }}>Attachments: </small>
                    <small>
                      <a
                        className="color-text"
                        href={report.value.attachments}
                        download
                      >
                        <i className="bi bi-download" />
                        Download File
                      </a>
                    </small>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2">
                  <small style={{ width: "150px" }}>Contact person: </small>
                  <small>{report.value.contact}</small>
                </div>
              </div>
              <small>
                <div
                  role="button"
                  className="btn btn-outline-primary"
                  onClick={() => setShowMore(showMore === i ? null : i)}
                >
                  {showMore === i ? "Hide" : "Show"} {props.type} details
                  <i
                    className={`bi ${
                      showMore === i ? "bi-eye-slash" : "bi-eye"
                    }`}
                  />
                </div>
              </small>
              {showMore === i && (
                <>
                  <div>
                    <small>
                      <b>Metrics</b>
                    </small>
                    <div className="d-flex flex-wrap gap-2">
                      <div className="metric d-flex flex-column justify-content-center align-items-center">
                        <small>Audience</small>
                        <b>{report.value["metric:audience"]}%</b>
                      </div>
                      <div className="metric d-flex flex-column justify-content-center align-items-center">
                        <small>AER</small>
                        <b>{report.value["metric:average_engagement_rate"]}%</b>
                      </div>
                      <div className="metric d-flex flex-column justify-content-center align-items-center">
                        <small>Growth</small>
                        <b>{report.value["metric:growth"]}%</b>
                      </div>
                    </div>
                  </div>
                  <div>
                    <small>
                      <b>
                        Performance Statement: What is the biggest win (most
                        improved part of project) during this funding period vs.
                        the previous one (if applicable)?
                      </b>
                    </small>
                    <div>
                      <small>
                        {report.value["performance_statement:answer_1"]}
                      </small>
                    </div>
                  </div>
                  <div>
                    <small>
                      <b>
                        Performance statement: What is the biggest challenge
                        your project is facing? What did not improve during this
                        funding period?
                      </b>
                    </small>
                    <div>
                      <small>
                        {report.value["performance_statement:answer_2"]}
                      </small>
                    </div>
                  </div>
                </>
              )}

              <div className="actions d-flex">
                <div className="d-flex gap-2">
                  <i className="bi bi-heart" /> Like
                </div>
                <div className="d-flex gap-2">
                  <i className="bi bi-reply" /> Reply
                </div>
                <div className="d-flex gap-2">
                  <i className="bi bi-share" /> Share
                </div>
              </div>
            </Card>
          ))}
    </div>
  </Container>
);
