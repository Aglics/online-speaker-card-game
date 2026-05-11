import { useState } from "react";
import RecorderPage from "./pages/RecorderPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  const [view, setView] = useState("recorder");
  const [videoURL, setVideoURL] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [activePrompts, setActivePrompts] = useState({});

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(172,27,20,0.12)_0%,transparent_40%),radial-gradient(circle_at_bottom,rgba(16,24,40,0.06)_0%,transparent_60%)] opacity-70" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="sidebar-panel shadow-soft">
          <div className="text-2xl font-extrabold tracking-tight">
            AI<span className="text-[#ac1b14]">Speaker Testing</span>
          </div>

          <div className="mt-8 flex flex-col gap-2 text-sm">
            <div className="sidebar-link active">🎥 Practice Studio</div>
            <div className="sidebar-link">📊 Performance</div>
            <div className="sidebar-link">📁 Sessions</div>
            <div className="sidebar-link">⚙ Settings</div>
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
              setVideoMetadata={setVideoMetadata}
              activePrompts={activePrompts}
              setActivePrompts={setActivePrompts}
            />
          )}

          {view === "result" && (
            <ResultPage
              videoURL={videoURL}
              videoMetadata={videoMetadata}
              activePrompts={activePrompts}
              onRestart={() => {
                setView("recorder");
                setVideoURL(null);
                setVideoMetadata(null);
                setActivePrompts({});
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}