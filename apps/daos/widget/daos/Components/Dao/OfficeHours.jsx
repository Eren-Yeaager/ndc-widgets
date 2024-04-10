let { content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!content) return <Widget src="flashui.near/widget/Loading" />;

const { dao } = props;

const daoContent = JSON.parse(dao.metadata.contacts);

const Wrapper = styled.div`
  display: flex;
  border-radius: 10px;
  background: #fff;

  div.content {
    position: relative;
    z-index: 3;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentArea = styled.div`
  padding: 40px;
  width: 60%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const PrimaryButton = styled.a`
  &.btn-primary {
    margin-top: 20px;
    border-radius: 10px;
    background: #151718;
    border: #151718;
    box-shadow: 0px 20px 30px 0px rgba(31, 27, 50, 0.22);
    display: flex;
    color: white;

    :hover {
      border: black;
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const SecondaryButton = styled.a`
  &.btn-primary {
    width: 45%;
    background: white;
    border: black;
    color: black !important;
    display: flex;
    margin-top: 20px;
    border-radius: 10px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }

    :hover {
      border: black;
    }
  }
`;

const Image = styled.img`
  width: 100%;
`;

return (
  <Wrapper>
    <ContentArea>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          title: "Contacts",
        }}
      />
      <p className="mt-5">
        <b>DAO admin account</b>: {daoContent.admin}
      </p>
      <p>
        <b>Point of Contacts</b>:
      </p>
      <ul>
        {daoContent?.poc &&
          daoContent?.poc?.map((poc) => (
            <li>
              <div className="d-flex gap-3 align-items-center">
                {poc.name}
                <small>
                  <a
                    className="d-flex gap-1 align-items-center bg-light p-2 rounded"
                    href={`https://t.me/${poc.tg.replace("@", "")}`}
                  >
                    <i className="ph ph-telegram-logo" />
                    {poc.tg.replace("@", "")}
                  </a>
                </small>
              </div>
            </li>
          ))}
      </ul>
      <b>Socials</b>:{" "}
      {daoContent?.tg && (
        <a href={`https://${daoContent.tg}`}>
          <i className="ph ph-telegram-logo fs-3" />
        </a>
      )}
      {daoContent?.twitter && (
        <a href={daoContent.twitter}>
          <i className="ph ph-twitter-logo fs-3" />
        </a>
      )}
    </ContentArea>
  </Wrapper>
);
