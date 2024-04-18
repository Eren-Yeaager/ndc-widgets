let { content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`,
);

const { id } = props;
const accountId = context.accountId;

let isFollowed = false;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .image-container {
    position: relative;
    display: inline-block;
  }

  .overlay-button {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media screen and (max-width: 786px) {
      top: 75%;
      left: 85%;
    }
  }

  a.btn {
    border: 2px solid white;
    background: #151718;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
    color: #f0f0f0;
    font-size: 18px;
    font-weight: bold;
    text-align: center !important;

    &:hover {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 4rem;
  background: ${(p) => (p.bgColor ? p.bgColor : "inherit")};

  @media screen and (max-width: 786px) {
    padding: 2rem;
  }

  &.with-circles {
    padding: 0;
  }

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

  .item {
    width: 75%;
    .header {
      display: flex;
      border-radius: 10px 10px 0px 0px;

      h4 {
        margin: 10px 0 0 0;
        width: max-content;
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
        text-decoration: none;
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

if (!contractName || !content)
  return <Widget src="flashui.near/widget/Loading" />;

const dao = Near.view(contractName, "get_dao_by_handle", { handle: id });
const section = content.daos[id].sections;

if (accountId) {
  const followedDaos = Near.view(contractName, "get_follow_dao", {
    account_id: accountId,
  });

  if (!followedDaos) return <Widget src="flashui.near/widget/Loading" />;

  isFollowed = followedDaos.find((d) => d.handle === dao.handle);
}

if (!dao) return <Widget src="flashui.near/widget/Loading" />;

const projects = Near.view(contractName, "get_dao_communities", {
  dao_list: [dao.id],
});

const ProjectCard = ({ project }) => (
  <ProjectContainer src={project.logo_url}>
    <div className="wrapper">
      <div className="image" />
    </div>
    <span className="title">{project.title}</span>
  </ProjectContainer>
);

const handelOnFollow = () => {
  if (isFollowed) return;
  if (dao.checkin_account_id) {
    const UserFollowDao_Payload = {
      contractName: contractName,
      methodName: "user_follow_dao",
      args: {
        id: dao.id,
      },
      deposit: 0,
    };

    const CheckIn_Payload = {
      contractName: dao.checkin_account_id,
      methodName: "check_in",
      args: {},
      deposit: 0,
    };

    Near.call([UserFollowDao_Payload, CheckIn_Payload])
      .then(() => {
        console.log("Transactions completed");
      })
      .catch((error) => {
        console.error("Error in sending transactions:", error);
      });
  } else {
    Near.call(contractName, "user_follow_dao", { id: dao.id });
  }
};

return (
  <Container>
    {accountId ? (
      <div className="image-container">
        <img className="hero-img" src={dao.banner_url} alt="Banner Image" />
        <a
          className="overlay-button btn"
          style={{ cursor: isFollowed ? "default" : "pointer" }}
          onClick={handelOnFollow}
        >
          {isFollowed ? "Following" : "Follow"}
        </a>
      </div>
    ) : (
      <img className="hero-img" src={dao.banner_url} alt="Banner Image" />
    )}
    <Section className="with-circles">
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Dao.Info`}
        props={{ section, dao }}
      />
    </Section>

    {projects?.length > 0 ? (
      <Section>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Dao.Communities`}
          props={{
            title: section.projects.title,
            projects: projects.slice(0, 5),
          }}
        />

        <div className="d-flex gap-3 w-100 flex-wrap justify-content-center">
          <a
            className="dao-btn"
            href={`//*__@replace:widgetPath__*/.App?page=communities&dao_id=${dao.handle}`}
          >
            Show All {section.projects.title}
          </a>
        </div>
      </Section>
    ) : (
      ""
    )}

    <Section style={{ background: "black" }}>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Dao.Guidance`}
        props={{ section: section, dao }}
      />
    </Section>
    {dao.metadata.contacts && (
      <Section className="d-flex flex-column gap-5">
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Dao.OfficeHours`}
          props={{ dao }}
        />
      </Section>
    )}
  </Container>
);
