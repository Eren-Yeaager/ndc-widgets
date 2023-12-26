let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
let { Hero } = VM.require(`/*__@replace:widgetPath__*/.Components.Hero`);

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;

  h3 {
    font-size: 2rem;
    font-weight: 400;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 300;
  }
`;

const InfoSection = styled.div`
  padding: 5rem 3rem;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }

  h2 {
    font-size: 3rem;
    font-weight: 600;
    width: 70%;

    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .participate_item {
    max-width: 350px;

    .circle {
      width: 30px !important;
      height: 30px !important;
      border-radius: 50%;
      background: #151718;
      color: white;
      font-size: 14px;
    }

    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .item {
    width: 350px;
    height: 375px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

    .header {
      border-radius: 10px 10px 0px 0px;
      background: rgba(237, 209, 241, 0.2);

      h4 {
        margin: 10px 0 0 0;
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

    a.btn-primary {
      border-radius: 10px;
      border: 2px solid #e6cde6;
      background: rgba(252, 248, 246, 0);
      font-size: 18px;
      font-weight: 400;
      color: #151718;
      padding: 5px 15px;

      div {
        width: 80%;
      }

      &:hover {
        text-decoration: none;
      }

      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }
  }
`;

const ConnectSection = styled.div`
  color: white;
  background: #151718;
  padding: 5rem 3rem;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }

  h2,
  h3,
  h4 {
    color: white;
  }

  h2 {
    font-size: 3rem;
    font-weight: 600;
    width: 70%;

    @media screen and (max-width: 786px) {
      font-size: 2.7rem;
      width: 100%;
    }
  }

  .title {
    width: 75%;

    @media screen and (max-width: 786px) {
      width: 100%;
    }

    p {
      max-width: 800px;
      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }
  }

  h4.bold {
    font-weight: 600;
  }

  div.img {
    @media screen and (max-width: 786px) {
      display: none;
    }
  }

  .item {
    width: 350px;
    border-radius: 10px;
    border: 2px solid #f0ddce;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

    p {
      font-size: 16px;
      font-weight: 300;
      margin: 0;
    }

    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .explore {
    font-size: 24px;

    a {
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      &:hover {
        background: white;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    @media screen and (max-width: 786px) {
      width: 18px;
    }
  }
`;

const SupportSection = styled.div`
  padding: 5rem 3rem 7rem 3rem;
  background: linear-gradient(
    258deg,
    rgba(162, 195, 254, 0.75) 0%,
    rgba(225, 197, 252, 0.75) 28.72%,
    rgba(241, 220, 210, 0.75) 100%
  );

  @media screen and (max-width: 786px) {
    padding: 2rem 1rem 4rem 1rem;
    text-align: center;
  }

  h2 {
    font-size: 32px;
    font-weight: 600;
  }

  .items {
    gap: 1.5rem;

    @media screen and (max-width: 786px) {
      gap: 3rem;
    }
  }

  .item {
    width: 380px;
    height: 470px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.3);

    .header {
      border-radius: 10px 10px 0px 0px;
      background: rgba(255, 255, 255, 0.3);
    }

    a.btn {
      height: 60px;
      border-radius: 10px;
      background: #151718;
      box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
      padding: 15px 25px 15px 40px;
      color: white;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;

      &:hover {
        text-decoration: none;
        background: #fffcff;
        color: #151718;

        i {
          color: #e6cde6;
        }
      }
    }

    @media screen and (max-width: 786px) {
      width: 100%;

      a.btn {
        font-size: 18px;
        padding: 15px 20px;
      }
    }
  }
`;

const STATUS = {
  GOOD: ["Yes", "Approved", "Yes, include in special request"],
  BAD: ["No"],
};

const Badge = styled.div`
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 14px;
  width: max-content;
  background: ${(props) =>
    STATUS.GOOD.includes(props.status)
      ? "rgb(89, 230, 146)"
      : STATUS.BAD.includes(props.status)
      ? "rgb(255, 121, 121)"
      : "rgb(53 53 53)"};
  color: ${(props) =>
    STATUS.GOOD.includes(props.status)
      ? "rgb(9, 52, 46)"
      : STATUS.BAD.includes(props.status)
      ? "rgb(52, 9, 9)"
      : "rgb(145 145 145)"};
`;

const Info = ({ title, desc, icon }) => (
  <div className="item d-flex flex-column gap-2 justify-content-between">
    <div className="header gap-3 p-4 text-center">
      {icon}
      <h4>{title}</h4>
    </div>
    <div className="p-4 text-center">
      <p>{desc}</p>
    </div>
    <div className="px-5 pb-4">
      <a href="" className="text-center btn-primary d-flex justify-content-end">
        <div className="d-flex justify-content-between">
          <span>Read More</span>
          <i className="bi bi-chevron-right" />
        </div>
      </a>
    </div>
  </div>
);

const Support = ({ title, items }) => (
  <div className="item d-flex flex-column">
    <h2 className="header w-100 text-center p-4">{title}</h2>
    <div className="d-flex w-100 flex-column p-4 align-items-center gap-4">
      {items.map((i) => (
        <div className="w-100">
          <a className="btn w-100" href={i.href}>
            <div className="d-flex justify-content-between align-items-center">
              <span>{i.title}</span>
              <i className="bi bi-chevron-right" />
            </div>
          </a>
        </div>
      ))}
    </div>
  </div>
);

if (!content || !assets) return <Widget src="flashui.near/widget/Loading" />;
let infoCounter = 0;

return (
  <Container>
    <Hero />

    <InfoSection className="d-flex flex-column gap-5">
      <h4>{content.info.name}</h4>
      <h2>{content.info.title}</h2>
      <div className="d-flex flex-wrap gap-5 justify-content-center">
        {content.info.sections?.map(({ title, desc, icon }) => (
          <Info title={title} desc={desc} icon={icon} />
        ))}
      </div>
    </InfoSection>

    <ConnectSection className="d-flex flex-column gap-5">
      <h4>{content.connect.name}</h4>
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex flex-column gap-3 title">
          <div>
            <h2>{content.connect.title1}</h2>
            <p>{content.connect.desc}</p>
          </div>
        </div>
        <div className="img">
          <img src={assets.puzzle} className="w-100" />
        </div>
      </div>
      <div className="d-flex flex-wrap gap-5 justify-content-center">
        <Widget
          src="/*__@replace:widgetPath__*/.Components.Communities"
          props={{ limit: 3, theme: "dark" }}
        />
      </div>
      <div className="d-flex justify-content-center explore">
        <a href={"//*__@replace:widgetPath__*/.App?page=communities"}>
          <span className="mr-4">Explore all Communities</span>
          <i className="bi bi-chevron-right" />
        </a>
      </div>
    </ConnectSection>

    <InfoSection className="d-flex flex-column gap-5">
      <h4>{content.participate.name}</h4>
      <div>
        <h2>{content.participate.title}</h2>
        <p>{content.participate.desc}</p>
      </div>
      <div className="d-flex flex-wrap justify-content-between">
        {content.participate.items?.map((section) => (
          <div className="participate_item d-flex flex-column gap-3">
            {section.map((title) => (
              <h5 className="d-flex gap-3 align-items-center">
                <div>
                  <div className="d-flex circle justify-content-center align-items-center">
                    {(infoCounter += 1)}
                  </div>
                </div>
                <span className="text-start">{title}</span>
              </h5>
            ))}
          </div>
        ))}
      </div>
    </InfoSection>

    <SupportSection className="d-flex flex-column gap-5">
      <h4>{content.support.name}</h4>
      <div className="items d-flex flex-wrap justify-content-center">
        {content.support.items.map((item) => (
          <Support title={item.title} items={item.values} />
        ))}
      </div>
    </SupportSection>
  </Container>
);
