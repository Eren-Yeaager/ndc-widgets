const Item = styled.div`
  width: 350px;
  height: 280px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

  h4 {
    color: #000
    font-size: 24px;
  }

  &.dark {
    position: relative;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
    padding: 2px;


    h4, a, i {
      width: 100%;
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    a {
      width: 50%;
      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;
      span {
        color: white;
      }
    }
  }



  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;
  }

  svg {
    margin: 7px;
  }

  i, svg {
    color: ${darkTheme ? "#f0ddce" : "#A4C2FD"};
    fill: ${darkTheme ? "#f0ddce" : "#A4C2FD"};

    &:hover {
      color: ${darkTheme ? "#fff" : "#151718"};
      fill: ${darkTheme ? "#fff" : "#151718"};
    }
  }

  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const Container = styled.div`
  h3,
  h4,
  span {
    color: white;
  }

  .subTitle {
    color: #fff;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .title {
    color: #fff;
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .topSection {
    width: 87%;
    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  @media screen and (max-width: 786px) {
    padding: 2rem;
  }
`;

const SubmitProposal = styled.a`
  width: 100%;
  border: 2px solid #efdcd1;
  border-radius: 10px;
  padding: 10px 25px;
  background: linear-gradient(
    270deg,
    #efdcd1 -1.69%,
    #e0c6f7 43.78%,
    #adc3fb 99.83%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const { section, dao_id } = props;

return (
  <Container>
    <div className="d-flex flex-wrap gap-5 pt-3">
      <div className="topSection">
        <h3 className="subTitle">{section.guidance.subTitle}</h3>
        <h4 className="title">{section.guidance.title}</h4>
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Description`}
          props={{ text: section.guidance.description }}
        />
      </div>
      <div className="d-flex c w-100 gap-5">
        {section.guidance.cards.map((card) => (
          <Item className="dark">
            <div className="inner d-flex flex-column justify-content-center gap-3 align-items-lefy">
              <h4 className="bold color-text px-3 mt-1 text-left">
                {card.title}
              </h4>
              <span className="bold color-text px-3 mt-1 text-left">
                {card.description}
              </span>
              <div className="d-flex px-3">
                <a href={card.button.link}>{card.button.title}</a>
                <i className="bi bi-chevron-right" />
              </div>
            </div>
          </Item>
        ))}
      </div>

      <div className="d-flex px-3">
        <SubmitProposal
          href={`//*__@replace:widgetPath__*/.App?page=create_proposal&dao_id=${dao_id}`}
        >
          Submit Proposal
        </SubmitProposal>
        <i className="bi bi-chevron-right" />
      </div>
    </div>
  </Container>
);
