import GoogleCoreAPI from './GoogleCoreAPI';

const GOOGLE_LIB_NAME = 'analytics',
    GOOGLE_LIB_VERSION = 'v3';


/**
 * AnalyticsReportingAPI
 * Google アナリティクス レポーティングAPIのラッパー。
 */
export default class AnalyticsReportingAPI {

    /**
     * @constructor
     * @param {api_key: string, client_id: string, scope: string} credential APIクライアントの認証情報
     */
    constructor(credential) {
        this.api = null;
        this.google = new GoogleCoreAPI(credential);
    }

    /**
     * 初期化
     *
     * 以下を、順次実行する。
     *   1. Google アカウント認証
     *   2. Google アナリティクスAPIのClient Libraryの非同期ロード
     *   3. Google アナリティクスAPIの参照を、インスタンス・プロパティに格納
     *
     * @param {boolean} immediate 即時認証の有無。trueの場合、認証UIは表示されない。
     * @return {Promise}
     */
    init(immediate) {
        if (this.api) {
            return Promise.resolve(this);
        }

        return this.google.init()
            .then(() => this.google.auth(immediate))

            // 以下は、認証に失敗した場合は実行されない。
            .then(() => this.google.gapi.client.load(GOOGLE_LIB_NAME, GOOGLE_LIB_VERSION))
            .then(() => {
                this.api = this.google.gapi.client.analytics;
                return this;
            });
    }

    /**
     * リアルタイム・レポート
     * @see https://developers.google.com/apis-explorer/#p/analytics/v3/analytics.data.realtime.get
     *
     * @param {string} viewId
     * @param {string} metrics
     * @param {object} [options]
     * @return {Promise}
     */
    getRealtimeData(viewId, metrics, options) {
        const params = Object.assign({ids: viewId, metrics}, options),
            request = this.api.data.realtime.get(params);

        return new Promise((resolve, reject) => {
            request.execute((response) => {
                if (response.error) {
                    reject(response.error);
                }
                resolve(response);
            });
        });
    }
}