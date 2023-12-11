const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

const [showMenu, setShowMenu] = useState(false);

const links = [
  {
    title: "ACTIVITY FEED",
    href: "//*__@replace:widgetPath__*/.App?page=reports",
    color: "#FDEFB1",
  },
  {
    title: "COMMUNITIES",
    href: "//*__@replace:widgetPath__*/.App?page=communities",
    color: "#F7CCFA",
  },
  { title: "ABOUT", href: "#about", color: "#AFC5FE" },
];

const Navbar = styled.div`
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #151718;

  @media screen and (max-width: 768px) {
    padding: 1.5rem 2rem;

    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  a {
    color: #fff;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.bg};
`;

const MobileNav = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
  }

  position: absolute;
  top: 0;
  right: 0;

  width: 207px;

  padding: 24px 36px 36px 16px;
  flex-direction: column;
  align-items: flex-end;
  gap: 2.5rem;
  flex-shrink: 0;

  border-radius: 0px 0px 0px 16px;
  background: rgba(21, 23, 24, 0.7);
  backdrop-filter: blur(5px);

  z-index: 50;

  a {
    color: #fff;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const MobileLink = styled.a`
  color: #f4f4f4 !important;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 100% */
  margin-bottom: 1rem;

  &.active {
    color: #00ec97 !important;
  }

  &:hover {
    text-decoration: none;
    color: #00ec97 !important;
  }
`;

const MobileMenu = styled.button`
  all: unset;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

return (
  <Navbar className="position-relative">
    <a href={`//*__@replace:widgetPath__*/.App?page=home`}>
      <img src={assets.logoWhite} />
    </a>
    <div className="d-flex gap-3 align-items-center">
      <LinksContainer>
        {links.map(({ title, href, color }) => (
          <Link className="d-flex gap-2 align-items-center" to={href}>
            <Circle bg={color} />
            <div>{title}</div>
          </Link>
        ))}
      </LinksContainer>
      <MobileMenu className="fs-1" onClick={() => setShowMenu(!showMenu)}>
        <i className="bi bi-list text-white" />
      </MobileMenu>
    </div>

    {showMenu && (
      <MobileNav>
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{ cursor: "pointer" }}
          className="fs-1"
        >
          <i className="bi bi-x text-white" />
        </div>
        <div className="d-flex flex-column gap-4">
          {links.map(({ title, href, color }) => (
            <Link className="d-flex gap-2 align-items-center" to={href}>
              <Circle bg={color} />
              <div>{title}</div>
            </Link>
          ))}
        </div>
      </MobileNav>
    )}
  </Navbar>
);
