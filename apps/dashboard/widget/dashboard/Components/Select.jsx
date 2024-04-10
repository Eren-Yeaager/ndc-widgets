const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

const Select = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  border-radius: 100px;
  border: 1px solid #e3e3e0;
  background: var(--NEAR-Primary-Colors-White, #fff);
  font-size: 14px;
  font-style: normal;

  .selected-container {
    width: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 16px;
  }

  ul {
    width: 100%;
    max-height: 12rem;
    overflow-y: scroll;
    background: #fff;
    color: initial;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 0.5rem 0;
    top: 50px;
    z-index: 100;

    li {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;

      .truncate {
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:hover {
        background: #f8f8f8;
      }
    }
  }

  span {
    color: white;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    text-wrap: nowrap;
  }

  .select-dao {
    width: 50%;
    @media screen and (max-width: 768px) {
      width: 75%;
      min-width: 150px;
    }
  }
  .select-period {
    width: 150px;
  }
`;

const Check = styled.div`
  border-radius: 5px;
  width: 100%;
  max-width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${(props) => (props.selected ? "#a39acd" : "rgb(216 216 216)")};
  color: #a39acd;
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const TooltipText = styled.span`
  visibility: hidden;
  min-width: 150px;
  background-color: #ffffff;
  text-align: justify;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 120%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent white transparent;
    transform: translateX(-50%);
  }
`;

const {
  values,
  multiple,
  options,
  onChange,
  defaultValue,
  isOpen,
  onClear,
  containerClass,
  text,
  isTooltipVisible,
  hintText,
  onFilterClick,
  filterIsOpen,
  id,
} = props;

const [open, setOpen] = useState(false);
const selectOptions = defaultValue ? [defaultValue, ...options] : options;
const isOpenDropdown = !!filterIsOpen ? filterIsOpen : open;

const setTitle = () => {
  if (text) return text;

  if (Array.isArray(values)) {
    return values.length ? `${values.length} Selected` : defaultValue;
  } else {
    return values;
  }
};

const handleOpen = () => {
  if (onFilterClick) {
    onFilterClick(id);
  } else {
    setOpen(!open);
  }
};

return (
  <Select onClick={() => !multiple && handleOpen()}>
    <div className={containerClass}>
      <div className="selected" onClick={handleOpen}>
        {setTitle()}
        {isTooltipVisible && (
          <Widget
            src={`/*__@replace:widgetPath__*/.Components.Tooltip`}
            props={{
              content: hintText,
              icon: <i className="bi bi-info-circle-fill" />,
            }}
          />
        )}
      </div>
      <div className="d-flex gap-2">
        {multiple && values.length > 0 && (
          <i
            className="bi bi-x fs-5 mt-1 mr-1"
            onClick={() => onClear() && setOpen(false)}
          />
        )}
        <i
          onClick={handleOpen}
          className={`bi bi-chevron-${
            isOpenDropdown ? "up" : "down"
          } fs-5 mt-1`}
        />
      </div>
    </div>
    {isOpenDropdown && (
      <ul>
        {selectOptions.map((option) => (
          <li onClick={() => onChange(option)}>
            {multiple && (
              <Check selected={values.includes(option)}>
                {values.includes(option) && (
                  <i className="mt-1 bi bi-check-lg" />
                )}
              </Check>
            )}
            <div className="truncate">{option}</div>
          </li>
        ))}
      </ul>
    )}
  </Select>
);
