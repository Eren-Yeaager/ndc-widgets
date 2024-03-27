const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { hasNotifications } = props;

if (!assets) return <Widget src="flashui.near/widget/Loading" />;
const accountId = context.accountId;
const [admin, _widget, _name] = `/*__@replace:widgetPath__*/.Config`.split("/");
const [showNav, setShowNav] = useState(false);
const items = [
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
    href: `//*__@replace:widgetPath__*/.App?page=settings`,
  },
];

const Container = styled.div`
  position: sticky;
  top: -1px;
  padding: 1rem;
  z-index: 10001;
  width: 100%;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.03);

  a {
    font-weight: 600;
    &:hover {
      text-decoration: none;
    }
  }

  .desktop {
    display: flex;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .mobile {
    display: none;
    @media screen and (max-width: 768px) {
      display: flex;
    }

    .btn-create-post {
      padding: 0 20px;
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
    margin-left: 24px;
    padding: 8px 24px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
<<<<<<< HEAD
  gap: 1rem;
=======
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
>>>>>>> main

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
`;

<<<<<<< HEAD
const Title = styled.span`
  color: #000;
  font-size: 27px;
  font-weight: 750;
`;

const MobileNavigation = () => (
  <div className="w-100 pt-4 pb-2 d-flex flex-column justify-content-center align-items-center gap-3">
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    {items.map((i) => (
      <a href={i.href}>{i.name}</a>
    ))}
  </div>
);

const Navigation = () => (
  <div className="d-flex align-items-center gap-4">
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    <a
      className="btn-primary"
=======
const NavigationLinks = () => (
  <>
    <a href={`//*__@replace:widgetPath__*/.App?page=daos`}>DAOs</a>
    <a href={`//*__@replace:widgetPath__*/.App?page=proposals`}>Proposals</a>
    <a
      className="post-btn d-flex align-items-center justify-content-center gap-2"
>>>>>>> main
      href={`//*__@replace:widgetPath__*/.App?page=create_post`}
    >
      <i className="ph ph-plus fs-6" />
      Create Post
    </a>
  </>
);

return (
<<<<<<< HEAD
  <Container>
    <Navbar className="container-xl">
      <a
        className="d-flex gap-2 align-items-center"
        href={`//*__@replace:widgetPath__*/.App`}
      >
        <img src={assets.logoWhite} />
        <Title>NDC</Title>
=======
  <Container className="position-relative">
    <Navbar>
      <a className="logo" href={`//*__@replace:widgetPath__*/.App`}>
        <img src={assets.logoWhite} />
        <span>NDC</span>
>>>>>>> main
      </a>
      <div className="d-flex align-items-center">
        {accountId && (
          <LinksContainer>
            <div className="desktop">
              <Navigation />

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
                    items,
                  }}
                />
              </div>
            </div>

<<<<<<< HEAD
            <div className="mobile">
              <div className="d-flex gap-3">
                <a
                  className="btn-primary btn-create-post"
                  href={`//*__@replace:widgetPath__*/.App?page=create_post`}
                >
                  <i className="ph ph-plus fs-6" />
                  Create Post
                </a>
                <a href="#">
                  <i
                    className="btn-icon btn-secondary outlined ph ph-list fs-5"
                    onClick={() => setShowNav(!showNav)}
                  />
                </a>
              </div>
            </div>
=======
            <a href={`//*__@replace:widgetPath__*/.App?page=settings`}>
              <i className="bi bi-gear-fill fs-3" />
            </a>

            <a
              href={`//*__@replace:widgetPath__*/.App?page=proposals&accountId=${context.accountId}`}
            >
              <i className="bi bi-person-circle fs-3" />
            </a>
>>>>>>> main
          </LinksContainer>
        )}
      </div>
    </Navbar>

    {showNav && (
      <div className="mobile">
        <MobileNavigation />
      </div>
    )}
  </Container>
);
