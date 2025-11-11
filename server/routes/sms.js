import axios from 'axios';
import crypto from 'crypto';

const {
  NCP_ACCESS_KEY,
  NCP_SECRET_KEY,
  NCP_SERVICE_ID,     // ← .env와 일치
  NCP_SMS_SENDER,
  SMS_DRY_RUN,        // "true"면 실제 전송 안함
  NOTIFY_PHONES,      // "010...,010..." 형태(선택)
} = process.env;

const HOST = 'https://sens.apigw.ntruss.com';
const URI  = `/sms/v2/services/${NCP_SERVICE_ID}/messages`;
const URL  = `${HOST}${URI}`;


function assertEnv() {
  const miss = [];
  if (!NCP_ACCESS_KEY)  miss.push('NCP_ACCESS_KEY');
  if (!NCP_SECRET_KEY)  miss.push('NCP_SECRET_KEY');
  if (!NCP_SERVICE_ID)  miss.push('NCP_SERVICE_ID');
  if (!NCP_SMS_SENDER)  miss.push('NCP_SMS_SENDER');
  if (miss.length) throw new Error(`env_missing: ${miss.join(', ')}`);
}


function makeSignature({ method, uri, timestamp, accessKey, secretKey }) {
    const msg = `${method} ${uri}\n${timestamp}\n${accessKey}`;
    return crypto.createHmac('sha256', secretKey).update(msg).digest('base64');
}

const normalizePhone = s => String(s || '').replace(/\D/g, '');
const parseNotify = () =>
  String(NOTIFY_PHONES || '')
    .split(',')
    .map(v => normalizePhone(v))
    .filter(Boolean);

// 80자 넘으면 자동 LMS 전환
const decideType = (content) => {
    // 문자 수 대신 바이트 길이 기준으로 체크
    const bytes = Buffer.byteLength(String(content || ''), 'utf8');
    return bytes > 90 ? 'LMS' : 'SMS';
};

/**
 * 관리자 고정 수신자에게만 전송
 * @param {string} contentText
 * @param {{subject?: string}} opt
 */
export async function sendToAdmins(contentText, opt = {}) {
  assertEnv();

  const recips = parseNotify();
  if (!recips.length) throw new Error('no_recipients_in_NOTIFY_PHONES');

  const method = 'POST';
  const timestamp = Date.now().toString();
  const signature = makeSignature({
    method,
    uri: URI,
    timestamp,
    accessKey: NCP_ACCESS_KEY,
    secretKey: NCP_SECRET_KEY,
  });

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-iam-access-key': NCP_ACCESS_KEY,
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-apigw-signature-v2': signature,
  };

  const type = decideType(contentText);
  const body = {
    type,
    contentType: 'COMM',
    countryCode: '82',
    from: normalizePhone(NCP_SMS_SENDER),
    subject: type === 'LMS' ? (opt.subject || '문의 알림') : undefined,
    content: contentText,
    messages: recips.map(to => ({ to })),
  };

  const dryRun = String(SMS_DRY_RUN || '').toLowerCase() === 'true';
  if (dryRun) {
    console.log('[SMS_DRY_RUN] would send:', { URL, body });
    return { dryRun: true, requestBody: body };
  }

  try {
    const { data } = await axios.post(URL, body, { headers, timeout: 10000 });
    return data; // {requestId,...}
  } catch (err) {
    if (err.response) {
      const e = new Error(`sens_error: ${err.response.status} ${err.response.statusText}`);
      e.data = err.response.data;
      throw e;
    }
    throw err;
  }
}