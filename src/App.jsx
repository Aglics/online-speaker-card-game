import { useState } from "react";
import RecorderPage from "./pages/RecorderPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  const [view, setView] = useState("recorder");
  const [videoURL, setVideoURL] = useState(null);
  const [activePrompts, setActivePrompts] = useState({});

  return (
    <div className="min-h-screen bg-[#05070F] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6D28D9_0%,transparent_45%),radial-gradient(circle_at_bottom,#2563EB_0%,transparent_50%)] opacity-40 blur-2xl" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[280px] border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col">
          <div className="text-2xl font-extrabold tracking-tight">
            AI<span className="text-purple-400">Speaker Testing</span>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-sm text-gray-300">
            <div className="px-4 py-3 rounded-xl bg-white/10 border border-white/10">
              🎥 Practice Studio
            </div>
            <div className="px-4 py-3 rounded-xl hover:bg-white/10 transition cursor-pointer">
              📊 Performance
            </div>
            <div className="px-4 py-3 rounded-xl hover:bg-white/10 transition cursor-pointer">
              📁 Sessions
            </div>
            <div className="px-4 py-3 rounded-xl hover:bg-white/10 transition cursor-pointer">
              ⚙ Settings
            </div>
          </div>

          <div className="mt-auto text-xs text-gray-400">
            Demo Build • v1.0
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          {view === "recorder" && (
            <RecorderPage
              setView={setView}
              setVideoURL={setVideoURL}
              activePrompts={activePrompts}
              setActivePrompts={setActivePrompts}
            />
          )}

          {view === "result" && (
            <ResultPage
              videoURL={videoURL}
              activePrompts={activePrompts}
              onRestart={() => setView("recorder")}
            />
          )}
        </main>
      </div>
    </div>
  );
}