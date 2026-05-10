import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PromptCard from "../components/PromptCard.jsx";
import KeywordTray from "../components/KeywordTray.jsx";
import { words } from "../utils/words.js";

export default function RecorderPage({
  setView,
  setVideoURL,
  activePrompts,
  setActivePrompts,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera permission denied. Please allow camera + mic.");
        console.error("Camera error:", err);
      }
    }

    setupCamera();
  }, []);

  useEffect(() => {
    let timer;

    if (recording) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 120) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [recording]);

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function drawPrompt(category) {
    const list = words[category];
    const newWord = list[Math.floor(Math.random() * list.length)];
    setActivePrompts((prev) => ({ ...prev, [category]: newWord }));
  }

  function startRecording() {
    if (!streamRef.current) return;

    chunksRef.current = [];

    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      setView("result");
    };

    recorder.start();
    setSeconds(0);
    setRecording(true);
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Practice Studio
          </h1>
          <p className="text-gray-400 text-base mt-1">
            Record your response and get AI coaching feedback instantly.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
            Session: <span className="text-white font-semibold">#AIO-001</span>
          </div>

          <div
            className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
              recording
                ? "bg-red-500/15 border-red-500/40 text-red-300"
                : "bg-white/5 border-white/10 text-gray-300"
            }`}
          >
            {recording ? "● Recording" : "Idle"}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Video Section */}
        <div className="col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-gray-300 font-semibold">
              Live Camera Feed
            </h2>
            <div className="text-gray-400 text-sm font-mono">
              {formatTime(seconds)}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {recording && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold animate-pulse">
                ● LIVE
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-gray-400 text-sm">
              Maximum recording:{" "}
              <span className="text-white font-semibold">2 minutes</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startRecording}
                disabled={recording}
                className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition shadow-lg disabled:opacity-40"
              >
                Start Recording
              </button>

              <button
                onClick={stopRecording}
                disabled={!recording}
                className="px-6 py-3 rounded-xl font-bold bg-white/10 border border-white/10 hover:bg-white/20 transition disabled:opacity-40"
              >
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Cards */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-base text-gray-300 font-semibold mb-4">
              Challenge Cards
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <PromptCard
                label="Mic_Check_Cards"
                value={activePrompts.Mic_Check_Cards}
                onClick={() => drawPrompt("Mic_Check_Cards")}
              />
              <PromptCard
                label="Challenge_Cards"
                value={activePrompts.Challenge_Cards}
                onClick={() => drawPrompt("Challenge_Cards")}
              />
              <PromptCard
                label="Sponsored_By_Cards"
                value={activePrompts.Sponsored_By_Cards}
                onClick={() => drawPrompt("Sponsored_By_Cards")}
              />
              <PromptCard
                label="Script_Cards"
                value={activePrompts.Script_Cards}
                onClick={() => drawPrompt("Script_Cards")}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-BASE text-gray-300 font-semibold mb-3">
              Active Keywords
            </h2>

            <KeywordTray activePrompts={activePrompts} />
          </div>

          {/* AI Guidance */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-gray-200 mb-2">
              AI Tip
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Speak clearly, keep eye contact with the camera, and use keywords
              naturally. Avoid filler words like “um” and “like”.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}