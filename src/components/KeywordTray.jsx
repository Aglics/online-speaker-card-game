export default function KeywordTray({ activePrompts }) {
  return (
    <div className="keyword-tray">
      {Object.entries(activePrompts || {}).map(([k, v]) => (
        <span key={k} className="keyword-tag">
          {v}
        </span>
      ))}
    </div>
  );
}