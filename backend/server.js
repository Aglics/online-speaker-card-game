import express from "express";
import cors from "cors";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import { writeFileSync, unlinkSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf("\\"));

// Set FFmpeg and FFprobe paths
if (ffmpegStatic) {
    ffmpeg.setFfmpegPath(ffmpegStatic);
    console.log("FFmpeg path set to:", ffmpegStatic);
} else {
    console.error("FFmpeg static not found");
}

if (ffprobeStatic) {
    ffmpeg.setFfprobePath(ffprobeStatic.path);
    console.log("FFprobe path set to:", ffprobeStatic.path);
} else {
    console.error("FFprobe static not found");
}

const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

function getAudioDurationFromBuffer(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error("ffprobe error:", err.message);
                reject(err);
            } else if (metadata && metadata.format && metadata.format.duration) {
                resolve(metadata.format.duration);
            } else {
                reject(new Error("Cannot determine audio duration from metadata"));
            }
        });
    });
}

app.post("/api/process-video", upload.single("video"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
    }

    const videoPath = join(__dirname, `temp_video_${Date.now()}.webm`);
    const audioPath = join(__dirname, `temp_audio_${Date.now()}.mp3`);
    let conversionStartTime = Date.now();

    console.log("Starting video processing...");
    console.log("Video file:", req.file.originalname, "Size:", req.file.size, "bytes");
    console.log("Video path:", videoPath);
    console.log("Audio path:", audioPath);

    try {
        // Write video file to disk
        writeFileSync(videoPath, req.file.buffer);
        console.log("Video file written to disk successfully");

        // Convert video to audio using FFmpeg
        await new Promise((resolve, reject) => {
            console.log("Starting FFmpeg conversion...");

            ffmpeg(videoPath)
                .noVideo() // Remove video stream
                .audioCodec("libmp3lame")
                .audioBitrate("128k")
                .audioChannels(2)
                .audioFrequency(44100)
                .format("mp3")
                .on("start", (commandLine) => {
                    console.log("FFmpeg command:", commandLine);
                })
                .on("progress", (progress) => {
                    console.log("Progress:", Math.round(progress.percent || 0) + "%");
                })
                .on("end", () => {
                    console.log("FFmpeg conversion completed successfully");
                    resolve();
                })
                .on("error", (err, stdout, stderr) => {
                    console.error("FFmpeg conversion error:", err.message);
                    if (stdout) console.error("stdout:", stdout);
                    if (stderr) console.error("stderr:", stderr);
                    reject(new Error("FFmpeg conversion failed: " + err.message));
                })
                .save(audioPath);
        });

        console.log("Reading audio file...");
        const audioStats = statSync(audioPath);
        const audioSize = audioStats.size;
        console.log("Audio file size:", audioSize, "bytes");

        // Get audio duration
        console.log("Getting audio duration...");
        const duration = await getAudioDurationFromBuffer(audioPath);
        const conversionTime = Date.now() - conversionStartTime;

        console.log("Audio duration:", duration, "seconds");
        console.log("Conversion time:", conversionTime, "ms");

        // Clean up temporary files
        try {
            unlinkSync(videoPath);
            console.log("Cleaned up video file");
        } catch (e) {
            console.log("Could not delete video file:", e.message);
        }

        try {
            unlinkSync(audioPath);
            console.log("Cleaned up audio file");
        } catch (e) {
            console.log("Could not delete audio file:", e.message);
        }

        const metadata = {
            videoInfo: {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
            },
            audioInfo: {
                format: "mp3",
                codec: "mp3",
                bitrate: 128,
                sampleRate: 44100,
                channels: 2,
                duration: Number(duration.toFixed(2)),
                size: audioSize,
            },
            processingMs: conversionTime,
            receivedAt: new Date().toISOString(),
        };

        console.log("Returning metadata:", JSON.stringify(metadata, null, 2));
        return res.json(metadata);
    } catch (err) {
        console.error("Error processing video:", err.message);
        console.error("Stack trace:", err.stack);

        try {
            unlinkSync(videoPath);
        } catch {
            console.log("Could not clean up video file");
        }
        try {
            unlinkSync(audioPath);
        } catch {
            console.log("Could not clean up audio file");
        }

        return res.status(500).json({
            error: "Video processing failed: " + err.message,
            details: err.stack
        });
    }
});

app.get("/api/status", (req, res) => {
    return res.json({ status: "backend running" });
});

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});
