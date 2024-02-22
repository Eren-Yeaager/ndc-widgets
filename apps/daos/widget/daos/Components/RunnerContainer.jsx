const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: rgb(43, 41, 51);
  padding: 8px;
  overflow: hidden;
  position: relative;

  .scroll {
    display: flex;
    animation: scroll 30s linear infinite;
  }

  &:hover {
    .scroll {
      animation-play-state: paused;
    }
  }
`;

const Badge = styled.div`
  width: 350px;
  min-width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 10px 0;
  gap: 1rem;
  color: white;
  font-size: 1em;
  border-left: 0.5px solid rgba(164, 194, 253, 0.1);
  border-right: 0.5px solid rgba(164, 194, 253, 0.1);
`;

const Amount = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: #fdefb1;
`;

const Label = styled.span`
  font-size: 1em;
  font-weight: 600;
`;

const Status = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  padding: 0 1rem;
  border-radius: 20px;
  border: 1px solid ${(p) => p.color};
  height: 20px;
  color: ${(p) => p.color};
  font-weight: 600;
`;

const Logo = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: #151718;

  img {
    width: 28px;
    height: 28px;
  }
`;

const badgesData = [
  {
    amount: "20,000$",
    label: "Marketing DAO",
    date: "Nov 22, 2023",
    image:
      "https://ipfs.near.social/ipfs/bafkreictoneit73n5dtqkzacepuoywtuwlee5ejnolcn7gam3xfdrabmba",
    status: "New",
  },
  {
    amount: "7,000$",
    label: "Marketing DAO",
    date: "Nov 22, 2023",
    image:
      "https://ipfs.near.social/ipfs/bafkreictoneit73n5dtqkzacepuoywtuwlee5ejnolcn7gam3xfdrabmba",
    status: "Closed",
  },
  {
    amount: "10,000$",
    label: "Marketing DAO",
    date: "Nov 22, 2023",
    image:
      "https://ipfs.near.social/ipfs/bafkreictoneit73n5dtqkzacepuoywtuwlee5ejnolcn7gam3xfdrabmba",
    status: "InReview",
  },
  {
    amount: "800$",
    label: "Marketing DAO",
    date: "Nov 22, 2023",
    image:
      "https://ipfs.near.social/ipfs/bafkreictoneit73n5dtqkzacepuoywtuwlee5ejnolcn7gam3xfdrabmba",
    status: "Approved",
  },
  {
    amount: "800$",
    label: "Marketing DAO",
    date: "Nov 22, 2023",
    image:
      "https://ipfs.near.social/ipfs/bafkreictoneit73n5dtqkzacepuoywtuwlee5ejnolcn7gam3xfdrabmba",
    status: "Rejected",
  },
];

const colorMap = (status) => {
  switch (status) {
    case "New":
      return "rgb(146 168 210)";
    case "Closed":
      return "rgb(196 196 196)";
    case "InReview":
      return "rgb(223 193 73)";
    case "Approved":
      return "rgb(99 222 100)";
    case "Rejected":
      return "rgb(214 113 113)";
    default:
      break;
  }
};

return (
  <Container>
    {[1, 2, 3].map((el) => (
      <div className="scroll">
        {badgesData.map((badge, index) => (
          <Badge key={index} role="button">
            <Logo>
              <img src={badge.image} />
            </Logo>
            <div className="d-flex flex-column gap-1">
              <div className="d-flex gap-2 align-items-center">
                <Amount>{badge.amount}</Amount>
                <Label>{badge.label}</Label>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <small>{badge.date}</small>
                <Status color={colorMap(badge.status)}>{badge.status}</Status>
              </div>
            </div>
          </Badge>
        ))}
      </div>
    ))}
  </Container>
);
