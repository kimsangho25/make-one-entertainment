import express from "express"
import { getObjectStream } from '../ncpS3.js';

const router = express.Router();

// GET /api/files?key=uploads/2026/01/xxx.jpg
router.get("/", async (req, res) => {
    const key = req.query.key ? String(req.query.key) : "";
    if (!key) return res.status(400).json({ ok: false, error: "missing_key" });

    try {
        const obj = await getObjectStream(key);

        res.setHeader("Content-Type", obj.ContentType || "application/octet-stream");
        res.setHeader("Cache-Control", "private, max-age=86400");

        // obj.Body 는 Readable Stream
        obj.Body.pipe(res);
    } catch (e) {
        console.error(e);
        return res.status(404).json({ ok: false, error: "not_found" });
    }
});

export default router;