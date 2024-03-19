const {
  form,
  formEls,
  setFormEls,
  handleChange,
  handleSave,
  handleSelectDao,
  handleAttachments,
  attachments,
  daos,
  selectedDaoId,
  id,
} = props;

const TypeSection = styled.div`
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  margin-right: 100px;
  width: 100%;
  text-transform: uppercase;
  h4 {
    font-weight: 600;
    margin: 0;
  }
`;

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
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-beetween;
  gap: 2rem;
  padding-top: 2rem;

  @media screen and (max-width: 786px) {
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
  }
`;

const MobileForm = styled.div`
  @media screen and (max-width: 786px) {
    padding-bottom: 2rem;
  }
`;

const UploadFileButton = styled.div`
  width: 47%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const [preview, setPreview] = useState(false);

const PreviewButton = () => (
  <div
    style={{ width: "max-content" }}
    className="btn-primary"
    onClick={() => setPreview(!preview)}
  >
    Preview
    <i className="bi bi-eye" />
  </div>
);

const ProposalButton = () => (
  <button
    style={{ width: "max-content" }}
    className="btn btn-primary"
    disabled={form[formEls.post_type].some(
      (el) => el.required && !formEls[el.name]
    )}
    onClick={handleSave}
  >
    {id ? "Edit" : "Create"} proposal
    <i className="bi bi-plus-lg" />
  </button>
);

return (
  <>
    {preview ? (
      <MobileForm>
        <Widget
          src="/*__@replace:widgetPath__*/.Components.Post"
          props={{
            item: { ...formEls, dao_id: selectedDaoId, attachments },
            index: 0,
            post_type: formEls.post_type,
            showMoreDefault: 0,
            preview: true,
            attachments,
          }}
        />
        <ButtonContainer>
          <PreviewButton />
          <ProposalButton />
        </ButtonContainer>
      </MobileForm>
    ) : (
      <Form className="d-flex flex-column gap-3">
        <div
          onClick={() => {
            const newFormEl = formEls;
            newFormEl.post_type =
              formEls.post_type === "Proposal" ? "Report" : "Proposal";
            setFormEls(newFormEl);
          }}
        >
          <p className="mb-2">Post type</p>
          <div className="d-flex gap-3 align-items-center">
            <Widget src={`/*__@replace:widgetPath__*/.Components.Switch`} />
            <TypeSection>
              <h4>{formEls.post_type}</h4>
            </TypeSection>
          </div>
        </div>
        <div className="form-element">
          <label>Select Dao</label>
          <select
            className="form-control"
            value={selectedDaoId}
            onChange={handleSelectDao}
            disabled={!!id}
          >
            {daos.map((dao) => (
              <option value={dao.id}>{dao.name}</option>
            ))}
          </select>
        </div>
        {form[formEls.post_type].map((el) => (
          <div className="form-element">
            <label for={el.name}>
              {el.label}
              {el.required && "*"}
            </label>
            {el.type === "file" ? (
              <Widget
                src={`/*__@replace:widgetPath__*/.Components.FileUploader`}
                props={{
                  onChange: (fileUrl) => handleChange(el, fileUrl),
                }}
              />
            ) : el.type === "textarea" ? (
              <div className="d-flex flex-wrap">
                <Widget
                  src={`/*__@replace:widgetPath__*/.Components.MarkdownEditor`}
                  props={{
                    element: { ...el, value: formEls[el.name] ?? el.value },
                    handleChange,
                  }}
                />
              </div>
            ) : el.type === "tag" ? (
              <Widget
                src={"sayalot.near/widget/TagsEditor"}
                props={{
                  label: "Tags",
                  placeholder: "Enter tags",
                  setTagsObject: (tags) => handleChange(el, Object.keys(tags)),
                }}
              />
            ) : (
              <input
                class={`form-control ${error[el.name] && "error"}`}
                type={el.type}
                name={el.name}
                min={el.min}
                value={formEls[el.name] ?? ""}
                onChange={(e) => handleChange(el, e.target.value)}
              />
            )}
          </div>
        ))}
        <Widget
          src={"/*__@replace:widgetPath__*/.Components.Attachment"}
          props={{ attachments }}
        />
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.FileUploader`}
          props={{
            onChange: handleAttachments,
            children: (
              <UploadFileButton className="btn-primary">
                Upload File
              </UploadFileButton>
            ),
            styles: { width: "90%" },
            classNames: "",
          }}
        />
        <ButtonContainer>
          <PreviewButton />
          <ProposalButton />
        </ButtonContainer>
        <a
          className="d-flex gap-2"
          target="_blank"
          href="https://docs.google.com/document/d/110CqEddPa-99JwM8iCl_kKJxdXLH6IlVePwubO5A55o/edit#heading=h.qya6e5j9ka46"
        >
          <span>Near Digital Collective application form GUIDE</span>
          <i className="bi bi-box-arrow-up-right" />
        </a>
      </Form>
    )}
  </>
);
