import express from 'express';
import fs from 'fs';
import path from 'path';
import { sendToAdmins } from './sms.js'

const router = express.Router();

const required = (v) => v !== undefined && v !== null && String(v).trim() !== '';

/** server/log/contact_logs.csv 경로 준비 */
const LOG_DIR  = path.resolve(process.cwd(), 'log');
const LOG_FILE = path.join(LOG_DIR, 'contact_logs.csv');

/** CSV 안전 변환 */
function toCsvField(v) {
  const s = (v ?? '').toString().replace(/\r?\n/g, ' ').trim();
  if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
function appendCsv(rowObj) {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  const headers = [
    'ts','ip','company','contactName','eventName','phone',
    'eventDate','expectedParticipants','budgetRange','requirements',
    'smsRequestId','smsStatusCode','smsStatusName'
  ];
  const exists = fs.existsSync(LOG_FILE);
  const row = headers.map(h => toCsvField(rowObj[h] ?? '')).join(',');
  if (!exists) fs.writeFileSync(LOG_FILE, headers.join(',') + '\n', 'utf8');
  fs.appendFileSync(LOG_FILE, row + '\n', 'utf8');
}

//문의 접수 엔드포인트
router.post('/', async (req, res) => {
    try {
        const {
          company,
          contactName,
          eventName,
          phone,
          eventDate,
          expectedParticipants,
          budgetRange,
          requirements
        } = req.body || {};

        // 필수값 검증
        if (!required(company) || !required(contactName) || !required(eventName) || !required(phone)) {
        return res.status(400).json({ ok: false, error: 'missing_required_fields' });
        }

        // (선택) DB 저장/로그
        // console.log('[CONTACT]', {
        //   company, contactName, eventName, phone, eventDate, expectedParticipants, budgetRange, requirements
        // });

        const summary =
          `[문의]
          단체명: ${company}
          담당자명: ${contactName}
          행사명: ${eventName}
          연락처: ${phone}
          행사날짜: ${eventDate || '-'}
          예상인원: ${expectedParticipants || '-'}
          예산범위: ${budgetRange || '-'}
          요청사항: ${requirements || '-'}`;

        let sms = null, smsReqId = '', smsStatusCode = '', smsStatusName = '';
        try {
          sms = await sendToAdmins(summary, { subject: '문의 알림' });
          smsReqId = sms?.requestId || '';
          smsStatusCode = sms?.statusCode || '';
          smsStatusName = sms?.statusName || '';
        } catch (e) {
          // 실패해도 CSV에 남기고, 클라이언트에는 에러 반환
          appendCsv({
            ts: new Date().toISOString(),
            ip: req.ip,
            company, contactName, eventName, phone, eventDate, expectedParticipants, budgetRange, requirements,
            smsRequestId: '',
            smsStatusCode: `ERR:${e.message}`,
            smsStatusName: (e.data && JSON.stringify(e.data)) || '',
          });
          return res.status(502).json({ ok: false, error: 'sms_failed', detail: e.data || e.message });
        }

        // CSV 로그 저장
        appendCsv({
          ts: new Date().toISOString(),
          ip: req.ip,
          company, contactName, eventName, phone, eventDate, expectedParticipants, budgetRange, requirements,
          smsRequestId: smsReqId,
          smsStatusCode: smsStatusCode,
          smsStatusName: smsStatusName,
        });

        return res.json({ ok: true, sms });
      } catch (e) {
        console.error('contact_error', e);
        return res.status(500).json({ ok: false, error: 'server_error' });
      }
});

export default router;

