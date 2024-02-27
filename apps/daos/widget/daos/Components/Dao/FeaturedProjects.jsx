const { section, projects } = props;

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
        lightgray 100% / cover no-repeat;
    }
  }

  .title {
    color: #222325;
    font-size: 20px;
    font-weight: 400;
  }
`;

const ProjectCard = ({ project }) => (
  <ProjectContainer src={project.logo_url}>
    <div className="wrapper">
      <div className="image" />
    </div>
    <span className="title">{project.title}</span>
  </ProjectContainer>
);

return (
  <>
    <h3>{section.projects.title}</h3>
    <ProjectsContainer>
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </ProjectsContainer>
  </>
);
