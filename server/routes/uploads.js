import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

//저장 폴더 보장
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// 파일명 : 타임스탬프-원본명
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOAD_DIR),
    filename: (_, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}-${safe}`);
    },
});

const upload = multer({ storage });

// 파일 업로드 엔드포인트
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ ok:false, error:'no_file' });

    //개발
    const publicBase = 'http://localhost:8765';
    const file_url = `${publicBase}/uploads/${req.file.filename}`;
    return res.json({ ok: true, file_url });
});

export default router;