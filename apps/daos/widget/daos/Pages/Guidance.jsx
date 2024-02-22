let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const HeroSection = styled.div`
  width: 100%;
  background: linear-gradient(
    96deg,
    #fdefb1 -19.42%,
    #e1c4fe 49.87%,
    #95c3fe 98.55%
  );
  height: 600px;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 5.2rem;
    font-weight: 600;
    margin-bottom: 0;
    @media screen and (max-width: 786px) {
      font-size: 3rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 300;
    max-width: 800px;
    margin-bottom: 0;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0;
  }

  img {
    width: 500px;
    height: 500px;
    @media screen and (max-width: 786px) {
      display: none;
    }
  }
}`;

const InfoSection = styled.div`
  width: 75%;
  padding: 5rem 3rem;
  font-weight: 300;
  font-size: 1.2rem;

  h1 {
    font-size: 3rem;
    font-weight: 600;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
    padding: 2rem 1rem;
  }
`;

return (
  <Container>
    <InfoSection
      style={{ height: "100vh" }}
      className="d-flex flex-column gap-4 mx-auto"
    >
      Watch our guidance:{" "}
      <a href="https://youtu.be/XaYKceQz_e4">https://youtu.be/XaYKceQz_e4</a>
    </InfoSection>
  </Container>
);
