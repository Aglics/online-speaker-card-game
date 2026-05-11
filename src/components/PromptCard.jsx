export default function PromptCard({ label, value, onClick }) {
  return (
    <div onClick={onClick} className="prompt-card">
      <div className="prompt-card-label">{label}</div>
      <div className="prompt-card-value">
        {value || "Click to reveal"}
      </div>
    </div>
  );
}