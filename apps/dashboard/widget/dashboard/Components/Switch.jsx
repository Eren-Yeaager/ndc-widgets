const Switch = styled.div`
  border-radius: 100px;
  border: 1px solid #e3e3e0;
  background: #fff;
  display: flex;
  padding: 6px;
  justify-content: center;
  align-items: center;
`;

const Tab = styled.div`
  display: flex;
  height: 34px;
  padding: 1px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  background: ${(props) => (props.selected ? "#000" : "#fff")};
  color: ${(props) => (props.selected ? "#fff" : "#000")};

  span {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const { options, value, onChange } = props;

return (
  <Switch onClick={onChange}>
    {options.map((option) => (
      <Tab role="button" selected={option.title === value}>
        {option.icon && <i className={option.icon} />}
        <span>{option.title}</span>
      </Tab>
    ))}
  </Switch>
);
