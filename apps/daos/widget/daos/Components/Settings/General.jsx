let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

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

const AutoComplete = styled.div`
  margin: 5px 0;
`;

const [daoTitle, setDaoTitle] = useState("");
const [daoDescription, setDaoDescription] = useState("");
const [daoLogoUrl, setDaoLogoUrl] = useState("");
const [daoBannerUrl, setDaoBannerUrl] = useState("");
const [daoAccountId, setDaoAccountId] = useState("");

useEffect(() => {
  if (selectedDao) {
    setDaoTitle(selectedDao.title);
    setDaoDescription(selectedDao.description);
    setDaoLogoUrl(selectedDao.logo_url);
    setDaoBannerUrl(selectedDao.banner_url);
    setDaoAccountId(selectedDao.account_id);
  }
}, [selectedDao]);

const handleSave = () => {
  Near.call(contractName, "edit_dao", {
    id: selectedDao.id,
    body: {
      title: daoTitle,
      handle: selectedDao.handle,
      dao_type: selectedDao.dao_type,
      description: daoDescription,
      logo_url: daoLogoUrl,
      banner_url: daoBannerUrl,
      account_id: daoAccountId,
    },
    verticals: selectedDao.verticals,
    metrics: selectedDao.metrics,
    metadata: selectedDao.metadata,
  });
};

return (
  <div className="d-flex flex-column gap-3">
    <div className="form-element">
      <label className="form-label">DAO wallet</label>
      <input
        className="form-control"
        type="text"
        value={daoAccountId}
        onChange={(e) => setDaoAccountId(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Title</label>
      <input
        className="form-control"
        type="text"
        value={daoTitle}
        onChange={(e) => setDaoTitle(e.target.value)}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Description</label>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.MarkdownEditor`}
        props={{
          element: { value: daoDescription },
          handleChange: (_element, value) => setDaoDescription(value),
        }}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Logo Image</label>
      {daoLogoUrl && (
        <div className="mb-2 w-25">
          <img className="w-25 object-fit-contain" src={daoLogoUrl} />
        </div>
      )}
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.FileUploader`}
        props={{
          onChange: (file) => setDaoLogoUrl(file),
          children: (
            <div role="button" className="btn btn-secondary">
              Upload Logo
            </div>
          ),
        }}
      />
    </div>

    <div className="form-element">
      <label className="form-label">Banner Image</label>
      {daoBannerUrl && (
        <div className="mb-2 w-100">
          <img className="object-fit-contain" src={daoBannerUrl} />
        </div>
      )}
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.FileUploader`}
        props={{
          onChange: (file) => setDaoBannerUrl(file),

          children: (
            <div role="button" className="btn btn-secondary">
              Upload Banner
            </div>
          ),
        }}
      />
    </div>

    <button className="btn btn-primary" onClick={handleSave}>
      <i className="ph ph-pencil-simple fs-5" />
      Save
    </button>
  </div>
);
