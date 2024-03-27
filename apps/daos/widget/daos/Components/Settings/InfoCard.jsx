const { selectedDao, section, key, daoContent, setDaoContent } = props;

const [link, setLink] = useState("");

return (
  <div className="w-100 d-flex flex-column bg-light p-4 rounded">
    <div className="form-element">
      <label className="form-label">Description</label>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.MarkdownEditor`}
        props={{
          element: { value: daoContent[section][key]?.description ?? "" },
          handleChange: (_element, value) => {
            daoContent[section][key] = daoContent[section][key] ?? {};
            daoContent[section][key].description = value;
            setDaoContent(daoContent);
          },
        }}
      />
    </div>
    <div className="form-element">
      <label className="form-label">Referrence Link</label>
      <input
        className="form-control"
        type="text"
        value={daoContent[section][key]?.href ?? link}
        onChange={(e) => {
          daoContent[section][key] = daoContent[section][key] ?? {};
          daoContent[section][key].href = e.target.value;
          setLink(e.target.value);
          setDaoContent(daoContent);
        }}
      />
    </div>
  </div>
);
