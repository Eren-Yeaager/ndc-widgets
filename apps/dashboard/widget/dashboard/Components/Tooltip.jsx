const Container = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  i:hover + .content {
    visibility: visible;
    opacity: 1;
    color: #6b6c75;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
  }

  .content {
    visibility: hidden;
    min-width: ${(props) => props.minWidth ?? "150px"};
    background-color: #ffffff;
    border-radius: 5px;
    padding: 7px 10px;
    position: absolute;
    z-index: 1;
    bottom: 130%;
    left: 50%;
    opacity: 0;
    transition: opacity 0.3s;
    transform: translateX(-50%);
  }
`;

const { content, icon, minWidth } = props;

return (
  <Container minWidth={minWidth}>
    {icon}
    <div className="content">{content}</div>
  </Container>
);
