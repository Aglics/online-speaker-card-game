import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PromptCard from "../components/PromptCard.jsx";
import KeywordTray from "../components/KeywordTray.jsx";
import { words } from "../utils/words.js";

export default function RecorderPage({
  setView,
  setVideoURL,
  setVideoMetadata,
  activePrompts,
  setActivePrompts,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

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

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const metadata = await uploadVideo(blob);

      if (metadata) {
        setVideoMetadata(metadata);
        setVideoURL(url);
        setView("result");
      }
    };

    recorder.start();
    setSeconds(0);
    setRecording(true);
  }

  async function uploadVideo(blob) {
    setProcessing(true);

    const formData = new FormData();
    formData.append("video", blob, "recording.webm");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

      const response = await fetch("/api/process-video", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Upload error:", err);
      if (err.name === "AbortError") {
        alert("Request timeout. Please check your internet connection and try again.");
      } else {
        alert("Video upload failed: " + err.message);
      }
      return null;
    } finally {
      setProcessing(false);
    }
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
            Improvise based on cards you flip, record your performance and get AI feedback instantly.
          </p>
        </div>

        <div
          className={`px-4 py-3 rounded-xl border text-sm font-semibold ${recording
            ? "bg-[#ac1b14] border-[#ac1b14] text-white"
            : "bg-slate-100 border-slate-200 text-slate-900"
            }`}
        >
          {recording ? "● Recording" : "● Idle"}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Video + Keywords */}
        <div className="col-span-7 flex flex-col gap-6">
          {/* Video Card */}
          <div className="surface-card shadow-soft p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-slate-900 font-semibold">
                Live Camera Feed
              </h2>
              <div className="text-slate-700 text-sm font-mono">
                {formatTime(seconds)}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-200">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {recording && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ac1b14] border border-[#ac1b14] text-white text-xs font-bold animate-pulse">
                  ● LIVE
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-slate-700 text-sm">
                Maximum recording:{" "}
                <span className="text-slate-900 font-semibold">2 minutes</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startRecording}
                  disabled={recording || processing}
                  className="btn-primary disabled:opacity-40"
                >
                  Start Recording
                </button>

                <button
                  onClick={stopRecording}
                  disabled={!recording || processing}
                  className="btn-secondary disabled:opacity-40"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="surface-card shadow-soft p-6">
            <h2 className="section-title mb-4 text-slate-900">
              Active Keywords
            </h2>

            <KeywordTray activePrompts={activePrompts} />
          </div>
        </div>

        {/* Right: Prompt Cards + Tip */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Cards */}
          <div className="surface-card shadow-soft p-6">
            <h2 className="section-title mb-4 text-slate-900">
              Prompt Cards
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


          {/* AI Guidance */}
          <div className="surface-card shadow-soft p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Professional Tip
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Speak clearly, keep eye contact with the camera, and use keywords
              naturally. Avoid filler words like "um" and "like".
            </p>
          </div>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-slate-950/95 p-8 text-center shadow-2xl">
            <div className="text-xl font-bold text-white mb-3">Processing your video</div>
            <p className="text-gray-300 mb-6">
              Uploading the recording and transcribing the audio in the background.
              Please wait while we processes your speech.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-200">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              Processing...
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}