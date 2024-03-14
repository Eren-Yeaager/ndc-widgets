const { dao, index } = props;

const DaoCard = styled.div`
  width: 330px;
  height: 400px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(322deg, rgb(239, 220, 209) -1.69%, rgb(224, 198, 247) 43.78%, rgb(173, 195, 251) 99.83%);
  padding: 2px;
  
  span {
    color: #ffffff;
  }

  a.btn {
    &:hover {
      text-decoration: none;
    }
  }

  h4 {
    color: #000
    font-size: 24px;
  }

  .inner {
    height: 100%;
    padding: 2rem;
    background: rgb(249 246 255 / 80%);
    border-radius: 10px;
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

const DaoLink = styled.a`
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
  background: black;
  padding: 10px 35px;

  i {
    color: white;
  }
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
      <DaoLink
        href={
          priorityLink[dao.id] ??
          `//*__@replace:widgetPath__*/.App?page=dao&id=${dao.handle}`
        }
        className="btn btn-secondary d-flex justify-content-between"
      >
        <div className="d-flex gap-2 justify-content-center w-100">
          <i class="bi bi-plus-circle"></i>
          <span>Join DAO</span>
        </div>
      </DaoLink>
    </div>
  </DaoCard>
);
