/**
 * 実行時点のタイムスタンプ（日付・時刻）を返却する。
 * @return {string} YYYY-MM-DD hh:mm:ss
 */
export default function generateTimeStamp() {
    function pad(num) {
        return ('0' + num).slice(-2);
    }

    var now = new Date();
    return [
        [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('-'),
        [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join(':')
    ].join(' ');
}
