import { motion } from "framer-motion";

export default function ResultPage({ videoURL, activePrompts, onRestart }) {
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
          <p className="text-gray-400 text-sm mt-1">
            Review your recording and performance insights.
          </p>
        </div>

        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition shadow-lg"
        >
          New Practice Session
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Video */}
        <div className="col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <h2 className="text-sm text-gray-300 font-semibold mb-4">
            Playback
          </h2>

          <div className="rounded-2xl overflow-hidden bg-black border border-white/10">
            <video
              src={videoURL}
              controls
              className="w-full h-[360px] object-cover"
            />
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Transcript (Demo)
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Today we discussed{" "}
              <span className="text-white font-semibold">
                {activePrompts.security || "Security"}
              </span>{" "}
              and how it connects with{" "}
              <span className="text-white font-semibold">
                {activePrompts.ai || "AI development"}
              </span>
              . I explained the importance of clear communication and structured
              responses.
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Metrics */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-gray-200 mb-4">
              Performance Summary
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-white">135</div>
                <div className="text-xs text-gray-400 mt-1">WPM</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-white">4</div>
                <div className="text-xs text-gray-400 mt-1">Fillers</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-extrabold text-white">A-</div>
                <div className="text-xs text-gray-400 mt-1">Clarity</div>
              </div>
            </div>
          </div>

          {/* Selected Cards */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-sm text-gray-300 font-semibold mb-4">
              Selected Challenge Cards
            </h2>

            <div className="flex flex-col gap-3">
              {Object.entries(activePrompts || {}).length > 0 ? (
                Object.entries(activePrompts || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200"
                  >
                    <span className="text-purple-300 font-bold">
                      {key.toUpperCase()}
                    </span>{" "}
                    • {val}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No cards selected.</p>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-sm text-gray-300 font-semibold mb-3">
              AI Feedback (Demo)
            </h2>

            <ul className="text-sm text-gray-300 leading-relaxed space-y-2">
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