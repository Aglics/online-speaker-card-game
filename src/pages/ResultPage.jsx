import { motion } from "framer-motion";

export default function ResultPage({ videoURL, videoMetadata, activePrompts, onRestart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Coaching Report
          </h1>
          <p className="text-gray-400 text-base mt-1">
            Review your recording and performance insights.
          </p>
        </div>

        <button onClick={onRestart} className="btn-primary">
          New Practice Session
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Video */}
        <div className="col-span-7 surface-card shadow-soft p-6">
          <h2 className="text-sm text-slate-900 font-semibold mb-4">
            Playback
          </h2>

          <div className="video-frame">
            <video src={videoURL} controls />
          </div>

          <div className="mt-6 surface-panel p-5">
            <h3 className="card-title text-slate-900">
              Transcript
            </h3>
            {videoMetadata?.transcript ? (
              <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                {videoMetadata.transcript}
              </p>
            ) : (
              <p className="text-sm text-slate-700">
                No transcript available.
              </p>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Metrics */}
          <div className="surface-panel shadow-soft p-6">
            <h2 className="section-title mb-4 text-slate-900">
              Performance Summary
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="element-card p-4 bg-slate-50 border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900">135</div>
                <div className="text-xs text-slate-600 mt-1">WPM</div>
              </div>

              <div className="element-card p-4 bg-slate-50 border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900">4</div>
                <div className="text-xs text-slate-600 mt-1">Fillers</div>
              </div>

              <div className="element-card p-4 bg-slate-50 border-slate-100">
                <div className="text-2xl font-extrabold text-slate-900">A-</div>
                <div className="text-xs text-slate-600 mt-1">Clarity</div>
              </div>
            </div>
          </div>

          {/* Selected Cards */}
          <div className="surface-card shadow-soft p-6">
            <h2 className="section-title mb-4 text-slate-900">
              Selected Challenge Cards
            </h2>

            <div className="flex flex-col gap-3">
              {Object.entries(activePrompts || {}).length > 0 ? (
                Object.entries(activePrompts || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="element-card px-4 py-3 text-sm text-slate-800 bg-slate-50 border-slate-100"
                  >
                    <span className="text-[#ac1b14] font-bold">
                      {key.toUpperCase()}
                    </span>{" "}
                    • {val}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-700">No cards selected.</p>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="surface-card shadow-soft p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              AI Feedback (Demo)
            </h2>

            <ul className="text-sm text-slate-800 leading-relaxed space-y-2">
              <li>✅ Strong structure and clear topic progression</li>
              <li>⚠ Reduce filler words (“um”, “like”) to improve confidence</li>
              <li>💡 Try using a slower pace for key points</li>
              <li>🎯 End with a strong conclusion statement</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}