export default function KeywordTray({ activePrompts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(activePrompts || {}).map(([k, v]) => (
        <span
          key={k}
          className="text-BASE px-3 py-1 bg-white/10 rounded-full border border-white/10 text-gray-300"
        >
          {v}
        </span>
      ))}
    </div>
  );
}