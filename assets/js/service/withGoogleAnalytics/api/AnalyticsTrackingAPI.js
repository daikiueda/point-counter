const TIMEOUT_LIMIT_MILLISECOND = 10000;


/**
 * AnalyticsTrackingAPI
 * Web向けのanalytics.js（ユニバーサル・アナリティクス）のラッパー
 */
export default class AnalyticsTrackingAPI {

    /**
     * @constructor
     * @param {string} trackingId
     */
    constructor(trackingId) {
        this._track = null;
        this.trackingId = trackingId;
    }

    /**
     * 初期化
     * 
     * 以下を、順次実行する。
     *   1. ユニバーサル・アナリティクスのコード・スニペットを実行
     *   2. ga('create', this.trackingId, 'auto');
     *   3. ga('send', 'pageview')
     * 
     * @return {Promise}
     */
    init() {
        if (this._track) {
            return Promise.resolve(this);
        }

        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject(new Error('Google Analytics Tracking library loading timed out.'));
            }, TIMEOUT_LIMIT_MILLISECOND);
            
            // Run standard code snippet
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                };
                i[r].l = 1 * new Date();
                a = s.createElement(o);
                m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            window.ga('create', this.trackingId, 'auto');
            window.ga('send', 'pageview');
            window.ga(() => {
                clearTimeout(timeout);
                this._track = window.ga.bind(window);
                resolve(this);
            });
        });
    }

    /**
     * トラッキング
     * ≒ ga('send', beacon);
     *
     * @param {object} beacon
     * @return {Promise}
     */
    track(beacon) {
        return new Promise(resolve => {
            beacon.hitCallback = resolve;
            console.log(this, beacon);
            this._track('send', beacon);
        });
    }
}