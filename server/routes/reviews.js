import express from 'express';
import { pool } from '../db.js';
import { ipHash } from '../utils/ipHash.js';
import { mapSort, parsePaging } from '../utils/listing.js';
import { deletePhysicalFile } from './uploads.js';

const router = express.Router();

// key -> 프론트 URL
function fileProxyUrl(key) {
  return `/api/files?key=${encodeURIComponent(key)}`;
}

// body/DB 값 -> key 추출
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

const toKeyArr = (v) => {
  const arr = Array.isArray(v) ? v : (v ? [v] : []);
  return arr.map(extractKey).filter(Boolean);
};

const toPublicArr = (keys) => (Array.isArray(keys) ? keys.map(k => fileProxyUrl(String(k))) : keys);

// 헬퍼: 안전 파싱
//const toStrArr = (v) => Array.isArray(v) ? v.map(String) : (v ? [String(v)] : []);

// 리뷰 목록 조회
router.get("/", async (req, res) => {
  try {
    const orderBy = mapSort(req.query.sort);
    const { page, limit, offset } = parsePaging(req.query);

    const metaQ = await pool.query(
      `SELECT COUNT(*)::int AS total_count,
              COALESCE(AVG(rating), 0)::numeric(10, 2) AS average_rating
         FROM moe.reviews
        WHERE status = $1`,
      ["published"]
    );
    const { total_count, average_rating } = metaQ.rows[0];

    const listQ = await pool.query(
      `SELECT id, author, rating, content, event_type AS "eventType",
              event_date AS "eventDate", image_urls, likes_count, reports_count,
              created_at, updated_at
         FROM moe.reviews
        WHERE status = $1
        ORDER BY ${orderBy}
        LIMIT $2 OFFSET $3`,
      ["published", limit, offset]
    );

    const totalPages = Math.ceil(total_count / limit);

    // 응답에서만 /api/files로 변환
    const items = listQ.rows.map(r => ({
      ...r,
      image_urls: toPublicArr(r.image_urls)
    }));

    res.json({
      items,
      meta: {
        total_count,
        average_rating,
        limit,
        current_page: page,
        total_pages: totalPages
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// 단건
router.get("/:id", async (req, res) => {
  try {
    const q = await pool.query(
      `SELECT id, author, rating, content, event_type AS "eventType",
              event_date AS "eventDate", image_urls, likes_count, reports_count,
              created_at, updated_at
         FROM moe.reviews
        WHERE id = $1`,
      [req.params.id]
    );
    if (!q.rows.length) return res.status(404).json({ ok:false, error:"not_found" });

    const row = q.rows[0];
    res.json({
      ...row,
      image_urls: toPublicArr(row.image_urls)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// 생성(익명)
router.post("/", async (req, res) => {
  try {
    const { author, rating, content, eventType, eventDate, image_urls } = req.body || {};
    if (!author || !rating || !content) return res.status(400).json({ ok:false, error:"missing_required_fields" });
    if (Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ ok:false, error:"invalid_rating" });

    // DB에는 key만 저장
    const imgs = toKeyArr(image_urls).slice(0, 5);

    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.socket.remoteAddress || "";
    const ua = req.headers["user-agent"] || "";
    const iphash = ipHash(ip);

    const q = await pool.query(
      `INSERT INTO moe.reviews (author, rating, content, event_type, event_date, image_urls, status, created_ip_hash, created_ua)
       VALUES ($1,$2,$3,$4,$5,$6,'published',$7,$8)
       RETURNING id`,
      [author, Number(rating), content, eventType ?? null, eventDate ?? null, imgs.length ? imgs : null, iphash, ua]
    );

    res.json({ ok:true, id: q.rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// 수정(부분)
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const fields = [];
    const params = [];
    const set = (sql, val) => { params.push(val); fields.push(`${sql} = $${params.length}`); };

    if (body.author !== undefined) set("author", String(body.author));
    if (body.rating !== undefined) set("rating", Number(body.rating));
    if (body.content !== undefined) set("content", String(body.content));
    if (body.eventType !== undefined) set("event_type", body.eventType);
    if (body.eventDate !== undefined) set("event_date", body.eventDate);

    if (body.image_urls !== undefined) {
      const keys = toKeyArr(body.image_urls).slice(0, 5);
      set("image_urls", keys.length ? keys : null);
    }

    if (!fields.length) return res.json({ ok:true });

    params.push(id);
    await pool.query(`UPDATE moe.reviews SET ${fields.join(", ")}, updated_at = now() WHERE id = $${params.length}`, params);

    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});

// 삭제 (파일도 같이 삭제)
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const q = await pool.query(`SELECT image_urls FROM moe.reviews WHERE id = $1`, [id]);
    if (!q.rows.length) return res.status(404).json({ ok:false, error:"not_found" });

    const keys = q.rows[0].image_urls;
    if (Array.isArray(keys)) {
      for (const k of keys) await deletePhysicalFile(k);
    }

    await pool.query(`DELETE FROM moe.reviews WHERE id = $1`, [id]);
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:"server_error" });
  }
});


// 좋아요 추가 (client_id 필수)
router.post('/:id/likes', async (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) return res.status(400).json({ ok:false, error:'missing_client_id' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 리뷰 존재 확인
    const exists = await client.query('SELECT 1 FROM moe.reviews WHERE id = $1', [req.params.id]);
    if (!exists.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ ok:false, error:'not_found' }); }

    await client.query(
      `INSERT INTO moe.review_likes(review_id, client_id)
       VALUES ($1, $2)
       ON CONFLICT (review_id, client_id) DO NOTHING`,
      [req.params.id, clientId]
    );
    const cnt = await client.query(
      `UPDATE moe.reviews r
          SET likes_count = (SELECT COUNT(*) FROM moe.review_likes WHERE review_id = r.id)
        WHERE r.id = $1
      RETURNING likes_count`, [req.params.id]
    );

    await client.query('COMMIT');
    res.json({ ok:true, likes_count: cnt.rows[0].likes_count });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  } finally {
    client.release();
  }
});

// 좋아요 취소
router.delete('/:id/likes', async (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) return res.status(400).json({ ok:false, error:'missing_client_id' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const exists = await client.query('SELECT 1 FROM moe.reviews WHERE id = $1', [req.params.id]);
    if (!exists.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ ok:false, error:'not_found' }); }

    await client.query(
      `DELETE FROM moe.review_likes WHERE review_id = $1 AND client_id = $2`,
      [req.params.id, clientId]
    );
    const cnt = await client.query(
      `UPDATE moe.reviews r
          SET likes_count = (SELECT COUNT(*) FROM moe.review_likes WHERE review_id = r.id)
        WHERE r.id = $1
      RETURNING likes_count`, [req.params.id]
    );

    await client.query('COMMIT');
    res.json({ ok:true, likes_count: cnt.rows[0].likes_count });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  } finally {
    client.release();
  }
});

// 내가 좋아요한 리뷰 목록 (id 배열)
router.get('/likes/me', async (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) return res.status(400).json({ ok:false, error:'missing_client_id' });
  try {
    const q = await pool.query(`SELECT review_id FROM moe.review_likes WHERE client_id = $1`, [clientId]);
    res.json(q.rows.map(r => r.review_id));
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// 신고
router.post('/:id/reports', async (req, res) => {
  const clientId = req.header('X-Client-Id');
  if (!clientId) return res.status(400).json({ ok:false, error:'missing_client_id' });
  const { reason, details } = req.body || {};
  if (!reason) return res.status(400).json({ ok:false, error:'missing_reason' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const exists = await client.query('SELECT 1 FROM moe.reviews WHERE id = $1', [req.params.id]);
    if (!exists.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ ok:false, error:'not_found' }); }

    await client.query(
      `INSERT INTO moe.review_reports(review_id, client_id, reason, details)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (review_id, client_id)
       DO UPDATE SET reason = EXCLUDED.reason, details = EXCLUDED.details`,
      [req.params.id, clientId, reason, details || null]
    );

    const cnt = await client.query(
      `UPDATE moe.reviews r
          SET reports_count = (SELECT COUNT(*) FROM moe.review_reports WHERE review_id = r.id)
        WHERE r.id = $1
      RETURNING reports_count`, [req.params.id]
    );

    await client.query('COMMIT');
    res.json({ ok:true, reports_count: cnt.rows[0].reports_count });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  } finally {
    client.release();
  }
});

export default router;