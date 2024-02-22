const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #1A1A1A; 
  padding: 8px;
  border-radius: 5px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    border-radius: 10px;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
  font-size: 1em;
  margin: 5px;
`;

const Amount = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: #FDEFB1;
`;

const Label = styled.span`
  font-size: 0.8em;
`;

const VerticalLine = styled.div`
  width: 2px; 
  background-color: #000; 
`

const badgesData = [
  { amount: '20,000$', label: 'Marketing DAO', date: 'Wed Nov 22 2023 2:28:45 AM'},
  { amount: '7,000$', label: 'Marketing DAO', date: 'Wed Nov 22 2023 2:28:45 AM' },
  { amount: '10,000$', label: 'Marketing DAO', date: 'Wed Nov 22 2023 2:28:45 AM' },
  { amount: '800$', label: 'Marketing DAO', date: 'Wed Nov 22 2023 2:28:45 AM' },
];

return (
  <Container>
    {badgesData.map((badge, index) => (
      <>
        <Badge key={index}>
            <div>
              <Amount>{badge.amount}</Amount>
              <Label>{badge.label}</Label>
            </div>
            <div>
              <Label>{badge.date}</Label>
            </div>
        </Badge>
        {index !== badgesData.length -1  &&  <VerticalLine />}
      </>
    ))}
  </Container>
)