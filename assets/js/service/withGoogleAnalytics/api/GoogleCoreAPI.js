const TIMEOUT_LIMIT_MILLISECOND = 10000;
const GOOGLE_LIB_URL = 'https://apis.google.com/js/client.js?onload=';

import GlobalCallbackUtil from '../../../utils/GlobalCallbackUtil.js';
import loadScriptAsync from '../../../utils/loadScriptAsync.js';


/**
 * GoogleCoreAPI
 */
export default class GoogleCoreAPI {

    /**
     * @constructor
     * @param {api_key: string, client_id: string, scope: string} credential APIクライアントの認証情報
     */
    constructor(credential) {
        this.gapi = null;
        this.credential = credential;
    }

    /**
     * 初期化
     * Google API Client Library （外部JSファイル）を非同期にロードする。
     * @return {Promise}
     */
    init() {
        if (this.gapi) {
            return Promise.resolve(this);
        }

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                globalCallbackUtil.remove(callbackFunc);
                reject(new Error('Google client library loading timed out.'));
            }, TIMEOUT_LIMIT_MILLISECOND);

            const globalCallbackUtil = new GlobalCallbackUtil(),
                callbackFunc = () => {
                    this.gapi = window.gapi;
                    clearTimeout(timeout);
                    resolve(this);
                },
                callbackName = globalCallbackUtil.add(callbackFunc);

            loadScriptAsync(`${GOOGLE_LIB_URL}${callbackName}`);
        });
    }

    /**
     * 認証
     * @param {boolean} immediate 即時認証の有無。trueの場合、認証UIは表示されない。
     * @return {Promise}
     */
    auth(immediate) {
        return new Promise((resolve, reject) => {
            this.gapi.auth.authorize(
                Object.assign({immediate: immediate}, this.credential),
                function(result) {
                    if (result.error) {
                        reject(new Error(result.error_subtype));
                        return;
                    }
                    resolve(this);
                }
            );
        });
    }

    /**
     * サインアウト
     */
    signOut() {
        this.gapi.auth.signOut();
    }
}