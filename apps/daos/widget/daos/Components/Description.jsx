const { imgUrl, text } = props;

const Description = styled.div`
  color: #1e1d22;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

return (
  <Description>
    <span>{props.text}</span>
  </Description>
);
