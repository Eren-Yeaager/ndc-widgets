const CopyButton = styled.div`
  display: flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  font-size: 20px;
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
      <i class="ph ph-share-fat"></i>

      {state.copied ? (
        <>{props.copiedLabel ?? props.label}</>
      ) : (
        <>{props.label}</>
      )}
    </CopyButton>
  </OverlayTrigger>
);
