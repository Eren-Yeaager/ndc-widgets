const SubFilterItem = styled.div`
  border-radius: 10px;
  background: #a39acd;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 350;
  width: 100%;
  min-width: 270px;
  width: 100%;
  height: 50px;
  text-align: center;
`;

const {
  text,
  options,
  multiple,
  onChange,
  onClear,
  values,
  hintText,
  defaultValue,
  onFilterClick,
  id,
  filterIsOpen,
} = props;

return (
  <div className="d-flex flex-column gap-1 w-100">
    <Widget
      src={`/*__@replace:widgetPath__*/.Components.Select`}
      props={{
        containerClass: "selected-container black",
        text,
        options,
        multiple,
        onClear,
        values,
        onChange,
        onFilterClick,
        id,
        filterIsOpen,
        hintText,
        isTooltipVisible: true,
      }}
    />

    <SubFilterItem>
      <div>
        {values.length >= 1
          ? `${values.length} Selected`
          : defaultValue ?? values[0]}
      </div>
    </SubFilterItem>
  </div>
);
