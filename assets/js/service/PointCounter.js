import Emitter from 'tiny-emitter';

import Logger from '../utils/Logger';
import AnalyticsTrackingAPI from './google/AnalyticsTrackingAPI';
import AnalyticsReportingAPI from './google/AnalyticsReportingAPI';

const DEFAULT_REPORTING_INTERVAL_MILLISECOND = 2000;

export default class PointCounter extends Emitter {
    constructor(googleCoreCredential, analyticsSetting) {
        super();

        this.analyticsSetting = analyticsSetting;
        this.reporter = new AnalyticsReportingAPI(googleCoreCredential);
        this.tracker = new AnalyticsTrackingAPI(analyticsSetting.trackingId);

        this.currentEventId = null;
        this.logs = [];
    }

    init(immediate) {
        return Promise.all([
            this.reporter.init(immediate),
            this.tracker.init()
        ]).catch(Logger.error).then(() => (this));
    }

    start(eventId, auth) {
        this.currentEventId = eventId;
        this.init(auth).then(() => {
            console.log(this);
            this.report();
        });
    }

    report() {
        this.reporter.getRealtimeData(
            'ga:' + this.analyticsSetting.viewId,
            'rt:totalEvents',
            {
                dimensions: ['rt:eventAction', 'rt:eventLabel'].join(','),
                filters: `rt:eventCategory==${this.currentEventId}`
            }
        );
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