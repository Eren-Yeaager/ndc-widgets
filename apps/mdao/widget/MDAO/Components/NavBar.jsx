const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

const [showMenu, setShowMenu] = useState(false);

const links = [
  {
    title: "ACTIVITY FEED",
    href: "//*__@replace:widgetPath__*/.App?page=reports",
    color: "#FDEFB1",
    items: [
      {
        title: "List of Proposals",
        href: "//*__@replace:widgetPath__*/.App?page=proposals",
      },
      {
        title: "List of Reports",
        href: "//*__@replace:widgetPath__*/.App?page=reports",
      },
      {
        title: "Guidance for Proposals and Reports",
        href: "//*__@replace:widgetPath__*/.App?page=guidance",
      },
    ],
  },
  {
    title: "COMMUNITIES",
    href: "//*__@replace:widgetPath__*/.App?page=communities",
    color: "#F7CCFA",
  },
  {
    title: "ABOUT",
    href: "#about",
    color: "#AFC5FE",
    items: [
      {
        title: "MDAO Charter",
        href: "//*__@replace:widgetPath__*/.App?page=charter",
      },
      {
        title: "MDAO social media strategy",
        href: "//*__@replace:widgetPath__*/.App?page=info",
      },
      {
        title: "Achievements",
        href: "//*__@replace:widgetPath__*/.App?page=achievements",
      },
      {
        title: "Councils",
        href: "//*__@replace:widgetPath__*/.App?page=councils",
      },
      {
        title: "Meetings and Workshops Calendar",
        href: "//*__@replace:widgetPath__*/.App?page=meetings",
      },
      {
        title: "MDAO Bounty program",
        href: "//*__@replace:widgetPath__*/.App?page=bouties",
      },
    ],
  },
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

  .dropdown {
    position: relative;
    display: inline-block;
    height: 50px;

    &:hover .dropdown-content {
      display: block;
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    width: 250px;
    top: 40px;
    right: 0;
    background-color: #f1f1f1;
    border-radius: 10px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;

    .link {
      padding: 12px 16px;
      text-decoration: none;
      display: block;

      a {
        color: black;
        &:hover {
          text-decoration: none;
        }
      }

      &:hover {
        background-color: #ddd;
      }

      &:first-child {
        &:hover {
          border-radius: 10px 10px 0 0;
        }
      }

      &:last-child {
        &:hover {
          border-radius: 0 0 10px 10px;
        }
      }
    }
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
  width: 270px;
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
        {links.map((link) => (
          <Link className="d-flex gap-2 align-items-center" to={link.href}>
            <Circle bg={link.color} />
            {link.items?.length > 0 ? (
              <div className="d-flex align-items-center  dropdown">
                <div>{link.title}</div>
                <div className="dropdown-content">
                  {link.items.map(({ title, href }) => (
                    <div className="d-flex gap-2 link align-items-center">
                      <i className="bi bi-chevron-right text-black" />
                      <Link to={href}>{title}</Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>{link.title}</div>
            )}
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
          {links.map((link) => (
            <>
              {link.items?.length > 0 ? (
                <>
                  <Link className="d-flex gap-2 align-items-center">
                    <Circle bg={link.color} />
                    <div>{link.title}</div>
                  </Link>
                  <div className="d-flex gap-3 flex-column">
                    {link.items.map(({ title, href }) => (
                      <div className="d-flex gap-2 align-items-center">
                        <i className="bi bi-chevron-right text-white" />
                        <Link to={href}>{title}</Link>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  className="d-flex gap-2 align-items-center"
                  to={link.href}
                >
                  <Circle bg={link.color} />
                  <div>{link.title}</div>
                </Link>
              )}
            </>
          ))}
        </div>
      </MobileNav>
    )}
  </Navbar>
);
