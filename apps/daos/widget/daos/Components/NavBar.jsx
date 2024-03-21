const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { hasNotifications } = props;

if (!assets) return <Widget src="flashui.near/widget/Loading" />;
const accountId = context.accountId;
const [admin, _widget, _name] = `/*__@replace:widgetPath__*/.Config`.split("/");
const [showNav, setShowNav] = useState(false);

const Container = styled.div`
  position: relative;
  padding: 1rem;
  width: 100%;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.03);

  .navigation {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    display: none;

    @media screen and (max-width: 768px) {
      display: flex;
    }
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
  gap: 2rem;

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
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    <a
      className="btn-primary"
      href={`//*__@replace:widgetPath__*/.App?page=create_post`}
    >
      <i className="bi bi-plus-lg" />
      Create Post
    </a>
  </>
);

return (
  <Container>
    <Navbar className="container-xl">
      <a href={`//*__@replace:widgetPath__*/.App`}>
        <img src={assets.logoWhite} />
      </a>
      <div className="d-flex align-items-center">
        {accountId && (
          <LinksContainer>
            <div className="links gap-5">
              <NavigationLinks />
            </div>
            <a href="#">
              <i
                className="menu-icon bi bi-list fs-1"
                onClick={() => setShowNav(!showNav)}
              />
            </a>
            {context.accountId === admin && (
              <a href={`//*__@replace:widgetPath__*/.App?page=config`}>
                <i className="bi bi-gear-fill fs-3" />
              </a>
            )}
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
