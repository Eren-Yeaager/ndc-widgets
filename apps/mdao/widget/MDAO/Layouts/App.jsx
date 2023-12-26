const Theme = styled.div`
  font-style: normal;
  background: linear-gradient(
    258deg,
    rgba(162, 195, 254, 0.25) 0%,
    rgba(225, 197, 252, 0.25) 28.72%,
    rgba(241, 220, 210, 0.25) 100%
  );

  a {
    color: inherit;
    font-weight: 500;

    &.color-text {
      background: linear-gradient(
        270deg,
        rgb(246 112 85) 1%,
        rgb(180 102 248) 50%,
        rgb(82 129 249) 99.83%
      );

      &.color-dark {
        background: linear-gradient(
          270deg,
          #efdcd1 -1.69%,
          #e0c6f7 43.78%,
          #adc3fb 99.83%
        );
      }
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .profile {
    a {
      color: inherit;
      font-weight: 400;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #151718;
  }

  img {
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100vh;
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
        <Widget src={`/*__@replace:widgetPath__*/.Components.Footer`} />
      </Container>
    </Theme>
  );
}

return { AppLayout };
