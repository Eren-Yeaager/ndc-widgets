let { assets, socials, content } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

const page = props.page;
const showFooterPages = [
  null,
  undefined,
  "home",
  "dao",
  "councils",
  "guidance",
  "achievements",
  "communities",
];

const Footer = styled.div`
  display: ${showFooterPages.includes(page) ? "flex" : "none"};
  width: 100%;
  position; absolute;
  bottom: 0;
  background: #151718;
  padding: 3rem 0;
`;

const Description = styled.p`
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  tet-align: center;
  width: 50%;

  @media screen and (max-width: 786px) {
    width: 80%;
  }
`;

const Socials = () => (
  <div className="d-flex gap-5">
    {Object.entries(socials).map(([name, link]) => (
      <a href={link} target="_blank">
        <i className={`fs-1 text-white ph ph-${name}`} />
      </a>
    ))}
  </div>
);

return (
  <Footer className="justify-content-center">
    <div className="d-flex flex-column align-items-center gap-4">
      <a href={`//*__@replace:widgetPath__*/.App?page=home`}>
        <img src={assets.logoWhite} />
      </a>
      <Description>{content.home.footerDesc}</Description>
      <Socials />
    </div>
  </Footer>
);
