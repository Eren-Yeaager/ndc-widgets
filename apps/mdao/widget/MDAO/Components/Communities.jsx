const maxLimit = props.limit || 1000;
const darkTheme = props.theme === "dark";

const STATUS = {
  GOOD: ["Yes", "Approved", "Yes, include in special request"],
  BAD: ["No"],
};

const Item = styled.div`
  width: 350px;
  height: 280px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

  h4 {
    color: #000
    font-size: 24px;
  }

  &.dark {
    position: relative;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
    padding: 2px;

    h4 {
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;
    }
  }

  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;
  }

  i {
    color: ${(props) => (darkTheme ? "#f0ddce" : "#d0d0d0")};

    &:hover {
      color: ${(props) => (darkTheme ? "#fff" : "#000")};
    }
  }

  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const Img = styled.img`
  border-radius: 50%;
  background: #eaeaea;
  width: 100px !important;
  height: 100px !important;
`;

const [communities, setCommunities] = useState([]);

const fetchCommunities = () => {
  const sheetId = "1CxRHo8y6HYqWY7FuguTN8laUjNqeUjDhtnXb4mbV7V4";
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const sheetName = "Logo";
  const query = encodeURIComponent("Select *");
  const url = `${base}&sheet=${sheetName}&tq=${query}`;
  const resp = fetch(url);

  if (resp?.body) {
    let jsonString = resp.body.match(/(?<="table":).*(?=}\);)/g)[0];
    let json = JSON.parse(jsonString);

    setCommunities(json.rows.map((item) => item.c));
  }
};

fetchCommunities();

if (communities.length === 0)
  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <Widget src="flashui.near/widget/Loading" /> <b>Loading communities...</b>
    </div>
  );

const Connect = ({ item }) => (
  <Item className={`${darkTheme ? "dark" : ""} `}>
    <div className="inner d-flex flex-column justify-content-center gap-3 align-items-center">
      <Img src={item[5].v} />
      <h4 className="bold color-text px-3 mt-1 text-center">{item[1].v}</h4>
      <div className="d-flex gap-4">
        {item[3].v && (
          <a href={item[3].v} target="_blank">
            <i className={`fs-4 bi bi-telegram`} />
          </a>
        )}
        {item[4].v && (
          <a href={item[4].v} target="_blank">
            <i className={`fs-4 bi bi-twitter-x`} />
          </a>
        )}
      </div>
    </div>
  </Item>
);

return (
  <div className="d-flex flex-wrap gap-5 justify-content-center">
    {communities.slice(0, maxLimit).map((item) => (
      <Connect item={item} />
    ))}
  </div>
);
