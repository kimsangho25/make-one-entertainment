import express from 'express';

const router = express.Router();

const required = (v) => v !== undefined && v !== null && String(v).trim() !== '';


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
        console.log('[CONTACT]', {
        company, contactName, eventName, phone, eventDate, expectedParticipants, budgetRange, requirements
        });

        // (선택) 문자/이메일 발송 연동 위치
        // await sendSms(...);
        // await sendEmail(...);

        return res.json({ ok: true });
  } catch (e) {
    console.error('contact_error', e);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

export default router;

