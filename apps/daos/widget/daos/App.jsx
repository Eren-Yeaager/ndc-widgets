const { AppLayout } = VM.require(`/*__@replace:widgetPath__*/.Layouts.App`);
const { page } = props;

if (!AppLayout) return <Widget src="flashui.near/widget/Loading" />;
if (!page) page = "home";

function Page() {
  switch (page) {
    case "dashboard": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Dashboard`}
          props={props}
        />
      );
    }
    case "settings": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Settings`}
          props={props}
        />
      );
    }
    case "comments": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Comments.Index`}
          props={props}
        />
      );
    }
    case "activity": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Activity`}
          props={props}
        />
      );
    }
    case "home": {
      return (
        <Widget src={`/*__@replace:widgetPath__*/.Pages.Home`} props={props} />
      );
    }
    case "info": {
      return (
        <Widget src={`/*__@replace:widgetPath__*/.Pages.Info`} props={props} />
      );
    }
    case "councils": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Councils`}
          props={props}
        />
      );
    }
    case "achievements": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Achievements`}
          props={props}
        />
      );
    }
    case "guidance": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Guidance`}
          props={props}
        />
      );
    }
    case "reports": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.List`}
          props={{ type: "Report", ...props }}
        />
      );
    }
    case "proposals": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.List`}
          props={{ type: "Proposal", ...props }}
        />
      );
    }
    case "dao": {
      if (props.id === "1")
        return (
          <Widget
            src={`/*__@replace:widgetPath__*/.Pages.Home`}
            props={props}
          />
        );
      else
        return (
          <Widget
            src={`/*__@replace:widgetPath__*/.Pages.Daos.Index`}
            props={{ ...props }}
          />
        );
    }
    case "proposal": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.Index`}
          props={{ ...props }}
        />
      );
    }
    case "daos": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Daos.List`}
          props={{ ...props }}
        />
      );
    }
    case "communities": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Daos.Communities`}
          props={{ ...props }}
        />
      );
    }
    case "create_post": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.Create`}
          props={props}
        />
      );
    }
    case "edit_post": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.Create`}
          props={props}
        />
      );
    }
    case "projects": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Projects`}
          props={props}
        />
      );
    }

    default: {
      const NotFound = styled.div`
        width: 100%;
        height: 70vh;

        h1 {
          font-size: 10rem;
        }

        h2 {
          font-size: 2rem;
        }
      `;

      return (
        <NotFound className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
          <h1>
            <b>404</b>
          </h1>
          <h2>Page does not exist</h2>
        </NotFound>
      );
    }
  }
}

return (
  <AppLayout page={page} props={props}>
    <Page />
  </AppLayout>
);
