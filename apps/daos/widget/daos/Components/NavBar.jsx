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

  a {
    font-weight: 600;
    &:hover {
      text-decoration: none;
    }
  }
`;

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .account {
    display: flex;
    align-items: center;
    gap: 8px;
    border-left: 1px solid #f0efe7;
    padding: 8px 24px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

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

const Title = styled.span`
  color: #000;
  font-size: 27px;
  font-weight: 750;
`;

const NavigationLinks = () => (
  <div className="d-flex align-items-center gap-5">
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    <a
      className="btn-primary"
      href={`//*__@replace:widgetPath__*/.App?page=create_post`}
    >
      <i className="ph ph-plus fs-6" />
      Create Post
    </a>
  </div>
);

return (
  <Container>
    <Navbar className="container-xl">
      <a
        className="d-flex gap-2 align-items-center"
        href={`//*__@replace:widgetPath__*/.App`}
      >
        <img src={assets.logoWhite} />
        <Title>NDC</Title>
      </a>
      <div className="d-flex align-items-center">
        {accountId && (
          <LinksContainer>
            <div className="links">
              <NavigationLinks />
            </div>
            <a href="#">
              <i
                className="menu-icon ph ph-list fs-5"
                onClick={() => setShowNav(!showNav)}
              />
            </a>
            <div className="account">
              <Widget
                src="near/widget/DIG.DropdownMenu"
                props={{
                  trigger: (
                    <div className="d-flex gap-3 align-items-center">
                      <div className="d-flex gap-2 align-items-center">
                        <i className="ph ph-user" />
                        <span>{context.accountId}</span>
                      </div>
                      <i className="ph ph-caret-down" />
                    </div>
                  ),
                  items: [
                    {
                      name: "My Proposals",
                      iconLeft: "ph ph-clipboard-text fs-6",
                      href: `//*__@replace:widgetPath__*/.App?page=proposals&accountId=${context.accountId}`,
                    },
                    {
                      name: "My Reports",
                      iconLeft: "ph ph-presentation-chart fs-6",
                      href: `//*__@replace:widgetPath__*/.App?page=reports&accountId=${context.accountId}`,
                    },
                    {
                      name: "Settings",
                      iconLeft: "ph ph-gear-six fs-6",
                      href: `//*__@replace:widgetPath__*/.App?page=config`,
                    },
                  ],
                }}
              />
            </div>
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
