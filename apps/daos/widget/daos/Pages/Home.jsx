let { assets, content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);
let { Hero } = VM.require(`/*__@replace:widgetPath__*/.Components.Hero`);

if (!contractName || !content || !assets || !Hero)
  return <Widget src="flashui.near/widget/Loading" />;

assets = assets.home;
content = content.home;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Item = styled.div`
  width: 350px;
  height: 280px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;

  a.btn {
    &:hover {
      text-decoration: none;
    }
  }

  h4 {
    color: #000
    font-size: 24px;
  }

  &.dark {
    position: relative;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
    padding: 2px;

    h4 {
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;
    }
  }

  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;
  }

  svg {
    margin: 7px;
  }

  i, svg {
    color: ${darkTheme ? "#f0ddce" : "#A4C2FD"};
    fill: ${darkTheme ? "#f0ddce" : "#A4C2FD"};

    &:hover {
      color: ${darkTheme ? "#fff" : "#151718"};
      fill: ${darkTheme ? "#fff" : "#151718"};
    }
  }

  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const daos = Near.view(contractName, "get_dao_list");

return (
  <Container>
    {daos.map((dao) => (
      <Item>
        <div className="inner d-flex flex-column justify-content-center gap-3 align-items-center">
          <Widget
            src={`/*__@replace:widgetPath__*/.Components.CommunityImage`}
            props={{ image: dao.logo_url, index }}
          />
          <h4 className="bold color-text px-3 mt-1 text-center">{dao.title}</h4>
          <Link
            style={{ background: "#A4C2FD", borderColor: "#A4C2FD" }}
            href={`//*__@replace:widgetPath__*/.App?page=proposals&daoId=${dao.id}`}
            className="btn btn-secondary d-flex justify-content-between"
          >
            <span>Learn more</span>
          </Link>
        </div>
      </Item>
    ))}
  </Container>
);
