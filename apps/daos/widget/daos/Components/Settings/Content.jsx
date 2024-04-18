let { content, contractName } = VM.require(
  `/*__@replace:widgetPath__*/.Config`,
);
if (!contractName || !content)
  return <Widget src="flashui.near/widget/Loading" />;

const { selectedDao } = props;

const Form = styled.div`
  border-radius: 20px;
  background: white;
  padding: 3rem;

  label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .form-control.error {
    border: 1px solid red;
  }

  .title {
    b {
      font-weight: 600;
    }
    font-weight: 300;

    a {
      text-decoration: underline;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const Contact = styled.div`
  display: flex;
  flex-direction: row;

  .form-element {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const [daoContent, setDaoContent] = useState({});

useEffect(() => {
  if (selectedDao) {
    setDaoContent(
      selectedDao.metadata.content
        ? JSON.parse(selectedDao.metadata.content)
        : {
            info: {},
            guidance: {},
          },
    );
  }
}, [selectedDao]);

const handleSave = () => {
  Near.call(contractName, "edit_dao", {
    id: selectedDao.id,
    body: {
      title: selectedDao.title,
      handle: selectedDao.handle,
      dao_type: selectedDao.dao_type,
      description: selectedDao.description,
      logo_url: selectedDao.logo_url,
      banner_url: selectedDao.banner_url,
      account_id: selectedDao.account_id,
    },
    verticals: selectedDao.verticals,
    metrics: selectedDao.metrics,
    metadata: {
      ...selectedDao.metadata,
      content: JSON.stringify(daoContent),
    },
  });
};

return (
  <Form className="d-flex flex-column gap-3">
    <Widget
      src="near/widget/DIG.Tabs"
      props={{
        variant: "line",
        size: "default",
        items: [
          ...content.info.cards.map(({ title, icon }, index) => {
            return {
              name: (
                <>
                  <img style={{ width: "20px" }} src={icon} />
                  {title}
                </>
              ),
              value: index,
              content: (
                <Widget
                  src={`/*__@replace:widgetPath__*/.Components.Settings.InfoCard`}
                  props={{
                    section: "info",
                    key: title,
                    selectedDao,
                    daoContent,
                    setDaoContent,
                  }}
                />
              ),
            };
          }),
          ...content.guidance.cards.map(({ title, icon }, index) => {
            return {
              name: title,
              value: index + content.info.cards.length,
              content: (
                <Widget
                  src={`/*__@replace:widgetPath__*/.Components.Settings.InfoCard`}
                  props={{
                    section: "guidance",
                    key: title,
                    selectedDao,
                    daoContent,
                    setDaoContent,
                  }}
                />
              ),
              icon,
            };
          }),
        ],
      }}
    />

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="ph ph-pencil-simple fs-5" />
      Save
    </button>
  </Form>
);
