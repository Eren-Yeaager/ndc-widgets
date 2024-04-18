const { attachments } = props;

const Content = styled.div`
  .attachments {
    margin: 10px 0 20px 0;
    padding: 10px;
    border: 1px solid rgb(222 235 255);
    background: #f5f9ff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 300px;

    a {
      color: rgb(118 150 198);
      font-size: 13px;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      overflow: hidden;
    }
  }
`;

return (
  <Content>
    {attachments.length > 0 && (
      <div className="attachments">
        {attachments.map((src) => (
          <a href={src}>
            <i className="ph ph-link-simple" /> {src}
          </a>
        ))}
      </div>
    )}
  </Content>
);
