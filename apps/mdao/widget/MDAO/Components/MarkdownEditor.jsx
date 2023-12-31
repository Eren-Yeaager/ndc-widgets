const { element, handleChange } = props;

const MarkdownSection = styled.div`
  padding-bottom: 0px;
`;

const PreviewSection = styled.div`
  border: 1px solid #e0e0e0;
  background: #fff;
  padding: 1rem;
  margin-bottom: 7px;
`;

const [preview, setPreview] = useState(false);
const [text, setText] = useState(element.value);

return (
  <>
    {preview ? (
      <PreviewSection>
        <Widget src="mob.near/widget/SocialMarkdown" props={{ text }} />
      </PreviewSection>
    ) : (
      <MarkdownSection>
        <Widget
          src="mob.near/widget/MarkdownEditorIframe"
          props={{
            initialText: text,
            onChange: (val) => {
              handleChange(element, val);
              setText(val);
            },
          }}
        />
      </MarkdownSection>
    )}
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={() => setPreview(!preview)}
    >
      Preview
      <i className="bi bi-eye" />
    </button>
  </>
);
