const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

const Select = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;

  ul {
    width: 100%;
    max-height: 12.6rem;
    overflow-y: scroll;
    background: #fff;
    color: initial;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40px;
    z-index: 100;
    padding: 0;

    a {
      font-weight: 400;
      font-size: 1rem;
      display: flex;
      align-items: center;
      padding: 0.3rem 1rem;

      .truncate {
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:hover {
        text-decoration: none;
        background: rgb(163 155 205 / 20%);
      }
    }
  }
`;

const { value, options } = props;
const [open, setOpen] = useState(false);

const handleOpen = () => setOpen(!open);

return (
  <Select onClick={() => handleOpen()}>
    <div className="d-flex justify-content-between align-items-center form-control">
      <div onClick={handleOpen}>{value}</div>
      <div className="d-flex gap-2">
        <i
          onClick={handleOpen}
          className={`ph ph-caret-${open ? "up" : "down"}`}
        />
      </div>
    </div>
    {open && (
      <ul>
        {options.map(([handle, title]) => (
          <a
            className="form-element"
            href={`//*__@replace:widgetPath__*/.App?page=settings&dao=${handle}`}
          >
            {title}
          </a>
        ))}
      </ul>
    )}
  </Select>
);
