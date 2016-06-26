export default function generateUniqueCode(digit = 8, addTimestamp) {
    let code = Math.random().toString(36).substr(-1 * digit).toUpperCase();
    if (addTimestamp) {
        code = `${(new Date()).toISOString()}--${code}`;
    }
    return code;
}