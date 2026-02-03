// server/routes/media.js
import express from 'express';
import { pool } from '../db.js';
import { deletePhysicalFile } from './uploads.js';

const router = express.Router();

// -------- 유틸 --------
const required = (v) => (typeof v === "string" ? v.trim().length > 0 : v !== undefined && v !== null);
const toStrArr = (v) =>
  Array.isArray(v) ? v.map(String).filter(Boolean)
  : typeof v === "string" && v.trim() ? [v.trim()]
  : [];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function parsePaging(q) {
  const page = clamp(parseInt(q.page ?? "1", 10) || 1, 1, 100000);
  const limit = clamp(parseInt(q.limit ?? "20", 10) || 20, 1, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function youtubeIdFromUrl(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

function fileProxyUrl(key) {
  return `/api/files?key=${encodeURIComponent(key)}`;
}

// DB에 저장된 값(=key)을 프론트가 쓸 URL로 변환
function toPublicUrl(maybeKeyOrUrl, mediaTypeHint) {
  if (!maybeKeyOrUrl) return maybeKeyOrUrl;

  const s = String(maybeKeyOrUrl);

  // 유튜브는 그대로
  if (mediaTypeHint === "video") {
    const vid = youtubeIdFromUrl(s);
    if (vid) return s;
  }

  // 이미 /api/files 라우트면 그대로
  if (s.startsWith("/api/files")) return s;

  // key면 /api/files로 변환
  if (s.startsWith("uploads/")) return fileProxyUrl(s);

  // 기타 URL(과거 데이터 등)은 그대로 둠
  if (/^https?:\/\//i.test(s)) return s;

  return s;
}

// 요청 바디에 들어온 값(URL or /api/files or key)에서 "key만" 뽑기
function extractKey(v) {
  if (!v) return null;
  const s = String(v);

  if (s.startsWith("uploads/")) return s;

  if (s.startsWith("/api/files")) {
    try {
      const u = new URL("http://dummy" + s);
      return u.searchParams.get("key");
    } catch {
      return null;
    }
  }

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


function deriveThumb(row) {
  if (row.mediaType === 'image' && Array.isArray(row.imageUrls) && row.imageUrls.length) {
    return row.imageUrls[0];
  }
  if (row.mediaType === 'video' && row.mediaUrl) {
    const vid = youtubeIdFromUrl(row.mediaUrl);
    if (vid) return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  return null; // 프론트에서 플레이스홀더 처리
}

// function mapSort(sort) {
//   const DEFAULT = `display_order DESC, event_date DESC NULLS LAST, created_at DESC`;
//   if (!sort) return DEFAULT;
//   const allow = new Set(['display_order','event_date','created_at','title']);
//   const parts = String(sort).split(',').map(s => s.trim()).filter(Boolean);
//   const mapped = parts.map(p => {
//     const desc = p.startsWith('-');
//     const col = desc ? p.slice(1) : p;
//     if (!allow.has(col)) return null;
//     const dir = desc ? 'DESC' : 'ASC';
//     if (col === 'event_date') return `event_date ${dir} NULLS LAST`;
//     return `${col} ${dir}`;
//   }).filter(Boolean);
//   return mapped.length ? mapped.join(', ') : DEFAULT;
// }

function mapSort(sort) {
  const DEFAULT = "display_order ASC, event_date DESC NULLS LAST, created_at DESC";
  if (!sort) return DEFAULT;
  const s = String(sort).toLowerCase();
  const mapped = s.split(",").map(x => x.trim()).map(part => {
    if (part === "date_desc") return "event_date DESC NULLS LAST";
    if (part === "date_asc") return "event_date ASC NULLS LAST";
    if (part === "order_asc") return "display_order ASC";
    if (part === "order_desc") return "display_order DESC";
    if (part === "new") return "created_at DESC";
    return null;
  }).filter(Boolean);
  return mapped.length ? mapped.join(", ") : DEFAULT;
}

// ---------------- 목록 ----------------
router.get("/", async (req, res) => {
  try {
    const { category, type, q } = req.query;
    const { page, limit, offset } = parsePaging(req.query);
    const orderBy = mapSort(req.query.sort);

    const params = [];
    const wheres = [];

    if (required(category)) { params.push(category); wheres.push(`category = $${params.length}`); }
    if (required(type))     { params.push(type);     wheres.push(`media_type = $${params.length}`); }
    if (required(q)) {
      params.push(`%${q}%`);
      wheres.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    const whereSql = wheres.length ? `WHERE ${wheres.join(" AND ")}` : "";

    const totalQ = await pool.query(`SELECT COUNT(*)::int AS total FROM moe.media ${whereSql}`, params);
    const listQ  = await pool.query(
      `SELECT id, title, description, category,
              event_date AS "eventDate",
              media_type AS "mediaType",
              media_url  AS "mediaUrl",
              image_urls AS "imageUrls",
              created_at AS "createdAt",
              updated_at AS "updatedAt",
              display_order AS "displayOrder"
         FROM moe.media
         ${whereSql}
         ORDER BY ${orderBy}
         LIMIT $${params.length+1} OFFSET $${params.length+2}`,
      [...params, limit, offset]
    );

    const items = listQ.rows.map(r => {
      const imageUrls = Array.isArray(r.imageUrls) ? r.imageUrls.map(k => toPublicUrl(k, "image")) : r.imageUrls;
      const mediaUrl  = r.mediaUrl ? toPublicUrl(r.mediaUrl, r.mediaType) : r.mediaUrl;

      const row = { ...r, imageUrls, mediaUrl };
      return { ...row, thumbnailUrl: deriveThumb(row) };
    });

    res.json({ items, page, limit, total: totalQ.rows[0].total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// ---------------- 단건 ----------------
router.get("/:id", async (req, res) => {
  try {
    const currentId = req.params.id;

    const mainQ = await pool.query(
      `SELECT id, title, description, category,
              event_date AS "eventDate",
              media_type AS "mediaType",
              media_url  AS "mediaUrl",
              image_urls AS "imageUrls",
              created_at AS "createdAt",
              updated_at AS "updatedAt",
              display_order AS "displayOrder"
         FROM moe.media
        WHERE id = $1`,
      [currentId]
    );
    if (!mainQ.rows.length) return res.status(404).json({ ok:false, error:"not_found" });

    const base = mainQ.rows[0];
    const imageUrls = Array.isArray(base.imageUrls) ? base.imageUrls.map(k => toPublicUrl(k, "image")) : base.imageUrls;
    const mediaUrl  = base.mediaUrl ? toPublicUrl(base.mediaUrl, base.mediaType) : base.mediaUrl;

    const row = { ...base, imageUrls, mediaUrl };
    res.json({
      ...row,
      thumbnailUrl: deriveThumb(row)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// ---------------- 생성 ----------------
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const title = body.title?.trim();
    const category = body.category?.trim();
    const mediaType = body.media_type || body.mediaType;
    const description = body.description ?? null;
    const eventDate = body.event_date || body.eventDate || null;
    const displayOrder = Number.isFinite(Number(body.display_order ?? body.displayOrder))
      ? Number(body.display_order ?? body.displayOrder) : 0;

    if (!title || !category || !mediaType) return res.status(400).json({ ok:false, error:"missing_required" });

    // 여기부터 핵심: DB에는 key만 저장
    let imageUrlsIn = body.image_urls ?? body.imageUrls ?? null;
    let imageKeys = toStrArr(imageUrlsIn).map(extractKey).filter(Boolean);

    const rawMedia = body.media_url ?? body.mediaUrl ?? null;
    const youtubeUrl = rawMedia ? String(rawMedia) : null;
    const yid = youtubeUrl ? youtubeIdFromUrl(youtubeUrl) : null;

    let mediaKey = null;
    if (!yid && rawMedia) {
      mediaKey = extractKey(rawMedia);
    }

    let mediaUrlToStore = null;
    let imageUrlsToStore = null;

    if (mediaType === "image") {
      // 이미지: image_urls에 key 배열 저장
      if (imageKeys.length === 0 && rawMedia) {
        // 혹시 프론트가 media_url로 이미지 하나 보냈다면 그것도 흡수
        const k = extractKey(rawMedia);
        if (k) imageKeys = [k];
      }
      imageUrlsToStore = imageKeys.slice(0, 10);
    } else if (mediaType === "video") {
      // 비디오: 유튜브면 URL 저장, 파일이면 key 저장
      mediaUrlToStore = yid ? youtubeUrl : (mediaKey || null);
    } else {
      return res.status(400).json({ ok:false, error:"invalid_media_type" });
    }

    const q = await pool.query(
      `INSERT INTO moe.media (title, description, category, event_date, media_type, media_url, image_urls, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [title, description, category, eventDate, mediaType, mediaUrlToStore, imageUrlsToStore, displayOrder]
    );

    res.json({ ok:true, id: q.rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// ---------------- 수정 ----------------
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const fields = [];
    const params = [];
    const set = (sql, val) => { params.push(val); fields.push(`${sql} = $${params.length}`); };

    if (body.title !== undefined) set("title", String(body.title).trim());
    if (body.description !== undefined) set("description", body.description);
    if (body.category !== undefined) set("category", String(body.category).trim());
    if (body.event_date !== undefined || body.eventDate !== undefined) set("event_date", body.event_date ?? body.eventDate);
    if (body.display_order !== undefined || body.displayOrder !== undefined) set("display_order", Number(body.display_order ?? body.displayOrder) || 0);

    if (body.image_urls !== undefined || body.imageUrls !== undefined) {
      const keys = toStrArr(body.image_urls ?? body.imageUrls).map(extractKey).filter(Boolean).slice(0, 10);
      set("image_urls", keys.length ? keys : null);
    }

    if (body.media_url !== undefined || body.mediaUrl !== undefined) {
      const raw = body.media_url ?? body.mediaUrl;
      const yid = raw ? youtubeIdFromUrl(String(raw)) : null;
      if (yid) set("media_url", String(raw));
      else set("media_url", raw ? extractKey(raw) : null);
    }

    if (!fields.length) return res.json({ ok:true });

    params.push(id);
    await pool.query(`UPDATE moe.media SET ${fields.join(", ")}, updated_at = now() WHERE id = $${params.length}`, params);

    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// ---------------- 삭제 ----------------
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // 삭제 전에 파일 key들을 읽어서 Object Storage 삭제
    const q = await pool.query(
      `SELECT media_type, media_url, image_urls
         FROM moe.media
        WHERE id = $1`,
      [id]
    );
    if (!q.rows.length) return res.status(404).json({ ok:false, error:"not_found" });

    const row = q.rows[0];

    // image_urls에 key 저장되어 있음
    if (Array.isArray(row.image_urls)) {
      for (const k of row.image_urls) await deletePhysicalFile(k);
    }

    // media_url이 유튜브면 삭제 X, 파일 key면 삭제
    if (row.media_url && !youtubeIdFromUrl(String(row.media_url))) {
      await deletePhysicalFile(row.media_url);
    }

    await pool.query(`DELETE FROM moe.media WHERE id = $1`, [id]);
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

export default router;