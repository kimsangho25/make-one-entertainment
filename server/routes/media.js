// server/routes/media.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// -------- 유틸 --------
const required = (v) => (typeof v === 'string' ? v.trim().length > 0 : v !== undefined && v !== null);
const toStrArr = (v) =>
  Array.isArray(v) ? v.map(String).filter(Boolean)
  : typeof v === 'string' && v.trim() ? [v.trim()]
  : [];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function parsePaging(q) {
  const page = clamp(parseInt(q.page ?? '1', 10) || 1, 1, 100000);
  const limit = clamp(parseInt(q.limit ?? '20', 10) || 20, 1, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function youtubeIdFromUrl(url='') {
  // youtu.be/xxx, youtube.com/watch?v=xxx, /embed/xxx 지원
  const m =
    url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
    url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
    url.match(/\/embed\/([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
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

function mapSort(sort) {
  const DEFAULT = `display_order DESC, event_date DESC NULLS LAST, created_at DESC`;
  if (!sort) return DEFAULT;
  const allow = new Set(['display_order','event_date','created_at','title']);
  const parts = String(sort).split(',').map(s => s.trim()).filter(Boolean);
  const mapped = parts.map(p => {
    const desc = p.startsWith('-');
    const col = desc ? p.slice(1) : p;
    if (!allow.has(col)) return null;
    const dir = desc ? 'DESC' : 'ASC';
    if (col === 'event_date') return `event_date ${dir} NULLS LAST`;
    return `${col} ${dir}`;
  }).filter(Boolean);
  return mapped.length ? mapped.join(', ') : DEFAULT;
}

// ---------------- 목록 ----------------
router.get('/', async (req, res) => {
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

    const whereSql = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';

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

    const items = listQ.rows.map(r => ({ ...r, thumbnailUrl: deriveThumb(r) }));
    res.json({ items, page, limit, total: totalQ.rows[0].total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// ---------------- 단건 ----------------
router.get('/:id', async (req, res) => {
  try {
    const q = await pool.query(
      `SELECT id, title, description, category,
              event_date AS "eventDate",
              media_type AS "mediaType",
              media_url  AS "mediaUrl",
              image_urls AS "imageUrls",
              created_at AS "createdAt",
              updated_at AS "updatedAt",
              display_order AS "displayOrder"
         FROM moe.media WHERE id = $1`,
      [req.params.id]
    );
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    const row = q.rows[0];
    res.json({ ...row, thumbnailUrl: deriveThumb(row) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// ---------------- 생성 (비보호) ----------------
// 프론트가 보낼 수 있는 바디(둘 다 허용):
// { title, category, event_date|eventDate, media_type|mediaType, file_url|fileUrl, youtube_url|youtubeUrl,
//   image_urls|imageUrls, description, display_order|displayOrder, mime_type, file_size, duration }
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const title       = body.title;
    const description = body.description ?? null;
    const category    = body.category;

    // 두 표기 다 수용
    const eventDate   = body.event_date ?? body.eventDate ?? null;
    const mediaType   = body.media_type ?? body.mediaType;
    const fileUrl     = body.file_url   ?? body.fileUrl   ?? null;
    const youtubeUrl  = body.youtube_url?? body.youtubeUrl?? null;
    const displayOrder= body.display_order ?? body.displayOrder ?? 0;

    // 이미지 URLs (여러 장)
    let imageUrls     = body.image_urls ?? body.imageUrls ?? null;
    imageUrls = imageUrls != null ? toStrArr(imageUrls).slice(0, 10) : null;

    if (!required(title) || !required(category) || !required(mediaType)) {
      return res.status(400).json({ ok:false, error:'missing_required_fields' });
    }
    if (!['image','video'].includes(mediaType)) {
      return res.status(400).json({ ok:false, error:'invalid_media_type' });
    }

    // 정규화:
    // image: image_urls가 비어있고 file_url이 있으면 image_urls = [file_url]
    // video: media_url = youtube_url || file_url (둘 중 하나 필수)
    let mediaUrl = null;

    if (mediaType === 'image') {
      if ((!imageUrls || imageUrls.length === 0) && required(fileUrl)) {
        imageUrls = [String(fileUrl)];
      }
      if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ ok:false, error:'image_urls_required' });
      }
    } else {
      mediaUrl = youtubeUrl || fileUrl || null;
      if (!required(mediaUrl)) {
        return res.status(400).json({ ok:false, error:'media_url_required' });
      }
      imageUrls = null; // video는 별도 이미지 배열 없음(썸네일은 추후)
    }

    const q = await pool.query(
      `INSERT INTO moe.media
         (title, description, category, event_date, media_type, media_url, image_urls, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        title,
        description,
        category,
        eventDate || null,
        mediaType,
        mediaUrl,
        imageUrls,
        Number(displayOrder) || 0
      ]
    );

    res.status(201).json({ ok:true, id: q.rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// ---------------- 수정 (비보호) ----------------
router.put('/:id', async (req, res) => {
  try {
    const b = req.body || {};

    const patch = {
      title:        b.title,
      description:  b.description,
      category:     b.category,
      eventDate:    b.event_date ?? b.eventDate,
      mediaType:    b.media_type ?? b.mediaType,
      mediaUrlRaw:  (b.media_url ?? b.mediaUrl ?? b.youtube_url ?? b.youtubeUrl ?? b.file_url ?? b.fileUrl),
      imageUrlsRaw: b.image_urls ?? b.imageUrls,
      displayOrder: b.display_order ?? b.displayOrder
    };

    const fields = [];
    const vals = [];
    let i = 1;

    if (patch.title !== undefined)       { fields.push(`title = $${i++}`);       vals.push(patch.title); }
    if (patch.description !== undefined) { fields.push(`description = $${i++}`); vals.push(patch.description || null); }
    if (patch.category !== undefined)    { fields.push(`category = $${i++}`);    vals.push(patch.category); }
    if (patch.eventDate !== undefined)   { fields.push(`event_date = $${i++}`);  vals.push(patch.eventDate || null); }
    if (patch.mediaType !== undefined) {
      if (!['image','video'].includes(patch.mediaType)) {
        return res.status(400).json({ ok:false, error:'invalid_media_type' });
      }
      fields.push(`media_type = $${i++}`); vals.push(patch.mediaType);
      // 타입 바뀌면 서로 상충 필드 정리해줘야 하지만, 여기선 클라이언트가 맞게 보내는 전제
    }
    if (patch.imageUrlsRaw !== undefined) {
      const imgs = toStrArr(patch.imageUrlsRaw).slice(0, 10);
      fields.push(`image_urls = $${i++}`); vals.push(imgs.length ? imgs : null);
    }
    if (patch.mediaUrlRaw !== undefined) {
      fields.push(`media_url = $${i++}`); vals.push(required(patch.mediaUrlRaw) ? String(patch.mediaUrlRaw) : null);
    }
    if (patch.displayOrder !== undefined) {
      fields.push(`display_order = $${i++}`); vals.push(Number(patch.displayOrder) || 0);
    }

    // 항상 updated_at 갱신
    fields.push(`updated_at = now()`);

    if (!fields.length) return res.json({ ok:true });

    vals.push(req.params.id);
    const q = await pool.query(`UPDATE moe.media SET ${fields.join(', ')} WHERE id = $${i}`, vals);
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// ---------------- 삭제 (비보호) ----------------
router.delete('/:id', async (req, res) => {
  try {
    const q = await pool.query(`DELETE FROM moe.media WHERE id = $1`, [req.params.id]);
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

export default router;