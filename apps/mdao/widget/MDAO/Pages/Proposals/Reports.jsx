let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const Card = styled.div`
  width: 330px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem;

  p {
    font-size: 14px;
  }
`;

const reports = Social.index("graph", "ndc.mdao", { order: "desc" });

return (
  <Container>
    <div className="d-flex flex-wrap">
      {reports &&
        reports.map((report) => (
          <Card>
            <h3>{report.value.project_name}</h3>
            <h5>Report #{report?.blockHeight}</h5>
            <hr />
            <div className="d-flex justify-content-between">
              <small>Account</small>
              <small>{report.value.accountId}</small>
            </div>

            <div className="d-flex justify-content-between">
              <small>Attachment</small>
              <small>
                <a href={report.value.attachments} download>
                  Download File
                </a>
              </small>
            </div>
            <div className="d-flex justify-content-between">
              <small>contact</small>
              <small>{report.value.contact}</small>
            </div>
            <hr />
            <h4>Metrics</h4>
            <div className="d-flex justify-content-between">
              <small>Audience</small>
              <small>{report.value["metric:audience"]}%</small>
            </div>
            <div className="d-flex justify-content-between">
              <small>AER</small>
              <small>{report.value["metric:average_engagement_rate"]}%</small>
            </div>
            <div className="d-flex justify-content-between">
              <small>Growth</small>
              <small>{report.value["metric:growth"]}%</small>
            </div>
            <hr />
            <h4>Performance statement</h4>
            <p>{report.value["performance_statement:answer_1"]}</p>
            <p>{report.value["performance_statement:answer_2"]}</p>
          </Card>
        ))}
    </div>
  </Container>
);
