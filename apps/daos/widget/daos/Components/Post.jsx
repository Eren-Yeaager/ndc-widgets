let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, index, showMoreDefault, showCommentsDefault, type, preview } =
  props;

const [itemState, setItemState] = useState(item);
const [showMore, setShowMore] = useState(null);

const dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(itemState.dao_id),
});

if (!dao) return <Widget src="flashui.near/widget/Loading" />;

const TableRow = styled.div`
  display: flex;
  &:not(:last-child) {
    border-bottom: 1px solid #e1e1e1;
  }
  :hover {
    border-bottom: 1px solid #E3E3E0;
    background: #FFF;
    box-shadow: 0px 97px 27px 0px rgba(0, 0, 0, 0.00), 0px 62px 25px 0px rgba(0, 0, 0, 0.00), 0px 35px 21px 0px rgba(0, 0, 0, 0.02), 0px 16px 16px 0px rgba(0, 0, 0, 0.03), 0px 4px 9px 0px rgba(0, 0, 0, 0.03);
  }
`;

const TableCell = styled.div`
  padding: 16px;
  display: flex;
  gap: 10px;
  flex: ${props => props.flex || 1};
`;

const StatusBadge = styled.span`
  display: flex;
  width: 86px;
  height: 30px;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 4px;
  background-color: ${props => props.background};
  color: ${props => props.color};
  border: 1px solid ${props => props.border};
`;

const OpenReportButton = styled.a`
  display: flex;
  width: 150px;
  height: 40px;
  padding: 1px 21px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  border: 1px solid #E3E3E0;
  background: var(--NEAR-Primary-Colors-White, #FFF);
  :hover {
    text-decoration: none;
  }
`;

const statusColors = {
  'New': { background: '#8A92F9', color: 'white', border: '#8A92F9' },
  'Approved': { background: '#2CE691', color: 'white', border: '#2CE691' },
  'Closed': { background: '#CCC', color: 'white', border: '#CCC' },
  'In Review': { background: '#F6B86A', color: 'white', border: '#F6B86A' },
  'Rejected': { background: '#FC6F60', color: 'white', border: '#FC6F60' }
};

const ProposalsState = styled.div`
  display: flex;
  height: 30px;
  padding: 2px 6px 2px 4px;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid #E0F2EA;
  background: #FFF;
  font-size: 12px;
  color: ${props => props.approve ? '#2CE691' : '#FC6F60'};
  i.ph {
    font-size: 18px
  }
`;

const ExpandCollapseIcon = styled.div`
  padding-left: 30px;
  height: 24px;
  cursor: pointer;
`;

const Conatiner = styled.div`
  display: flex;
  gap: 10px;
  .dao-img {
    width: 32px;
    height: 32px;
  }
  .created {
    color: #5C656A;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .date { 
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

`
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
`

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
  margin-bottom: 10px;
`;

const ProposalInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

const ProposalInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
`;

const Description = styled.div`
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
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
  margin:  10px 0;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid var(--NEAR-Primary-Colors-Off-White-Variation-1, #F0EFE7);
`;

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #e1e1e1;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Conatiner>
          <div>
            <img className="dao-img" src={dao.logo_url} />
          </div>
          <div style={{ display: 'flex', 'flex-direction': 'column' }}>
            <div>{itemState.title}</div>
            <div><span className="created">Created at:</span> <span className="date">{new Date(itemState.timestamp / 1000000).toDateString()}</span></div>
          </div>

        </Conatiner>
        <StatusBadge {...statusColors[itemState.status]}>
          {itemState.status}
        </StatusBadge>
      </div>
      <ProposalHeader>{itemState.title}</ProposalHeader>
      <div style={{ display: 'flex',  flexWrap: 'wrap',
    gap: '5px'}}>
        <Widget
          src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
          props={{
            text: `https://near.org/ndcdev.near/widget/daos.App?page=proposal&id=${itemState.id}`,
          }}
        />
        <ProposalsState approve={itemState.state.dao_council_approved} ><span>{itemState.state.kyc_passed ? <i class="ph ph-check-circle"></i>

          : <i class="ph ph-x-circle"></i>

        }</span> DAO Approved</ProposalsState>

        <ProposalsState approve={itemState.state.kyc_passed} > <span>{itemState.state.kyc_passed ? <i class="ph ph-check-circle"></i>

          : <i class="ph ph-x-circle"></i>

        }</span>  KYC Approved</ProposalsState>

        <ProposalsState approve={itemState.state.report_accepted} > <span>{itemState.state.report_accepted ? <i class="ph ph-check-circle"></i>

          : <i class="ph ph-x-circle"></i>

        }</span>  Report Approved</ProposalsState>
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
          <Divider />
        </ProposalInfoItem>
        <ProposalInfoItem>
          <div style={{ width: "12rem" }}>Requested amount:</div>
          <div>
            <b>${itemState.requested_amount ?? 0}</b>
          </div>
        </ProposalInfoItem>
      </ProposalInfo>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <OpenReportButton
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
          >
            Open
            <i class="ph ph-arrow-square-out"></i>
          </OpenReportButton>
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
          <Conatiner>
            <div>
              <img className="dao-img" src={dao.logo_url} />
            </div>
            <div style={{ display: 'flex', 'flex-direction': 'column' }}>

              <div>{itemState.title}</div>
              <div><span className="created">Created at:</span> <span className="date">{new Date(itemState.timestamp / 1000000).toDateString()}</span></div>
            </div>

          </Conatiner>
        </TableCell>
        <TableCell >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="created"> Modified by</div>
            <div>
            </div>
            <a className="account-link" href={`https://near.org/near/widget/ProfilePage?accountId=${itemState.author_id}`}>{itemState.author_id}</a>
          </div>
        </TableCell>
        <TableCell flex={3}>
          <ProposalsState approve={itemState.state.dao_council_approved} ><span>{itemState.state.kyc_passed ? <i class="ph ph-check-circle"></i>

            : <i class="ph ph-x-circle"></i>

          }</span> DAO Approved</ProposalsState>

          <ProposalsState approve={itemState.state.kyc_passed} > <span>{itemState.state.kyc_passed ? <i class="ph ph-check-circle"></i>

            : <i class="ph ph-x-circle"></i>

          }</span>  KYC Approved</ProposalsState>

          <ProposalsState approve={itemState.state.report_accepted} > <span>{itemState.state.report_accepted ? <i class="ph ph-check-circle"></i>

            : <i class="ph ph-x-circle"></i>

          }</span>  Report Approved</ProposalsState>
        </TableCell>
        <TableCell>
          <OpenReportButton
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
          >
            Report
            <i class="ph ph-arrow-square-out"></i>
          </OpenReportButton>
          <ExpandCollapseIcon>
            <i class={`ph ph-caret-${showMore === index ? 'up' : 'down'}`} onClick={() => setShowMore(showMore === index ? null : index)}></i>
          </ExpandCollapseIcon>
        </TableCell>

      </TableRow>
      {showMore === index && (
        <ProposalCardWarpper>
          <ProposalCard>
            <ProposalContent>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                  <Divider />
                </ProposalInfoItem>
                <ProposalInfoItem>
                  <div style={{ width: "12rem" }}>Requested amount:</div>
                  <div>
                    <b>${itemState.requested_amount ?? 0}</b>
                  </div>
                </ProposalInfoItem>
              </ProposalInfo>
            </ProposalContent>
            <ProposalContent>
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
            <OpenReportButton
              href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${itemState.id}`}
            >
              Open
              <i class="ph ph-arrow-square-out"></i>
            </OpenReportButton>
          </div>
        </ProposalCardWarpper>
      )}
    </DesktopVersion>
  </>

)