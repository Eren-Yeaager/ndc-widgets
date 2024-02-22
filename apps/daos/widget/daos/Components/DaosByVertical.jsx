const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 columns
  gap: 4rem;
  padding: 1rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 1 columns
    gap: 2rem;
  }

  a {
    &:hover {
      text-decoration: none;
    }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0  0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const CardTitle = styled.h2`
  color: white !important;
  text-align: center;
  padding: 0.5rem 0;
  border-radius: 10px 10px 0px 0px;
  background: #A4C2FD;
  margin-bottom: unset;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ListItem = styled.li`
  background: #333;
  color: white;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
`;

const ItemText = styled.span``;

const Arrow = styled.span`
  color: #007bff;
`;

const CardContainer = styled.div`
`

function groupByCategoryList(daos) {
  const categoryMap = {};

  daos.forEach(dao => {
    dao.verticals.forEach(category => {
      if (!categoryMap[category]) {
        categoryMap[category] = { title: category, links: [] };
      }

      categoryMap[category].links.push({ title: dao.title, id: dao.id });
    });
  });

  return Object.values(categoryMap).map(category => ({
    title: category.title,
    links: category.links
  }));
}

const groupedByCategory = groupByCategoryList(props.daos);

return (
  <GridContainer>
    {groupedByCategory.map((card) => (
      <CardContainer>
        <CardTitle>{card.title}</CardTitle>
        <Card key={card.title}>
          <LinkList>
            {card.links.map((link) => (
              <Link
                href={`//*__@replace:widgetPath__*/.App?page=proposals&daoId=${link.id}`}>
                <ListItem key={link}>
                  <ItemText>{link.title}</ItemText>
                  <Arrow>›</Arrow>
                </ListItem>
              </Link>
            ))}
          </LinkList>
        </Card>
      </CardContainer>
    ))}
  </GridContainer>
);



