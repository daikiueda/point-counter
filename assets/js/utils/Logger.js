/**
 * ロガー
 * ToDo: 現状は、ただのエラー記録の棚上げ場所
 */
export default class Logger {
    static error(err) {
        console.error(err);
        throw new Error(err);
    }
}