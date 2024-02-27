const { dao, section } = props;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  z-index: 1;
  padding: 4rem;

  div.content {
    position: relative;
    z-index: 3;
  }
`;

const ReadMore = ({ title, href }) => (
  <a href="" className="text-center btn-primary d-flex justify-content-end">
    <div className="d-flex justify-content-between">
      <a href={href}>{title}</a>
      <i className="bi bi-chevron-right" />
    </div>
  </a>
);

const Info = ({ card }) => (
  <div className="item d-flex flex-column mt-5 gap-2 justify-content-between">
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

const TopContainer = styled.div`
  width: 70%;
  padding-bottom: 20px;
  padding-left: 10px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

return (
  <Wrapper>
    <div className="content">
      <div>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Title`}
          props={{ text: dao.title }}
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
    </div>

    <Widget src={`/*__@replace:widgetPath__*/.Components.Circles`} />
  </Wrapper>
);
