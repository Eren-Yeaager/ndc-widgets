let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const {
  item,
  index,
  showMoreDefault,
  showCommentsDefault,
  type,
  preview,
  isMobile,
  rowId,
  id,
  disabeleOpenReportLInk,
} = props;

if (!item || !contractName) return <Widget src="flashui.near/widget/Loading" />;

const [itemState, setItemState] = useState(item);
const [showMore, setShowMore] = useState(null);
const [showComments, setShowComments] = useState(showCommentsDefault);
const accountId = context.accountId;

const dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(itemState.dao_id),
});

{
  /* This is to be used with Table  */
}
const TableRow = styled.div`
  display: flex;
  border-bottom: ${(props) => (props.showMore ? "0" : "1px solid #e3e3e0")};

  &:hover {
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  column-gap: 10px;
  row-gap: 3px;
  flex: ${(props) => props.flex || 1};

  .title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .info {
    display: flex;
    flex-direction: column;
  }
`;

const ProposalCardWrapper = styled.div`
  display: flex;
  background: white;
  border-radius: 14px;
  border: 1px solid #e3e3e0;
  background: #fdfdfd;
  padding: 18px 22px;
  margin: 20px;
  align-items: center;
  flex-direction: column;
  align-items: flex-end;
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
  width: max-content;
  padding: 2px 6px 2px 4px;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  border: 1px solid #e0f2ea;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #828282;

  i {
    color: ${(props) => (props.approve ? "#2CE691" : "#FC6F60")};
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
    color: #828282;
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

const ProposalCard = styled.div`
  width: 100%;
  display: flex;
  gap: 32px;
`;

const ProposalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 20px;
  max-width: ${(props) => props.maxWidth};
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
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e1e1e1;
  }

  .value {
    color: var(--NEAR-Primary-Colors-Black-Variation-1, #000);
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .time {
    color: var(--NEAR-Primary-Colors-Black-Variation-1, #000);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
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

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e3e3e0;
  background: #fff;
  padding: 14px 12px 24px 12px;
  box-shadow:
    0px 97px 27px 0px rgba(0, 0, 0, 0),
    0px 62px 25px 0px rgba(0, 0, 0, 0),
    0px 35px 21px 0px rgba(0, 0, 0, 0.02),
    0px 16px 16px 0px rgba(0, 0, 0, 0.03),
    0px 4px 9px 0px rgba(0, 0, 0, 0.03);

  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const DesktopVersion = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

{
  /* This is to be used with single report  */
}

const Breadcrumb = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid
    var(--NEAR-Primary-Colors-Off-White-Variation-1, #f0efe7);
  padding-bottom: 14px;
  margin-bottom: 30px;

  .all-link {
    color: #7e7d7e;
  }
`;
const InfoContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  .created {
    color: #5c656a;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
  }
`;

const Left = styled.div`
  width: 60%;
  .author {
    margin-left: 10px;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DescriptionContainer = styled.div`
  padding-top: 42px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const Social = styled.div`
  width: 100%;
  padding: 12px;
  border-top: 1px solid #f0efe7;
  display: flex;
  gap: 20px;
`;

const Comments = styled.div`
  width: 100%;
  border-top: 1px solid #efefef;
  padding-top: 1rem;
  @media screen and (max-width: 786px) {
    overflow: auto;
  }
`;

const HistoryContainer = styled.div`
  min-height: 50px;
  max-height: 200px;
  overflow-y: auto;
  border-left: 1px solid #ccc; // Uncomment if border is desired
`;

const HistoryEntry = styled.div`
  padding: 10px;
  background-color: ${(props) => (props.selected ? "#F5F6FE;" : "white")};
  border-left: ${(props) => (props.selected ? "2px solid #626AD1" : "none")};
  cursor: pointer;

  .text {
    color: #666;
  }

  &:hover {
    background-color: #f2f2f2;
  }
`;

const ProposalsStateContainer = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 10px;
`;

const [selectedHistoryId, setselectedHistoryId] = useState(null);
console.log(snapshot);

const changeHistory = (id) => {
  console.log(id);
  setselectedHistoryId(id);
  setItemState((prev) => ({ ...prev, ...snapshot[id] }));
};

if (!dao) return <Widget src="flashui.near/widget/Loading" />;

let snapshot;

if (itemState.id)
  snapshot = Near.view(contractName, "get_post_history", {
    id: itemState.id,
  });

snapshot = snapshot && snapshot.filter((i) => !i.is_spam);

const isLiked = (item) => {
  return item.likes && item.likes.find((item) => item.author_id === accountId);
};

const handleLike = () => {
  if (isLiked(itemState)) return;
  if (!accountId) return;
  Near.call(contractName, isLiked(itemState) ? "post_unlike" : "post_like", {
    id: itemState.id,
  });
};

const handleShowComments = () => {
  if (!accountId) return;
  setShowComments(!showComments);
};

const changeStatus = async (item, status) => {
  if (!accountId) return;
  Near.call(contractName, "change_post_status", {
    id: item.id,
    status,
  });
};

const handleSpam = () => {
  if (!accountId) return;
  Near.call(contractName, "change_post_is_spam", {
    id: itemState.id,
    is_spam: !itemState.is_spam,
  });
};

const statuses = [
  { key: "InReview", value: "In Review" },
  { key: "New", value: "New" },
  { key: "Approved", value: "Approved" },
  { key: "Rejected", value: "Rejected" },
  { key: "Closed", value: "Closed" },
];

return (
  <>
    {/* This is to be used with single report  */}
    {id ? (
      <>
        <Breadcrumb>
          <div>
            <a
              className="all-link"
              href={`//*__@replace:widgetPath__*/.App?page=proposals`}
            >
              All {itemState.post_type === "Proposal" ? "Proposals" : "Reports"}
            </a>{" "}
            /{itemState.title}
          </div>
        </Breadcrumb>
        <InfoContainer>
          <Left>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <i class="ph ph-users"></i>
                <div>
                  <a
                    className="account-link author"
                    href={`https://near.org/near/widget/ProfilePage?accountId=${itemState.author_id}`}
                  >
                    {itemState.author_id}
                  </a>
                </div>
              </div>
              <div>
                {dao.owners.includes(accountId) ? (
                  <div>
                    <select
                      className="form-control"
                      value={itemState.status}
                      onChange={(status) =>
                        changeStatus(item, status.target.value)
                      }
                    >
                      {statuses.map(({ key, value }) => (
                        <option value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <StatusBadge {...statusColors[itemState.status]}>
                    {itemState.status}
                  </StatusBadge>
                )}
              </div>
            </div>
            <div>
              <ProposalHeader>{itemState.title}</ProposalHeader>
              <ProposalsStateContainer>
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
              </ProposalsStateContainer>
            </div>
            <ProposalInfo>
              <ProposalInfoItem>
                <div>Updated at:</div>
                <div>
                  {itemState.timestamp
                    ? new Date(itemState.timestamp / 1000000).toLocaleString()
                    : new Date().toLocaleDateString()}
                </div>
              </ProposalInfoItem>
              <ProposalInfoItem>
                <div>Requested amount:</div>
                <div>
                  <b>${itemState.requested_amount ?? 0}</b>
                </div>
              </ProposalInfoItem>
            </ProposalInfo>
          </Left>
          <Right>
            <div>
              <i class="ph ph-clock-counter-clockwise"></i>
              <span>Version History</span>
            </div>
            <div>
              {snapshot.length > 0 && (
                <HistoryContainer>
                  {snapshot.map((history, index) => (
                    <HistoryEntry
                      key={history.timestamp}
                      selected={index === selectedHistoryId}
                      onClick={() => changeHistory(index)}
                    >
                      <>
                        <div>
                          <span className="text">Updated at:</span>

                          {itemState.timestamp
                            ? new Date(
                                itemState.timestamp / 1000000,
                              ).toLocaleString()
                            : new Date().toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text">by</span> {itemState.author_id}
                        </div>
                      </>
                    </HistoryEntry>
                  ))}
                </HistoryContainer>
              )}
            </div>
          </Right>
        </InfoContainer>
        <DescriptionContainer>
          <ProposalHeader>Description</ProposalHeader>

          <Tags>
            {itemState.labels?.map((tag) => (
              <Tag>#{tag}</Tag>
            ))}
          </Tags>

          <Description>
            <Widget
              src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
              props={{ text: itemState.description }}
            />
          </Description>
          <Social>
            <div
              role="button"
              className="d-flex gap-2 align-items-center"
              onClick={handleLike}
            >
              <i
                className={` ph-heart fs-5 ${
                  isLiked(itemState) ? "ph-fill" : "ph"
                }`}
              />
              <span>{itemState.likes.length}</span>
            </div>

            <div
              role="button"
              className="d-flex gap-2 align-items-center"
              onClick={handleShowComments}
            >
              <i className="ph ph-chat-circle fs-5" />
              <span>{itemState.comments.length}</span>
            </div>
            <div role="button">
              <Widget
                src={"/*__@replace:widgetPath__*/.Components.Share"}
                props={{
                  text: `https://near.org/ndcdev.near/widget/daos.App?page=proposal&id=${itemState.id}`,
                }}
              />
            </div>
            {dao.owners.includes(accountId) && (
              <div
                role="button"
                className="d-flex gap-2 align-items-center"
                onClick={handleSpam}
              >
                <i
                  className={`ph ph-flag ${
                    itemState.is_spam ? "red ph-fill" : "ph"
                  }`}
                />
              </div>
            )}
          </Social>
        </DescriptionContainer>
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
      </>
    ) : (
      <>
        {/* This is to be used with Table  */}
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
                    {new Date(
                      itemState.timestamp / 1000000,
                    ).toLocaleDateString()}
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
              <div>Created By:</div>
              <div>
                <a
                  className="account-link"
                  href={`https://near.org/near/widget/ProfilePage?accountId=${itemState.author_id}`}
                >
                  {itemState.author_id}
                </a>
              </div>
            </ProposalInfoItem>
            <ProposalInfoItem>
              <div>Requested amount:</div>
              <div>
                <b>${itemState.requested_amount ?? 0}</b>
              </div>
            </ProposalInfoItem>
          </ProposalInfo>
          {!id && (
            <div className="d-flex justify-content-between align-items-center gap-3">
              {itemState.post_type === "Proposal" ? (
                <div className="d-flex justify-content-end w-100">
                  <a
                    className="btn btn-secondary w-100 text-nowrap"
                    href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
                  >
                    Open Proposal
                    <i class="ph ph-arrow-square-out fs-6"></i>
                  </a>
                </div>
              ) : (
                <div className="d-flex justify-content-start w-100">
                  <a
                    className="btn btn-secondary outlined w-100 text-nowrap"
                    href={`//*__@replace:widgetPath__*/.App?page=report&id=${itemState.id}`}
                  >
                    Report
                  </a>
                </div>
              )}
            </div>
          )}
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
                <div className="info">
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
              <div className="info">
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
                  class={`ph ph-caret-${
                    showMore === index ? "up" : "down"
                  } fs-5`}
                  onClick={() => setShowMore(showMore === index ? null : index)}
                ></i>
              </ExpandCollapseIcon>
            </TableCell>
          </TableRow>
          {showMore === index && (
            <ProposalCardWrapper>
              <ProposalCard>
                <ProposalContent maxWidth={"350px"}>
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
                      <div>Updated at:</div>
                      <div>
                        {itemState.timestamp
                          ? new Date(
                              itemState.timestamp / 1000000,
                            ).toLocaleString()
                          : new Date().toLocaleDateString()}
                      </div>
                    </ProposalInfoItem>
                    <ProposalInfoItem>
                      <div>Requested amount:</div>
                      <div>
                        <b>${itemState.requested_amount ?? 0}</b>
                      </div>
                    </ProposalInfoItem>
                  </ProposalInfo>
                </ProposalContent>
                <ProposalContent maxWidth={"850px"}>
                  <Tags>
                    {itemState.labels?.map((tag) => (
                      <Tag>#{tag}</Tag>
                    ))}
                  </Tags>
                  <Description>
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
            </ProposalCardWrapper>
          )}
        </DesktopVersion>
      </>
    )}
  </>
);
