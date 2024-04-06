let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, index, showMoreDefault, showCommentsDefault, type, preview } =
  props;

if (!item || !contractName) return <Widget src="flashui.near/widget/Loading" />;  

const [itemState, setItemState] = useState(item);
const [showMore, setShowMore] = useState(null);

const dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(itemState.dao_id),
});

const TableRow = styled.div`
  display: flex;
  &:not(:last-child) {
    border-bottom: 1px solid #e1e1e1;
  }
  :hover {
    border-bottom: 1px solid #e3e3e0;
    background: #fff;
    box-shadow:
      0px 97px 27px 0px rgba(0, 0, 0, 0),
      0px 62px 25px 0px rgba(0, 0, 0, 0),
      0px 35px 21px 0px rgba(0, 0, 0, 0.02),
      0px 16px 16px 0px rgba(0, 0, 0, 0.03),
      0px 4px 9px 0px rgba(0, 0, 0, 0.03);
  }
`;

const TableCell = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: ${(props) => props.flex || 1};
  border-bottom: 1px solid #e1e1e1;

  .title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const StatusBadge = styled.span`
  display: flex;
  width: 86px;
  height: 30px;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 4px;
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.border};
`;

const statusColors = {
  New: { background: "#8A92F9", color: "white", border: "#8A92F9" },
  Approved: { background: "#2CE691", color: "white", border: "#2CE691" },
  Closed: { background: "#CCC", color: "white", border: "#CCC" },
  "In Review": { background: "#F6B86A", color: "white", border: "#F6B86A" },
  Rejected: { background: "#FC6F60", color: "white", border: "#FC6F60" },
};

const ProposalsState = styled.div`
  display: flex;
  height: 30px;
  padding: 2px 6px 2px 4px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid #e0f2ea;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.approve ? "#2CE691" : "#FC6F60")};

  i.ph {
    font-size: 18px;
  }
`;

const ExpandCollapseIcon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  gap: 10px;
  .dao-img {
    width: 32px;
    height: 32px;
  }
  .created {
    color: #5c656a;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }

  .date {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
`;
const ProposalCardWarpper = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
  align-items: center;
  flex-direction: column;
  align-items: flex-end;
`;

const ProposalCard = styled.div`
  display: flex;
`;

const ProposalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 20px;
`;

const ProposalHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const ProposalInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #666;
`;

const ProposalInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
  padding: 0.75rem 0;
`;

const Description = styled.div`
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 20px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  background: #e1e1e1;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
`;

const Button = styled.button`
  background: #007aff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const Divider = styled.div`
  width: 100%;
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid
    var(--NEAR-Primary-Colors-Off-White-Variation-1, #f0efe7);
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const DesktopVersion = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

return (
  <>
    <MobileContainer>
      <div className="d-flex justify-content-between align-items-center">
        <Container>
          <div>
            <img className="dao-img" src={dao.logo_url} />
          </div>
          <div className="d-flex flex-column">
            <span>{dao.title}</span>
            <div>
              <span className="created">Updated at:</span>{" "}
              <span className="date">
                {new Date(itemState.timestamp / 1000000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Container>
        <StatusBadge {...statusColors[itemState.status]}>
          {itemState.status}
        </StatusBadge>
      </div>
      <ProposalHeader>{itemState.title}</ProposalHeader>
      <div className="d-flex flex-wrap gap-1">
        <Widget
          src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
          props={{
            text: `https://near.org/ndcdev.near/widget/daos.App?page=proposal&id=${itemState.id}`,
          }}
        />
        <ProposalsState approve={itemState.state.dao_council_approved}>
          <span>
            {itemState.state.kyc_passed ? (
              <i class="ph-fill fs-6 ph-check-circle"></i>
            ) : (
              <i class="ph-fill fs-6 ph-x-circle"></i>
            )}
          </span>{" "}
          DAO Approved
        </ProposalsState>

        <ProposalsState approve={itemState.state.kyc_passed}>
          {" "}
          <span>
            {itemState.state.kyc_passed ? (
              <i class="ph-fill fs-6 ph-check-circle"></i>
            ) : (
              <i class="ph-fill fs-6 ph-x-circle"></i>
            )}
          </span>{" "}
          KYC Approved
        </ProposalsState>

        <ProposalsState approve={itemState.state.report_accepted}>
          {" "}
          <span>
            {itemState.state.report_accepted ? (
              <i class="ph-fill fs-6 ph-check-circle"></i>
            ) : (
              <i class="ph-fill fs-6 ph-x-circle"></i>
            )}
          </span>{" "}
          Report Approved
        </ProposalsState>
      </div>
      <ProposalInfo>
        <ProposalInfoItem>
          <div style={{ width: "12rem" }}>Created By:</div>
          <div>{itemState.author_id}</div>
        </ProposalInfoItem>
        <ProposalInfoItem>
          <div style={{ width: "12rem" }}>Requested amount:</div>
          <div style={{ "font-size": "18px" }}>
            <b>${itemState.requested_amount ?? 0}</b>
          </div>
        </ProposalInfoItem>
      </ProposalInfo>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-start w-100">
          <a
            className="btn btn-secondary outlined w-100 text-nowrap"
            href={`//*__@replace:widgetPath__*/.App?page=report&id=${itemState.reports[0]}`}
          >
            Report
          </a>
        </div>
        <div className="d-flex justify-content-end w-100">
          <a
            className="btn btn-secondary w-100 text-nowrap"
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
          >
            Open Proposal
            <i class="ph ph-arrow-square-out fs-6"></i>
          </a>
        </div>
      </div>
    </MobileContainer>
    <DesktopVersion>
      <TableRow key={index}>
        <TableCell flex={0.5}>
          <StatusBadge {...statusColors[itemState.status]}>
            {itemState.status}
          </StatusBadge>
        </TableCell>
        <TableCell flex={2.5}>
          <Container>
            <div>
              <img className="dao-img" src={dao.logo_url} />
            </div>
            <div style={{ display: "flex", "flex-direction": "column" }}>
              <div className="title">{dao.title}</div>
              <div>
                <span className="created">Created at:</span>{" "}
                <span className="date">
                  {new Date(itemState.timestamp / 1000000).toDateString()}
                </span>
              </div>
            </div>
          </Container>
        </TableCell>
        <TableCell>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="created"> Created by</div>
            <a
              className="account-link"
              href={`https://near.org/near/widget/ProfilePage?accountId=${itemState.author_id}`}
            >
              {itemState.author_id}
            </a>
          </div>
        </TableCell>
        <TableCell flex={3}>
          <ProposalsState approve={itemState.state.dao_council_approved}>
            <span>
              {itemState.state.kyc_passed ? (
                <i class="ph-fill fs-6 ph-check-circle"></i>
              ) : (
                <i class="ph-fill fs-6 ph-x-circle"></i>
              )}
            </span>{" "}
            DAO Approved
          </ProposalsState>

          <ProposalsState approve={itemState.state.kyc_passed}>
            {" "}
            <span>
              {itemState.state.kyc_passed ? (
                <i class="ph-fill fs-6 ph-check-circle"></i>
              ) : (
                <i class="ph-fill fs-6 ph-x-circle"></i>
              )}
            </span>{" "}
            KYC Approved
          </ProposalsState>

          <ProposalsState approve={itemState.state.report_accepted}>
            {" "}
            <span>
              {itemState.state.report_accepted ? (
                <i class="ph-fill fs-6 ph-check-circle"></i>
              ) : (
                <i class="ph-fill fs-6 ph-x-circle"></i>
              )}
            </span>{" "}
            Report Approved
          </ProposalsState>
        </TableCell>
        <TableCell>
          <a
            className="btn btn-secondary outlined"
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
          >
            Report
          </a>
          <ExpandCollapseIcon>
            <i
              class={`ph ph-caret-${showMore === index ? "up" : "down"} fs-5`}
              onClick={() => setShowMore(showMore === index ? null : index)}
            ></i>
          </ExpandCollapseIcon>
        </TableCell>
      </TableRow>
      {showMore === index && (
        <ProposalCardWarpper>
          <ProposalCard>
            <ProposalContent style={{'max-width': '350px'}}>
              <div className="d-flex justify-content-between gap-3">
                <ProposalHeader>{itemState.title}</ProposalHeader>
                <Widget
                  src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
                  props={{
                    text: `https://near.org/ndcdev.near/widget/daos.App?page=proposal&id=${itemState.id}`,
                  }}
                />
              </div>
              <ProposalInfo>
                <ProposalInfoItem>
                  <div style={{ width: "12rem" }}>Updated at:</div>
                  <div>
                    {itemState.timestamp
                      ? new Date(itemState.timestamp / 1000000).toLocaleString()
                      : new Date().toLocaleDateString()}
                  </div>
                </ProposalInfoItem>
                <ProposalInfoItem>
                  <div style={{ width: "12rem" }}>Requested amount:</div>
                  <div>
                    <b>${itemState.requested_amount ?? 0}</b>
                  </div>
                </ProposalInfoItem>
              </ProposalInfo>
            </ProposalContent>
            <ProposalContent style={{'max-width': '850px'}}>
              <Tags>
                {itemState.labels?.map((tag) => (
                  <Tag>#{tag}</Tag>
                ))}
              </Tags>
              <Description >
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                  props={{ text: itemState.description }}
                />
              </Description>
            </ProposalContent>
          </ProposalCard>
          <div>
            <a
              className="btn btn-secondary"
              href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
            >
              Open Proposal
              <i class="ph ph-arrow-square-out fs-6"></i>
            </a>
          </div>
        </ProposalCardWarpper>
      )}
    </DesktopVersion>
  </>
);
