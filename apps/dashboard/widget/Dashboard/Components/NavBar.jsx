const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

const Navbar = styled.div`
  position: relative;
  padding: 1rem 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #151718;

  .header-text {
    color: #fcf8ff;
    font-size: 24px;
    font-weight: 750;
  }

  .color-text {
    font-size: 24px;
    font-weight: 750;
    background: linear-gradient(
      270deg,
      #59d -9.91%,
      #e89dbb 53.26%,
      #f8c050 113.62%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media screen and (max-width: 768px) {
      display: none;
      margin: -10px;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1rem 2rem;

    img {
      width: 50px;
      height: 50px;
    }
  }
`;

return (
  <Navbar>
    <a href={`//*__@replace:widgetPath__*/.App?page=home`}>
      <div className="d-flex gap-3 align-items-center">
        <img src={assets.logoWhite} />
        <div className="header-text">NDC DASHBOARD</div>
      </div>
    </a>
    <div className="color-text">FOR PEOPLE BY PEOPLE</div>
  </Navbar>
);
