export default class Logger {
    static error(err) {
        console.error(err);
        throw new Error(err);
    }
}