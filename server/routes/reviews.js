import express from 'express';
import { pool } from '../db.js';
import { ipHash } from '../utils/ipHash.js';
import { mapSort, parsePaging } from '../utils/listing.js';

const router = express.Router();

// 헬퍼: 안전 파싱
const toStrArr = (v) => Array.isArray(v) ? v.map(String) : (v ? [String(v)] : []);

// 리뷰 목록 조회
router.get('/', async (req, res) => {
    try {
        const orderBy = mapSort(req.query.sort);
        const { page, limit, offset } = parsePaging(req.query);

        const totalQ = await pool.query('SELECT COUNT(*)::int AS total FROM moe.reviews WHERE status = $1', ['published']);
        const listQ  = await pool.query(
        `SELECT id, author, rating, content, event_type AS "eventType",
                event_date AS "eventDate", image_urls, likes_count, reports_count,
                created_at, updated_at
            FROM moe.reviews
            WHERE status = $1
            ORDER BY ${orderBy}
            LIMIT $2 OFFSET $3`, ['published', limit, offset]
        );
        res.json({ items: listQ.rows, page, limit, total: totalQ.rows[0].total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok:false, error:'server_error' });
    }
});

// 리뷰 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const q = await pool.query(
      `SELECT id, author, rating, content, event_type AS "eventType",
              event_date AS "eventDate", image_urls, likes_count, reports_count,
              created_at, updated_at
         FROM moe.reviews WHERE id = $1`, [req.params.id]
    );
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// 생성(익명)
router.post('/', async (req, res) => {
  try {
    const { author, rating, content, eventType, eventDate, image_urls } = req.body || {};
    if (!author || !rating || !content) return res.status(400).json({ ok:false, error:'missing_required_fields' });
    if (Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ ok:false, error:'invalid_rating' });

    const imgs = toStrArr(image_urls).slice(0, 5);
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const ua = req.headers['user-agent'] || '';
    const iphash = ipHash(ip);

    const q = await pool.query(
      `INSERT INTO moe.reviews(author, rating, content, event_type, event_date, image_urls, created_ip_hash, created_ua)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [author, Number(rating), content, eventType || null, eventDate || null, imgs, iphash, ua]
    );

    res.status(201).json({ ok:true, id: q.rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

// (옵션) 수정/삭제는 운영자만 쓸 거면 나중에 보호 추가
router.put('/:id', async (req, res) => {
  try {
    const { author, rating, content, eventType, eventDate, image_urls, status } = req.body || {};
    const imgs = image_urls ? toStrArr(image_urls).slice(0,5) : undefined;

    const fields = [];
    const vals = [];
    let i = 1;

    if (author !== undefined) { fields.push(`author = $${i++}`); vals.push(author); }
    if (rating !== undefined) { 
      if (Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ ok:false, error:'invalid_rating' });
      fields.push(`rating = $${i++}`); vals.push(Number(rating));
    }
    if (content !== undefined) { fields.push(`content = $${i++}`); vals.push(content); }
    if (eventType !== undefined) { fields.push(`event_type = $${i++}`); vals.push(eventType || null); }
    if (eventDate !== undefined) { fields.push(`event_date = $${i++}`); vals.push(eventDate || null); }
    if (imgs !== undefined) { fields.push(`image_urls = $${i++}`); vals.push(imgs); }
    if (status !== undefined) { fields.push(`status = $${i++}`); vals.push(status); }

    if (!fields.length) return res.json({ ok:true });

    vals.push(req.params.id);
    const q = await pool.query(`UPDATE moe.reviews SET ${fields.join(', ')} WHERE id = $${i}`, vals);
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const q = await pool.query('DELETE FROM moe.reviews WHERE id = $1', [req.params.id]);
    if (!q.rowCount) return res.status(404).json({ ok:false, error:'not_found' });
    res.json({ ok:true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error:'server_error' });
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