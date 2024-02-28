let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const { dao_id } = props;

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

const form = {
  Report: [
    {
      name: "project_name",
      label: "Project Name",
      value: "",
      type: "text",
      required: true,
    },
    {
      name: "proposal_id",
      label: "Proposal ID",
      value: "",
      type: "text",
      required: false,
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
      name: "metric:performance_statement:answer_1",
      label:
        "Performance Statement: What is the biggest win (most improved part of project) during this funding period vs. the previous one (if applicable)?",
      value: "",
      type: "textarea",
      required: true,
    },
    {
      name: "metric:performance_statement:answer_2",
      label:
        "Performance statement: What is the biggest challenge your project is facing? What did not improve during this funding period?",
      value: "",
      type: "textarea",
      required: true,
    },
  ],
  Proposal: [
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
      required: false,
    },
    {
      name: "tags",
      label: "Tags",
      value: "",
      type: "tag",
    },
  ],
};

const [formEls, setFormEls] = useState({
  accountId: context.accountId,
  type: "Proposal",
  id: new Date().getTime(),
  description: form.Proposal.find((el) => el.name === "description").value,
});

const [errors, setErrors] = useState({});

const handleChange = (el, value) => {
  const newFormEl = formEls;
  const newFormElErrors = errors;
  newFormEl[el.name] = value;
  newFormElErrors[el.name] = value.length < 1;

  setErrors(newFormElErrors);
  setFormEls(newFormEl);
};

const handleSave = () => {
  let body = {
    title: formEls.project_name,
    description: formEls.description,
    labels: formEls.tags ?? [],
    post_type: formEls.type,
    requested_amount: parseInt(formEls.requested_amount ?? 0),
    metrics: {},
    reports: [],
    attachments: [],
  };

  if (formEls.type === "Report") {
    body.proposal_id = formEls.proposal_id;
    body.report_version = "V1";
  } else {
    body.proposal_version = "V1";
  }

  Near.call(contractName, "add_post", {
    dao_id: parseInt(dao_id),
    body,
  });
};

return (
  <Container>
    <div className="d-flex justify-content-center">
      <FormWrapper className="mt-3 mb-5 d-flex flex-column gap-3">
        <div className="title d-flex flex-column align-items-center text-center mb-4">
          <h1>DAO Proposal / Report Form</h1>
          <div className="mt-3 text-center">
            <p>
              <b>Please use this form to report key performance metrics.</b>
            </p>
          </div>
        </div>

        <Widget
          src="/*__@replace:widgetPath__*/.Components.Form"
          props={{ form, formEls, setFormEls, handleChange, handleSave, dao_id }}
        />
      </FormWrapper>
    </div>
  </Container>
);
