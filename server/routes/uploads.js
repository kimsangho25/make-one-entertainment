import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from "crypto";
import { putBuffer, deleteByKey } from "../ncpS3.js";
import fs from 'fs';

const router = express.Router();

//저장 폴더 보장
// const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// 파일명 : 타임스탬프-원본명
// const storage = multer.diskStorage({
//     destination: (_, __, cb) => cb(null, UPLOAD_DIR),
//     filename: (_, file, cb) => {
//         const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
//         cb(null, `${Date.now()}-${safe}`);
//     },
// });

// 로컬 저장 X, 메모리로 받기
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// key -> 프론트가 바로 쓸 수 있는 프록시 URL
function fileProxyUrl(key) {
    return `/api/files?key=${encodeURIComponent(key)}`;
}

// 파일 업로드 엔드포인트
router.post("/", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ ok: false, error: "no_file" });
  
      const original = req.file.originalname || "file";
      const safeName = original.replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = path.extname(safeName).toLowerCase();
      const safeExt = ext && ext.length <= 10 ? ext : "";
  
      const now = new Date();
      const y = String(now.getFullYear());
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const rand = crypto.randomBytes(4).toString("hex");
  
      const key = `uploads/${y}/${m}/${Date.now()}-${rand}${safeExt}`;
  
      await putBuffer({
        key,
        body: req.file.buffer,
        contentType: req.file.mimetype,
      });
  
      // private-only에서도 프론트가 바로 표시 가능하게 서버 프록시 URL 제공
      return res.json({
        ok: true,
        file_key: key,              // DB 저장용 (정답)
        file_url: fileProxyUrl(key) // 프론트 미리보기용 (옵션)
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "upload_failed" });
    }
  });

// 기존 코드에서 import해서 쓰는 함수명 유지: deletePhysicalFile
// 이제는 "로컬 unlink"가 아니라 "Object Storage 삭제"
export const deletePhysicalFile = async (urlOrKey) => {
    try {
      const key = extractKey(urlOrKey);
      if (!key) return false;
  
      await deleteByKey(key);
      return true;
    } catch (err) {
      console.error(`파일 삭제 중 오류: ${err.message}`);
      return false;
    }
  };
  
  // /api/files?key=... 형태나 key 자체를 받아서 key로 변환
  function extractKey(v) {
    if (!v) return null;
    const s = String(v);
  
    // 이미 key면 그대로
    if (s.startsWith("uploads/")) return s;
  
    // 상대 URL(/api/files?key=...) 처리
    if (s.startsWith("/api/files")) {
      try {
        const u = new URL("http://dummy" + s);
        return u.searchParams.get("key");
      } catch {
        return null;
      }
    }
  
    // 절대 URL 처리
    if (/^https?:\/\//i.test(s)) {
      try {
        const u = new URL(s);
        if (u.pathname.startsWith("/api/files")) return u.searchParams.get("key");
        return null;
      } catch {
        return null;
      }
    }
  
    return null;
  }
  
  export default router;