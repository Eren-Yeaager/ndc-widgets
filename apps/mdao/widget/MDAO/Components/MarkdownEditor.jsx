const { element, handleChange } = props;

const MarkdownSection = styled.div`
  padding-bottom: 0px;
  width: 100%;
  height: 400px;
`;

const [text, setText] = useState(element.value);

return (
  <>
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
  </>
);
