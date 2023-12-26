let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
assets = assets.home;
content = content.home;

const STATUS = {
  GOOD: ["Yes", "Approved", "Yes, include in special request"],
  BAD: ["No"],
};
const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const ConnectSection = styled.div`
  padding: 5rem 3rem;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }
`;

return (
  <Container>
    <ConnectSection className="d-flex flex-column">
      <Widget src="/*__@replace:widgetPath__*/.Components.Communities" />
    </ConnectSection>
  </Container>
);
