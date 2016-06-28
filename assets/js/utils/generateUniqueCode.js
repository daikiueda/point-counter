/**
 * ユニークなコードを生成して返却する。
 * @param {integer} digit default=8
 * @param {boolean} addTimestamp(toISOString)
 * @return {string} [0-9A-A]{digit} or [0-9A-A]{digit}--YYYY-MM-DDThh:mm:ss.SSSZ
 */
export default function generateUniqueCode(digit = 8, addTimestamp) {
    let code = Math.random().toString(36).substr(-1 * digit).toUpperCase();
    if (addTimestamp) {
        code = `${(new Date()).toISOString()}--${code}`;
    }
    return code;
}