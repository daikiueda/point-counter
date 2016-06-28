import Emitter from 'tiny-emitter';

import Logger from '../../utils/Logger';
import AnalyticsTrackingAPI from './api/AnalyticsTrackingAPI';
import AnalyticsReportingAPI from './api/AnalyticsReportingAPI';
import Activity from './Activity';

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
        ]).catch(error => {
            Logger.error(error);
            return Promise.reject(error);
        }).then(() => (this));
    }

    start(eventId, immediate) {
        this.init(immediate).then(() => {
            this.report(eventId);
        });
    }

    report(eventId) {
        return this.init(true).then(() => {
            return this.reporter.getRealtimeData(
                'ga:' + this.analyticsSetting.viewId,
                'rt:totalEvents',
                {
                    dimensions: ['rt:eventAction', 'rt:eventLabel'].join(','),
                    filters: `rt:eventCategory==${eventId}`
                }
            ).then(results => results);
        });
    }

    track(beacon) {
        return this.tracker.track(beacon.toAnalyticsBeacon());
    }
}

PointCounter.Activity = Activity;

PointCounter.Event = {
    REQUEST_AUTH: 'request-auth',
    REPORT: 'report'
};