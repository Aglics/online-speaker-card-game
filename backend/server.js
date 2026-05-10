import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post("/api/process-video", upload.single("video"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const metadata = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        fieldName: req.file.fieldname,
        processingMs: 10000,
        receivedAt: new Date().toISOString(),
    };

    return res.json(metadata);
});

app.get("/api/status", (req, res) => {
    return res.json({ status: "backend running" });
});

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});
