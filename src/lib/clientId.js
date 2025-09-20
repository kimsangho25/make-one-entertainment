export function getClientId() {
    const key = 'client_id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(key, id);
    }
    return id;
}