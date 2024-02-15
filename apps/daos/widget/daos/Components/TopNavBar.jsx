const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { hasNotifications } = props;

const links = [
  {
    text: "Reports",
    href: "//*__@replace:widgetPath__*/.App?page=reports",
    icon: <i className="bi bi-clipboard-data-fill fs-5" />,
  },
  {
    text: "Proposals",
    href: "//*__@replace:widgetPath__*/.App?page=proposals",
    icon: <i className="bi bi-file-earmark-text-fill fs-5" />,
  },
  {
    text: "Comments",
    href: "//*__@replace:widgetPath__*/.App?page=comments",
    icon: <i className="bi bi-chat-square-text-fill fs-5" />,
  },
  {
    text: "Favourites",
    href: "//*__@replace:widgetPath__*/.App?page=favourites",
    icon: <i className="bi bi-star-fill fs-5" />,
  },
];

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 3rem;
  gap: 3rem;
  align-items: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
`;

const LinksContainer = styled.div`
  color: #151718;
  font-size: 20px;

  a {
    padding: 2rem 1.5rem;
    &:hover {
      text-decoration: none;
      background: rgba(164, 194, 253, 0.2);
      font-weight: bold;

      i {
        color: #a4c2fd;
      }
    }
  }
`;

return (
  <Navbar>
    <div className="d-flex gap-3">
      <i style={{ color: "#a4c2fd" }} className="bi bi-person-circle fs-3" />
      <h3>
        <b>My Activity</b>
      </h3>
    </div>
    <LinksContainer className="d-flex justify-content-between">
      {links.map(({ icon, text, href }) => (
        <a className="d-flex gap-2 align-items-center" href={href}>
          {icon}
          <div>{text}</div>
        </a>
      ))}
    </LinksContainer>
  </Navbar>
);
