let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const GAS = "200000000000000";
const DEPOSIT = 10000000000000000000000;
const { dao_id, id } = props;
const accountId = context.accountId;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
  padding: 1rem 0 5rem 0;

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

  @media screen and (max-width: 786px) {
    width: 100%;
    padding: 1rem;
  }
`;

const form = {
  Report: [
    {
      name: "title",
      label: "Title",
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
      name: "audience",
      label:
        "How many people did your project reach during this funding period?",
      value: "",
      type: "number",
      required: false,
    },
    {
      name: "growth",
      label:
        "How does this month's audience reach compare to previous periods (provide a %)",
      value: "",
      type: "number",
      required: false,
    },
    {
      name: "average_engagement_rate",
      label:
        "What is the average engagement rate on your project's primary platform (choose one)? Use the formula (Total Likes, Shares & Comments / Total Followers) X 100 = AER %",
      value: "",
      type: "number",
      required: false,
    },
    {
      name: "performance_statement_1",
      label:
        "What is the biggest win (most improved part of project) during this funding period vs. the previous one (if applicable)?",
      value: "",
      type: "textarea",
      required: false,
    },
    {
      name: "performance_statement_2",
      label:
        "What is the biggest challenge your project is facing? What did not improve during this funding period?",
      value: "",
      type: "textarea",
      required: false,
    },
  ],
  Proposal: [
    {
      name: "title",
      label: "Title",
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
      min: "0",
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

const [post, setPost] = useState(null);
const [formEls, setFormEls] = useState({
  accountId: accountId,
  post_type: "Proposal",
  title: "",
  description: form.Proposal.find((el) => el.name === "description").value,
});

if (id) {
  const post = Near.view(contractName, "get_post_by_id", { id: parseInt(id) });
  setPost(post);
}

let daos = null;
daos = Near.view(contractName, "get_dao_list");

const [errors, setErrors] = useState({});
const [selectedDaoId, setSelectedDaoId] = useState(0);
const [attachments, setAttachments] = useState([]);

useEffect(() => {
  if (post) {
    setFormEls({
      ...formEls,
      ...post.metrics,
      title: post.title,
      description: post.description,
      requested_amount: post.requested_amount ?? 0,
      tags: post.labels ?? [],
      post_type: post.post_type,
    });
    setAttachments(post.attachments);
  }
}, [post]);

useEffect(() => {
  if (daos) {
    setSelectedDaoId(daos.find((d) => d.handle === dao_id).id || daos[0].id);
  }
}, [daos]);

const handleChange = (el, value) => {
  if (el.name === "requested_amount" && value.startsWith("-")) return;
  const newFormEl = formEls;
  const newFormElErrors = errors;
  newFormEl[el.name] = value;
  newFormElErrors[el.name] = value.length < 1;

  setErrors(newFormElErrors);
  setFormEls(newFormEl);
};

if (daos) {
  let daosSorted = daos;
  if (selectedDaoId === daos[0].id) {
    daosSorted = daos.sort((a, b) => {
      const daoTypeA = a.dao_type.toUpperCase();
      const daoTypeB = b.dao_type.toUpperCase();

      if (daoTypeA < daoTypeB) {
        return 1;
      }
      if (daoTypeA > daoTypeB) {
        return -1;
      }
      return 0;
    });
  }
  daos = daosSorted.map((dao) => {
    return { name: dao.title, id: dao.id };
  });
}

if (!daos) return <Widget src="flashui.near/widget/Loading" />;

const handleSelectDao = (e) => {
  setSelectedDaoId(e.target.value);
};

const handleAttachments = (file) => {
  setAttachments([file]);
};

const handleSave = () => {
  if (!accountId) return;

  let body = {
    title: formEls.title,
    labels: formEls.tags ?? [],
    post_type: formEls.post_type,
    requested_amount: parseInt(formEls.requested_amount ?? 0),
    description: formEls.description,
    metrics: {},
    reports: [],
    attachments,
  };

  if (formEls.post_type === "Report") {
    body.proposal_id = parseInt(formEls.proposal_id);
    body.metrics = {
      audience: formEls["audience"],
      growth: formEls["growth"],
      average_engagement_rate: formEls["average_engagement_rate"],
      performance_statement_1: formEls["performance_statement_1"],
      performance_statement_2: formEls["performance_statement_2"],
    };
    body.report_version = "V1";
  } else {
    body.proposal_version = "V1";
  }

  id
    ? Near.call(
        contractName,
        "edit_post",
        { id: parseInt(id), body },
        GAS,
        DEPOSIT
      )
    : Near.call(
        contractName,
        "add_post",
        {
          dao_id: parseInt(selectedDaoId),
          body,
        },
        GAS,
        DEPOSIT
      );
};

return (
  <Container>
    <div className="d-flex justify-content-center">
      <FormWrapper className="mt-3 mb-5 d-flex flex-column gap-3">
        <div className="title d-flex flex-column align-items-center text-center mb-4">
          <h1>DAO Post creation Form</h1>
          <div className="mt-3 text-center">
            <p>
              <b>Please use this form to report key performance metrics.</b>
            </p>
          </div>
        </div>

        <Widget
          src="/*__@replace:widgetPath__*/.Components.Form"
          props={{
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
          }}
        />
      </FormWrapper>
    </div>
  </Container>
);
