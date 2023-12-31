let fontCss = fetch("https://fonts.cdnfonts.com/css/avenir-lt-pro");

if (!fontCss) {
  function AppLayout({ page, children }) {
    return <></>;
  }
  return { AppLayout };
}
fontCss = fontCss.body;

const Theme = styled.div`
  font-weight: 500;
  font-family: "Avenir LT Pro", sans-serif;
  ${fontCss};
  font-style: normal;
  background: #e8ecf0 !important;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .section {
    border-radius: 20px;
    display: flex;
    padding: 1rem 2rem;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background: #f9fcff;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.05);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

function AppLayout({ page, children }) {
  return (
    <Theme>
      <Container>
        <Widget src={`/*__@replace:widgetPath__*/.Components.NavBar`} />
        <ContentContainer>{children}</ContentContainer>
      </Container>
    </Theme>
  );
}

return { AppLayout };
