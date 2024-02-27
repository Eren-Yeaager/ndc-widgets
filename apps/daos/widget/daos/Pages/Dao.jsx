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
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 4rem;
  background: ${(p) => (p.bgColor ? p.bgColor : "inherit")};

  h2 {
    font-size: 3rem;
    font-weight: 600;
    width: 80%;
  }

  h4 {
    color: #1e1d22;
    font-size: 24px;
    font-weight: 400;
    width: 50%;
  }

  h3 {
    color: #222325;
    font-size: 24px;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }

  h2,
  h3,
  h4 {
    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .item {
    color: inherit;
    width: 400px;
    height: 380px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

    .header {
      display: flex;
      border-radius: 10px 10px 0px 0px;
      background: rgba(237, 209, 241, 0.2);

      h4 {
        margin: 10px 0 0 0;
      }
    }

    .icon {
      width: 40px;
    }

    p {
      font-size: 16px;
      font-weight: 300;
      margin: 0;
    }

    a {
      color: #151718 !important;
      
      :hover {
        text-decoration: none
      }
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
      width: 100%;

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

const ProjectsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  align-items: center;

  .wrapper {
    background: white;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 20px 40px 0px rgba(61, 72, 102, 0.4);
    padding: 5px;

    .image {
      border-radius: 20px;
      width: 230px;
      height: 230px;
      background:
        ${(p) => (p.src ? `url(${p.src})` : none)},
        lightgray 50% / cover no-repeat;
    }
  }

  .title {
    color: #222325;
    font-size: 20px;
    font-weight: 400;
  }
`;

const [loading, setLoading] = useState(false);

const dao = Near.view(contractName, "get_dao_by_id", { id: parseInt(id) });
const projects = Near.view(contractName, "get_dao_communities", {
  dao_id: parseInt(id),
});

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
    <div className="header d-flex gap-3 p-4 text-center">
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

const ProjectCard = ({ project }) => (
  <ProjectContainer src={project.logo_url}>
    <div className="wrapper">
      <div className="image" />
    </div>
    <span className="title">{project.title}</span>
  </ProjectContainer>
);

const section = content.daos[id].sections;

return (
  <Container>
    <img className="hero-img" src={dao.banner_url} />

    <Section className="d-flex flex-column gap-5">
      <div style={{ width: "720px" }}>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Title`}
          props={{ text: dao.title, style: { padding: 0 } }}
        />
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Description`}
          props={{ text: dao.description }}
        />
      </div>
      <div className="d-flex flex-wrap gap-5 justify-content-center">
        {section.info.cards.map((card) => (
          <Info card={card} />
        ))}
      </div>
    </Section>

    {projects?.length ? (
      <Section>
        <h3>{section.projects.title}</h3>
        <ProjectsContainer>
          {projects.map((project) => (
            <ProjectCard project={project} />
          ))}
        </ProjectsContainer>
      </Section>
    ): null}

    <Section>
      <h2>{section.guidance.title}</h2>
      <p>{section.guidance.description}</p>
    </Section>

    <Section className="d-flex flex-column gap-5">
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Dao.OfficeHourse`}
        props={{ section: section }}
      />
    </Section>
  </Container>
);
