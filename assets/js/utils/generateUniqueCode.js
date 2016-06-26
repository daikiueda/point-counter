export default function generateUniqueCode() {
    return [
        (new Date()).toISOString(),
        Math.random().toString(36).substr(-8).toUpperCase()
    ].join('--');
}