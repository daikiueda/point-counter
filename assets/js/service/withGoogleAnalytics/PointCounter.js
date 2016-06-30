import Emitter from 'tiny-emitter';

import Logger from '../../utils/Logger';
import AnalyticsTrackingAPI from './api/AnalyticsTrackingAPI';
import AnalyticsReportingAPI from './api/AnalyticsReportingAPI';
import Activity from './Activity';


/**
 * PointCounter
 * 点数などの入力（アナリティクスでの計測）と、出力（レポート取得）を行う。
 * ※trackerとreporterを束ねる。定期的にレポートを取得して、結果をEmitする。
 */
export default class PointCounter extends Emitter {

    /**
     * @param {api_key: string, client_id: string, scope: string} googleCoreCredential
     * @param {trackingId: string, viewId: string} analyticsSetting
     */
    constructor(googleCoreCredential, analyticsSetting) {
        super();

        this.analyticsSetting = analyticsSetting;
        this.reporter = new AnalyticsReportingAPI(googleCoreCredential);
        this.tracker = new AnalyticsTrackingAPI(analyticsSetting.trackingId);

        this.logs = null;
        this.timer = null;
    }

    /**
     * 初期化
     * trackerとreporterを初期化する。
     *
     * @param {boolean} immediate Googleアカウントの即時認証の有無。trueの場合、認証UIは表示されない。
     * @return {Promise.<PointCounter>}
     */
    init(immediate) {
        return Promise.all([
            this.reporter.init(immediate),
            this.tracker.init()
        ]).catch(error => {
            // ToDo: エラーとりまわし
            Logger.error(error);
            return Promise.reject(error);
        }).then(() => (this));
    }

    /**
     * 定期レポート処理の開始
     * Google アナリティクスからレポートを取得して、結果をEmitする。
     *
     * @param {string} eventId
     * @param {boolean} immediate Googleアカウントの即時認証の有無。trueの場合、認証UIは表示されない。
     * @return {Promise}
     */
    start(eventId, immediate) {
        if (this.timer) {
            return Promise.resolve(this);
        }

        return this.init(immediate).then(() => {
            this.timer = setInterval(() => {
                this.report(eventId).then(result => {
                    this.emit(PointCounter.Event.REPORT, result);
                });
            }, PointCounter.Setting.DEFAULT_REPORTING_INTERVAL_MILLISECOND);
        });
    }

    /**
     * 計測（Google アナリティクスでのトラッキング）
     *
     * @param {object} beacon
     * @return {Promise}
     */
    track(beacon) {
        return this.tracker.track(beacon.toAnalyticsBeacon());
    }

    /**
     * レポート（Google アナリティクスでのレポーティング）
     * 取得結果は、Emitされない。
     *
     * @param {string} eventId
     * @return {Promise}
     */
    report(eventId) {
        return this.init(false).then(() => {
            return this.reporter.getRealtimeData(
                'ga:' + this.analyticsSetting.viewId,
                'rt:totalEvents',
                {
                    dimensions: ['rt:eventAction', 'rt:eventLabel'].join(','),
                    filters: `rt:eventCategory==${eventId}`,
                    fields: 'rows'
                }
            ).then(results => results.rows.map(recode => {
                let params = PointCounter.Activity.parse(recode[1]);
                return new PointCounter.Activity(eventId, recode[0], params.timestamp, params.type, params);
            }));
        });
    }
}

PointCounter.Activity = Activity;

PointCounter.Event = {
    REQUEST_AUTH: 'request-auth',
    REPORT: 'report'
};

PointCounter.Setting = {
    DEFAULT_REPORTING_INTERVAL_MILLISECOND: 2000
};