const { AppLayout } = VM.require(`/*__@replace:widgetPath__*/.Layouts.App`);
const { page, ...passProps } = props;

if (!AppLayout) return <Widget src="flashui.near/widget/Loading" />;
if (!page) page = "home";

function Page() {
  switch (page) {
    case "home": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Home`}
          props={passProps}
        />
      );
    }
    case "info": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Info`}
          props={passProps}
        />
      );
    }
    case "reports": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Reports`}
          props={passProps}
        />
      );
    }
    case "createProposal": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.Create`}
          props={passProps}
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
  <AppLayout page={page}>
    <Page />
  </AppLayout>
);
