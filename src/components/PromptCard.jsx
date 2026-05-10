export default function PromptCard({ label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/5 hover:bg-white/10 transition rounded-xl p-3 border border-white/10"
    >
      <div className="text-[20px] text-gray-400">{label}</div>
      <div className="text-LG font-semibold mt-1">
        {value || "Click to generate"}
      </div>
    </div>
  );
}