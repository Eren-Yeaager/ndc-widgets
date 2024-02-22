const { imgUrl, text } = props;

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2rem 0;

  img {
    width: 33px;
  }

  span {
    color: #151718;
    font-family: Montserrat;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding-left: 15px;
  }
`;

return (
  <Title>
    <img src={imgUrl}></img>
    <span>{text}</span>
  </Title>
);
