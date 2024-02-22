let { assets, content, contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
let { Hero } = VM.require(`/*__@replace:widgetPath__*/.Components.Hero`);

assets = assets.home;
content = content.home;

const Section = styled.div`
  color: #1E1D22;
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  a {
    text-decoration-line: underline;
  }

  padding-bottom: 30px;
`

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Item = styled.div`
  width: 350px;
  height: 350px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  background: linear-gradient(270deg, #efdcd1 -1.69%, #e0c6f7 43.78%, #adc3fb 99.83%);
  padding: 2px;
  
  span {
    color: #ffffff;
  }

  .bi-plus-circle:hover {
    color: rgb(164, 194, 253);
    fill: rgb(164, 194, 253);
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

  &.dark {
    position: relative;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
    padding: 2px;

    h4 {
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;
    }
  }

  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;
    background: #ffffff;
  }

  svg {
    margin: 7px;
  }

  i, svg {
    color: ${darkTheme ? "#f0ddce" : "#A4C2FD"};
    fill: ${darkTheme ? "#f0ddce" : "#A4C2FD"};

    &:hover {
      color: ${darkTheme ? "#fff" : "#151718"};
      fill: ${darkTheme ? "#fff" : "#151718"};
    }
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
  color: #1E1D22;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit text to 3 lines, adjust as needed */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DaoLink = styled.a`
 min-width: 200px;
 box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
 background: black;
 i {
  padding-left: 30px;
 }
 span {
  padding-right: 35px;
 }
 :hover { 
  background: black;
 }
`

const [loading, setLoading] = useState(false);
const daos = Near.view(contractName, 'get_dao_list')

if (!daos || !contractName || !content || !assets || !Hero) return <Widget src="flashui.near/widget/Loading" />;

let groupedDaos = daos.map(element => {
  let result = {};
  element.verticals.forEach(list => {
    if (!result[list]) {
      result[list] = []
    }
    result[list].push(element)
  })

  return result
}).filter(item => Object.keys(item).length !== 0);

let types = new Set()
groupedDaos.forEach((item) => types.add(...Object.keys(item)))


const typeOfProject = Array.from(types).map((item) => {
  return { name: item.charAt(0).toUpperCase() + item.slice(1), color: '#68D895' }
})

return (
  <Container >
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.BadgeContainer`}
    />
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Title`}
      props={{
        imgUrl: 'https://ipfs.near.social/ipfs/bafkreihwcxkyr2pvfszwxpqs47y7gwlfz3363jead2odmrdwyqtqniuzca',
        text: "Community Treasury"
      }}
    />

    <Widget
      src={`/*__@replace:widgetPath__*/.Components.MetricsDisplay.index`}
      props={{
        totalTreasury: 3000,
        deliverTreasury: 5000,
        typeOfProject,
        loading,
      }}
    />

    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Title`}
      props={{
        imgUrl: 'https://ipfs.near.social/ipfs/bafkreiax4vgaur7pxljajkbmdedx5ynb6en7clh2vcrkciju5atd6xumiq',
        text: "What is NDC?"
      }}
    />
    <Section>
      <a href="https://app.neardc.org/"><b>Near Digital Collective</b></a> (aka <a href="https://www.neardc.org/">NDC</a>) is the governance node of the Near blockchain ecosystem. NDC is the organisation that manages funding requests and learn more about the processes, ongoing initiatives and key members who participate in governance. The NDC's mission is to set up web3 governance on Near, restore grassroots community funding, and reboot the Near community by enabling community members to be rewarded for their contributions.
    </Section>


    <img src="https://ipfs.near.social/ipfs/bafybeid2ckdorccexjqxnsi3kr4epif4xgqbagdykxtn7wacqk5ajujvy4" alt="" />

    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Title`}
      props={{
        imgUrl: 'https://ipfs.near.social/ipfs/bafkreiept3chqmiys74vvok62dmsp4i32wa4t754h5z6njx2hdw2zcx6wq',
        text: "What is Grassroot DAO?"
      }}
    />
    <Section>
      <b>Enroll for Grassroot DAO Grant</b> Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.
    </Section>

    {daos.map((dao) => (
      <Item>
        <div className="inner d-flex flex-column justify-content-center gap-3 align-items-center">
          <Widget
            src={`/*__@replace:widgetPath__*/.Components.CommunityImage`}
            props={{ image: dao.logo_url, index }}
          />
          <h4 className="bold color-text px-3 mt-1 text-center">{dao.title}</h4>
          <DaoDesc>{dao.description}</DaoDesc>
          <DaoLink
            href={`//*__@replace:widgetPath__*/.App?page=proposals&daoId=${dao.id}`}
            className="btn btn-secondary d-flex justify-content-between"
          >
            <i class="bi bi-plus-circle"></i>
            <span>Join DAO</span>
          </DaoLink>
        </div>
      </Item>
    ))}

    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Title`}
      props={{
        imgUrl: 'https://ipfs.near.social/ipfs/bafkreianbwxwl3i4ofrjicw7xsjizza2ixogaupcyu36b2n2uteui5povm',
        text: "Get Funding for your project"
      }}
    />

    <Section>
      Participate in Grassroot, as a member or a grant receiver (Join Ambassador Programs, Create Degen content and receive rewards, Participate in content creation or implement your development Idea and onboard 1mil users)
    </Section>
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.DaosByVertical`}
      props={{ daos }}
    />
  </Container>
);
