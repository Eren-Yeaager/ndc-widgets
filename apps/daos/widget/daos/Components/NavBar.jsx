const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { hasNotifications } = props;

if (!assets) return <Widget src="flashui.near/widget/Loading" />;
const accountId = context.accountId;
const [admin, _widget, _name] = `/*__@replace:widgetPath__*/.Config`.split("/");
const [showNav, setShowNav] = useState(false);

const Container = styled.div`
  padding: 1.5rem 3rem;
  width: 100%;
  background: #151718;

  .navigation {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    color: white;
    display: none;

    @media screen and (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1.5rem 2rem;
  }
`;

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3rem;
  color: white;

  @media screen and (max-width: 768px) {
    gap: 2rem;
  }

  a {
    &:hover {
      text-decoration: none;
      color: #a4c2fd;
    }
  }

  .circle {
    position: absolute;
    top: 5px;
    width: 15px;
    height: 15px;
    background-color: #ee9cbf;
    border-radius: 50%;
    border: 3px solid #151718;
  }

  .links {
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .menu-icon {
    display: none;

    @media screen and (max-width: 768px) {
      display: flex;
    }
  }
`;

const NavigationLinks = () => (
  <>
    <a href={`//*__@replace:widgetPath__*/.App?page=supported_projects`}>Supported Projects</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    <div className="d-flex flex-wrap gap-3">
      <a
        className="post-btn d-flex align-items-center justify-content-center gap-2"
        href={`//*__@replace:widgetPath__*/.App?page=create_post`}
      >
        <i className="ph ph-plus fs-5" />
        Submit Proposal
      </a>
      <a
        className="post-btn d-flex align-items-center justify-content-center gap-2"
        href="https://kyc.neardc.org/"
      >
        <i className="ph ph-identification-card fs-5" />
        KYC
      </a>
    </div>
  </>
);

return (
  <Container className="position-relative">
    <Navbar>
      <a className="logo" href={`//*__@replace:widgetPath__*/.App`}>
        <img src={assets.logoWhite} />
        <span>NDC</span>
      </a>
      <div>
        {accountId && (
          <LinksContainer>
            <div className="links gap-5">
              <NavigationLinks />
            </div>
            <a className="menu-icon" href="#">
              <i
                className="bi bi-list fs-1"
                onClick={() => setShowNav(!showNav)}
              />
            </a>

            <a href={`//*__@replace:widgetPath__*/.App?page=settings`}>
              <i className="bi bi-gear-fill fs-3" />
            </a>

            <a
              href={`//*__@replace:widgetPath__*/.App?page=proposals&accountId=${context.accountId}`}
            >
              <i className="bi bi-person-circle fs-3" />
            </a>
          </LinksContainer>
        )}
      </div>
    </Navbar>
    {showNav && (
      <div className="navigation">
        <NavigationLinks />
      </div>
    )}
  </Container>
);
