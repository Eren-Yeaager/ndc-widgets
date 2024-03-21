const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { title, hasNotifications, daoId, accountId } = props;

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

const links = [
  {
    text: "Reports",
    href: `//*__@replace:widgetPath__*/.App?page=reports${
      daoId ? `&dao_id=${daoId}` : accountId ? `&accountId=${accountId}` : ""
    }`,
    style: "outlined",
    icon: <i className="bi bi-clipboard-data-fill" />,
  },
  {
    text: "Proposals",
    href: `//*__@replace:widgetPath__*/.App?page=proposals${
      daoId ? `&dao_id=${daoId}` : accountId ? `&accountId=${accountId}` : ""
    }`,
    style: "invresed",
    icon: <i className="bi bi-file-earmark-text-fill" />,
  },
  // {
  //   text: "Comments",
  //   href: `//*__@replace:widgetPath__*/.App?page=comments`,
  //   disabled: true,
  //   icon: <i className="bi bi-chat-square-text-fill" />,
  // },
  // {
  //   text: "Favourites",
  //   href: `//*__@replace:widgetPath__*/.App?page=favourites`,
  //   disabled: true,
  //   icon: <i className="bi bi-star-fill" />,
  // },
];

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  align-items: center;
  width: 100%;

  @media screen and (max-width: 1020px) {
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  a {
    width: 150px;
    text-align: center;
    justify-content: center;
    text-decoration: none;
  }
`;

return (
  <Navbar>
    <div>{title}</div>
    <LinksContainer>
      {links.map(({ icon, style, disabled, text, href }) => (
        <a
          className={`btn-secondary ${style} ${
            disabled ? "disabled" : "active"
          }`}
          href={href}
        >
          {icon}
          <div className="text">{text}</div>
        </a>
      ))}
    </LinksContainer>
  </Navbar>
);
