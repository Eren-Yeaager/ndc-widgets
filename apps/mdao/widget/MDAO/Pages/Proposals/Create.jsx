let { assets, content, socialKey } = VM.require(`//*__@replace:widgetPath__*/.Config`);

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;

  h3 {
    font-size: 2rem;
    font-weight: 400;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 300;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    width: 100%;
    padding: 1rem;
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

const form = {
  report: [
    {
      name: "project_name",
      label: "Project Name",
      value: "",
      type: "text",
      required: true,
    },
    {
      name: "contact",
      label: "Main contact (near.social or Telegram)",
      value: "",
      type: "text",
      required: true,
    },
    {
      name: "metric:audience",
      label:
        "Audience Metric: how many people did your project reach during this funding period?",
      value: "",
      type: "number",
      required: true,
    },
    {
      name: "metric:growth",
      label:
        "Growth Metric: how does this month's audience reach compare to previous periods (provide a %)",
      value: "",
      type: "number",
      required: true,
    },
    {
      name: "metric:average_engagement_rate",
      label:
        "Average Engagement Rate: what is the average engagement rate on your project's primary platform (choose one)? Use the formula (Total Likes, Shares & Comments / Total Followers) X 100 = AER %",
      value: "",
      type: "number",
      required: true,
    },
    {
      name: "performance_statement:answer_1",
      label:
        "Performance Statement: What is the biggest win (most improved part of project) during this funding period vs. the previous one (if applicable)?",
      value: "",
      type: "textarea",
      required: true,
    },
    {
      name: "performance_statement:answer_2",
      label:
        "Performance statement: What is the biggest challenge your project is facing? What did not improve during this funding period?",
      value: "",
      type: "textarea",
      required: true,
    },
    {
      name: "attachments",
      label: "Include any attachment(s)",
      value: "",
      type: "file",
    },
  ],
  proposal: [
    {
      name: "project_name",
      label: "Project Name",
      value: "",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      value: "# Title\n## Description",
      type: "textarea",
      required: true,
    },
    {
      name: "requested_amount",
      label: "Requested Amount (USD)",
      value: "",
      type: "number",
      required: true,
    },
    {
      name: "tag",
      label: "Tags",
      value: "",
      type: "tag",
    },
  ],
};

const [formEls, setFormEls] = useState({
  accountId: context.accountId,
  type: "proposal",
});

const [errors, setErrors] = useState({});

const handleChange = (el, value) => {
  const newFormEl = formEls;
  const newFormElErrors = errors;
  newFormEl[el.name] = value;
  newFormEl.id = new Date().getTime();
  newFormElErrors[el.name] = value.length < 1;

  setErrors(newFormElErrors);
  setFormEls(newFormEl);
};

const ProposalButton = () => (
  <CommitButton
    style={{ width: "max-content" }}
    className="btn btn-primary"
    disabled={form[formEls.type].some(
      (el) =>
        el.required &&
        (errors[el.name] === true || errors[el.name] === undefined)
    )}
    data={{
      index: {
        graph: JSON.stringify({
          key: socialKey,
          value: formEls,
        }),
      },
    }}
  >
    Create proposal
    <i className="bi bi-plus-lg" />
  </CommitButton>
);

return (
  <Container>
    <div className="d-flex justify-content-center">
      <FormWrapper className="mt-3 mb-5 d-flex flex-column gap-3">
        <div className="title d-flex flex-column align-items-center text-center mb-4">
          <h1>Marketing DAO Reports & Proposals Form</h1>
          <div className="mt-3 text-center">
            <p>
              <b>Please use this form to report key performance metrics.</b>
            </p>
            <div className="text-center">
              <i className="fs-6 bi bi-info-circle-fill" /> Questions? Reach out
              via <a href="https://t.me/ndc_marketing">Telegram</a> or email:
              <a href="mailto:marketingdao@proton.me">marketingdao@proton.me</a>
              🙂
            </div>
          </div>
        </div>

        <Form className="d-flex flex-column gap-3">
          <div
            onClick={() => {
              const newFormEl = formEls;
              newFormEl.type =
                formEls.type === "proposal" ? "report" : "proposal";
              setFormEls(newFormEl);
            }}
          >
            <p className="mb-2">Form type</p>
            <div className="d-flex gap-3 align-items-center">
              <Widget src={`/*__@replace:widgetPath__*/.Components.Switch`} />
              <TypeSection>
                <h4>{formEls.type}</h4>
              </TypeSection>
            </div>
          </div>

          {form[formEls.type].map((el) => (
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
                    props={{ element: el, handleChange }}
                  />
                </div>
              ) : el.type === "tag" ? (
                <Widget
                  src={"sayalot.near/widget/TagsEditor"}
                  props={{
                    label: "Tags",
                    placeholder: "Enter tags",
                    setTagsObject: (tags) =>
                      handleChange(el, Object.keys(tags)),
                  }}
                />
              ) : (
                <input
                  class={`form-control ${error[el.name] && "error"}`}
                  type={el.type}
                  name={el.name}
                  value={formEls[el.name] ?? ""}
                  onChange={(e) => handleChange(el, e.target.value)}
                />
              )}
            </div>
          ))}
          <ProposalButton />
          <a
            className="d-flex gap-2"
            target="_blank"
            href="https://docs.google.com/document/d/110CqEddPa-99JwM8iCl_kKJxdXLH6IlVePwubO5A55o/edit#heading=h.qya6e5j9ka46"
          >
            <span>Near Digital Collective application form GUIDE</span>
            <i className="bi bi-box-arrow-up-right" />
          </a>
        </Form>
      </FormWrapper>
    </div>
  </Container>
);
