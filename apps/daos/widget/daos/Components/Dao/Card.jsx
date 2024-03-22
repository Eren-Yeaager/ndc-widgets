const { dao, index } = props;

const DaoCard = styled.div`
  width: 330px;
  height: 400px;
  border-radius: 10px;
  color: #11181c;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;

  h4 {
    color: #000
    font-size: 24px;
  }

  .inner {
    height: 100%;
    padding: 2rem;
  }

  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const DaoDesc = styled.div`
  color: #1e1d22;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// This is to be used if we want use other Links for landing pages.
const priorityLink = {
  4: "https://near.org/ndcdev.near/widget/MDAO.App?page=home",
};

return (
  <DaoCard>
    <div className="inner d-flex flex-column justify-content-between gap-3 align-items-center">
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.CommunityImage`}
        props={{ image: dao.logo_url, index }}
      />
      <div className="gap-2">
        <h4 className="bold color-text px-3 mt-1 text-center">{dao.title}</h4>
        <DaoDesc>{dao.description}</DaoDesc>
      </div>
      <a
        href={
          priorityLink[dao.id] ??
          `//*__@replace:widgetPath__*/.App?page=dao&id=${dao.handle}`
        }
        className="btn-primary"
      >
        <i class="ph ph-plus fs-5"></i>
        Join DAO
      </a>
    </div>
  </DaoCard>
);
