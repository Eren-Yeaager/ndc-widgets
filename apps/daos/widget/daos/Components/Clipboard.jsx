return (
  <OverlayTrigger
    placement="auto"
    overlay={
      <Tooltip>{state.copied ? "Copied!" : "Copy to clipboard"}</Tooltip>
    }
  >
    <div
      className="d-flex justify-content-center align-itetms-center"
      role="button"
      onClick={() => {
        clipboard.writeText(props.text).then(() => {
          State.update({ copied: true });
          if (props.onCopy) {
            props.onCopy(props.text);
          }
        });
      }}
    >
      {state.copied ? (
        <>
          {props.copiedIcon ?? <i className="blue ph ph-check fs-5" />}
          {props.copiedLabel ?? props.label}
        </>
      ) : (
        <>
          {props.clipboardIcon ?? <i className="blue ph ph-share-fat fs-5" />}{" "}
          {props.label}
        </>
      )}
    </div>
  </OverlayTrigger>
);
