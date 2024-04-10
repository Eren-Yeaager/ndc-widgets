const CopyButton = styled.div`
  display: flex;
  height: 30px;
  padding: 6px 14px 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  border: 1px solid #f0efe7;
  background: #fff;
  .copyText {
    font-size: 10px;
  }
`;

return (
  <OverlayTrigger
    placement="auto"
    overlay={
      <Tooltip>{state.copied ? "Copied!" : "Copy to clipboard"}</Tooltip>
    }
  >
    <CopyButton
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        clipboard.writeText(props.text).then(() => {
          State.update({ copied: true });
          if (props.onCopy) {
            props.onCopy(props.text);
          }
        });
      }}
    >
      <i class="ph ph-link"></i>
      <span className="copyText">Copy</span>

      {state.copied ? (
        <>{props.copiedLabel ?? props.label}</>
      ) : (
        <>{props.label}</>
      )}
    </CopyButton>
  </OverlayTrigger>
);
