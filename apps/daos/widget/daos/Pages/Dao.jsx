let { assets, content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`
);

const { id } = props;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section = styled.div`
  padding: 4rem 3rem;
  background: ${(p) => (p.bgColor ? p.bgColor : "inherit")};

  h2 {
    font-size: 3rem;
    font-weight: 600;
    width: 80%;

    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .item {
    color: inherit;
    width: 350px;
    height: 400px;
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

    .icon {
      width: 50px;
    }

    p {
      font-size: 16px;
      font-weight: 300;
      margin: 0;
    }

    a {
      color: #151718 !important;
    }

    @media screen and (max-width: 786px) {
      width: 100%;
    }

    a.btn-primary {
      border-radius: 10px;
      border: 2px solid #e6cde6;
      background: rgba(252, 248, 246, 0);
      box-shadow: unset;
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

const [loading, setLoading] = useState(false);

const dao = Near.view(contractName, "get_dao_by_id", { id: parseInt(id) });

if (!dao || !contractName || !content || !assets)
  return <Widget src="flashui.near/widget/Loading" />;

const ReadMore = ({ title, href }) => (
  <a href="" className="text-center btn-primary d-flex justify-content-end">
    <div className="d-flex justify-content-between">
      <a href={href}>{title}</a>
      <i className="bi bi-chevron-right" />
    </div>
  </a>
);

const Info = ({ card }) => (
  <div className="item d-flex flex-column gap-2 justify-content-between">
    <div className="header gap-3 p-4 text-center">
      <img className="icon" src={card.icon} />
      <h4>{card.title}</h4>
    </div>
    <div className="p-4 text-center">
      <p>{card.description}</p>
    </div>
    <div className="px-5 pb-4">
      <ReadMore href={card.button.link} title={card.button.title} />
    </div>
  </div>
);

const section = content.daos[id].sections;
console.log(section.info.cards);
return (
  <Container>
    <img className="hero-img" src={dao.banner_url} />

    <Section className="d-flex flex-column gap-5">
      <h2>{dao.title}</h2>
      <h4>{dao.description}</h4>
      <div className="d-flex flex-wrap gap-5 justify-content-center">
        {section.info.cards.map((card) => (
          <Info card={card} />
        ))}
      </div>
    </Section>

    <Section className="d-flex flex-column gap-5">
      <h2>{section.roadmap.title}</h2>
      <p>{section.roadmap.description}</p>
      <ReadMore
        href={section.roadmap.button.link}
        title={section.roadmap.button.title}
      />
    </Section>

    <Section className="d-flex flex-column gap-5">
      <h2>{section.guidance.title}</h2>
      <p>{section.guidance.description}</p>
    </Section>

    <Section className="d-flex flex-column gap-5">
      <h2>{section.office.title}</h2>
      <p>{section.office.description}</p>
    </Section>
  </Container>
);
