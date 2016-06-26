import Logger from '../utils/Logger';
import AnalyticsTrackingAPI from './google/AnalyticsTrackingAPI';
import AnalyticsReportingAPI from './google/AnalyticsReportingAPI';

const DEFAULT_REPORTING_INTERVAL_MILLISECOND = 2000;

export default class PointCounter {
    constructor(googleCoreCredential, analyticsSetting) {
        this.reporter = new AnalyticsReportingAPI(googleCoreCredential);
        this.tracker = new AnalyticsTrackingAPI(analyticsSetting.trackingId);

        this.analyticsSetting = analyticsSetting;
        this.currentEventId = null;
    }

    init() {
        return Promise.all([
            this.reporter.init(),
            this.tracker.init()
        ]).catch(Logger.error).then(() => (this));
    }

    start(eventId) {
        this.currentEventId = eventId;
        this.init().then(() => {
            console.log(this);
            this.report();
        });
    }

    report() {
        this.reporter.getRealtimeData(`ga:${this.analyticsSetting.viewId}`, 'rt:pageviews');
    }

    static parseEventId(hashFragment) {
        var id = hashFragment.replace('#', '').split('/').shift();
        return id.length ? id : null;
    }

    static generateEventId() {
        let today = new Date();
        return [
            today.getFullYear(),
            ('0' + (today.getMonth() + 1)).substr(-2),
            ('0' + today.getDate()).substr(-2),
            Math.random().toString(36).substr(-8)
        ].join('-');
    }
}