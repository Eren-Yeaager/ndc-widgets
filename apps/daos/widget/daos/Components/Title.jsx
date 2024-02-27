const { imgUrl, text } = props;

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;

  img {
    width: 33px;
    margin-right: 15px;
  }

  span {
    color: #151718;
    font-family: Montserrat;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;

return (
  <Title>
    {imgUrl && <img src={imgUrl}></img>}
    <span style={{ ...props.style }}>{text}</span>
  </Title>
);
