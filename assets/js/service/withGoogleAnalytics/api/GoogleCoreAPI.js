const TIMEOUT_LIMIT_MILLISECOND = 10000;
const GOOGLE_LIB_URL = 'https://apis.google.com/js/client.js?onload=';

import GlobalCallbackUtil from '../../../utils/GlobalCallbackUtil.js';
import loadScriptAsync from '../../../utils/loadScriptAsync.js';

export default class GoogleAPI {
    constructor(credential) {
        this.gapi = null;
        this.credential = credential;
    }

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

    signOut() {
        this.gapi.auth.signOut();
    }
}