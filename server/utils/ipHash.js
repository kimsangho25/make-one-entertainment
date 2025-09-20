import crypto from 'crypto';
export function ipHash(ip) {
    const salt = process.env.IP_HASH_SALT || 'salt';
    return crypto.createHash('sha256').update(`${ip}|${salt}`).digest('hex');
}