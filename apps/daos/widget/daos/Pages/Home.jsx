let { assets, content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);

assets = assets.home;
content = content.home;

const Description = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 2rem;
  padding: 2rem 0 3rem 0;

  a {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5rem;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CreateGrassrootContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: #1e1d22;
  height: 650px;

  @media screen and (max-width: 768px) {
    height: auto;
    padding-bottom: 20px;
  }

  .wrapper {
    position: relative;
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .circle {
      width: 500px;
      height: 500px;
      position: absolute;
      right: 0rem;
      bottom: 0;
      z-index: 1;
      border-radius: 1007px;
      background: linear-gradient(
        180deg,
        rgba(253, 202, 48, 0.5) 0%,
        rgba(235, 157, 187, 0.5) 50%,
        rgba(91, 153, 219, 0.5) 100%
      );
      filter: blur(100px);
      animation: spin 4s linear infinite;

      @keyframes spin {
        0% {
          transform: rotate(0deg);
          scale: 90%;
        }
        50% {
          scale: 100%;
          transform: rotate(180deg);
        }
        100% {
          scale: 90%;
          transform: rotate(360deg);
        }
      }
    }

    .title {
      color: #fff;
      font-size: 48px;
      font-weight: 700;
      padding-top: 6rem;
      z-index: 3;

      @media screen and (max-width: 786px) {
        padding-top: 3rem;
      }
    }

    .description {
      width: 50%;
      color: #fff;
      font-size: 26px;
      font-weight: 300;
      z-index: 3;

      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }

    a {
      width: 50%;
      z-index: 3;

      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }

    img {
      width: 463px;
      height: 580px;
      position: absolute;
      right: 0rem;
      bottom: 0;
      z-index: 2;

      @media screen and (max-width: 786px) {
        display: none;
      }
    }
  }
`;

const ParalaxImg = styled.div`
  width: 100%;
  background-image: url(${(p) => p.src});
  min-height: 500px;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  @media screen and (max-width: 786px) {
    display: none;
  }
`;

const SubmitProposal = styled.a`
  font-size: 24px;
  transition: all 0.3s ease;
  border-radius: 50px;
  border: 3px solid #ffce26;
  color: white !important;
  padding: 15px 40px;
  text-align: center;
  margin-bottom: 2rem;

  &:hover {
    text-decoration: none;
  }
`;

const [loading, setLoading] = useState(false);

const daos = Near.view(contractName, "get_dao_list");
let proposals = Near.view(contractName, "get_all_posts", {
  page: 0,
  limit: 100,
});

let projects = []

let projectsDaoId2 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(2),
});

// Marketing DAO
let projectsDaoId4 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(4),
});

// Gaming DAO
let projectsDaoId3 = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(3),
});



if (!daos || !contractName || !content || !assets || !proposals || !projects)
  return <Widget src="flashui.near/widget/Loading" />;

projects = [...projectsDaoId2, ...projectsDaoId4, ...projectsDaoId3]  

let groupedDaos = daos
  .map((element) => {
    let result = {};
    element.verticals.forEach((list) => {
      if (!result[list]) {
        result[list] = [];
      }
      result[list].push(element);
    });

    return result;
  })
  .filter((item) => Object.keys(item).length !== 0);

proposals = proposals.map((proposal) => {
  return {
    proposal,
    dao: daos.find((dao) => dao.id === proposal.dao_id),
  };
});

let types = new Set();
groupedDaos.forEach((item) => types.add(...Object.keys(item)));

const typeOfProject = Array.from(types).map((item) => {
  return {
    name: item.charAt(0).toUpperCase() + item.slice(1),
    color: "#68D895",
  };
});

return (
  <Container>
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.RunnerContainer`}
      props={{ proposals }}
    />
    <Wrapper>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          imgUrl: content.communityTreasury.image,
          title: content.communityTreasury.title,
        }}
      />

      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Metrics.index`}
        props={{
          daos,
          totalTreasury: 3893275,
          deliverTreasury: 292189,
          typeOfProject,
          loading,
          text: content.communityTreasury.metrics,
        }}
      />
    </Wrapper>
    <Wrapper>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          imgUrl: content.whatIsNDC.image,
          title: content.whatIsNDC.title,
        }}
      />
      <Description>{content.whatIsNDC.text}</Description>
    </Wrapper>
    <ParalaxImg
      style={{ marginTop: "-5rem" }}
      src="https://ipfs.near.social/ipfs/bafybeid2ckdorccexjqxnsi3kr4epif4xgqbagdykxtn7wacqk5ajujvy4"
    />
    <Wrapper>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          imgUrl: content.whatisGrassrootDAO.image,
          title: content.whatisGrassrootDAO.title,
        }}
      />
      <Description>{content.whatisGrassrootDAO.text}</Description>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {daos
          .sort((a, b) => a.title < b.title)
          .map((dao) => (
            <Widget
              src={`/*__@replace:widgetPath__*/.Components.Dao.Card`}
              props={{ dao, index }}
            />
          ))}
      </div>
    </Wrapper>

    {projects?.length > 0 ? (
      <Wrapper>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Dao.Communities`}
          props={{
            title: content.featuredProducts.title,
            projects: content.featuredProducts.projects.map((title) =>
              projects.find((p) => p.title === title)
            ),
          }}
        />
      </Wrapper>
    ) : (
      <></>
    )}

    <CreateGrassrootContainer>
      <div className="wrapper">
        <div className="d-flex flex-column gap-3">
          <h1 className="title">{content.createyourGrassrootDAO.title}</h1>
          <p className="description">
            <ul>
              <li>{content.createyourGrassrootDAO.items.first}</li>
              <li>{content.createyourGrassrootDAO.items.second}</li>
              <li>{content.createyourGrassrootDAO.items.third}</li>
            </ul>
          </p>

          <SubmitProposal
            href={`//*__@replace:widgetPath__*/.App?page=create_post`}
          >
            Submit Proposal
          </SubmitProposal>
        </div>
        <div className="circle" />
        <img src="https://ipfs.near.social/ipfs/bafybeig2zwkn3lsogyekukxg3bvx5jxz6hsakfbc4zokzopexwksqo7xoe" />
      </div>
    </CreateGrassrootContainer>
    <Wrapper>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          imgUrl: content.GetFundingForYourProject.image,
          title: content.GetFundingForYourProject.title,
        }}
      />

      <Description>{content.GetFundingForYourProject.text}</Description>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.DaosByVertical`}
        props={{ daos }}
      />
    </Wrapper>
  </Container>
);
