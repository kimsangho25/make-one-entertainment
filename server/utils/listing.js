export function mapSort(sort = '-created_at') {
    const map = {
        'created_at': 'created_at ASC',
        '-created_at': 'created_at DESC',
        'rating': 'rating DESC',
        '-rating': 'rating ASC',
        'likes': 'likes_count DESC',
        '-likes': 'likes_count ASC',
    };
    return map[sort] || 'created_at DESC';
}

export function parsePaging(q) {
    const DEFAULT = Number(process.env.DEFAULT_LIMIT || 20);
    const MAX = Number(process.env.MAX_LIMIT || 50);
    const page = Math.max(1, parseInt(q.page || '1', 10));
    const limit = Math.min(MAX, Math.max(1, parseInt(q.limit || String(DEFAULT), 10)));
    return { page, limit, offset: (page - 1) * limit };
}