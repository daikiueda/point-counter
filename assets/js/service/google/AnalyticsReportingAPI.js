import GoogleCoreAPI from './GoogleCoreAPI';

const GOOGLE_LIB_NAME = 'analytics',
    GOOGLE_LIB_VERSION = 'v3';

export default class AnalyticsReportingAPI {
    constructor(credential) {
        this.api = null;
        this.google = new GoogleCoreAPI(credential);
    }

    init() {
        return this.google.init()
            .then(() => {return this.google.auth(false)})
            .then(() => {return this.google.gapi.client.load(GOOGLE_LIB_NAME, GOOGLE_LIB_VERSION);})
            .then(() => {
                this.api = this.google.gapi.client.analytics;
                return this;
            });
    }

    getRealtimeData(viewId, metrics, options) {
        const params = Object.assign({ids: viewId, metrics}, options),
            request = this.api.data.realtime.get(params);

        return new Promise((resolve, reject) => {
            request.execute((response) => {
                console.log(response);
                resolve(response);
            });
        });
    }
}