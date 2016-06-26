import PointCounter from './service/PointCounter';

const GOOGLE_API_CREDENTIAL = require('./settings/google-api-credential.json');
const GOOGLE_ANALYTICS_SETTINGS = require('./settings/google-analytics.json');


const pointCounter = new PointCounter(GOOGLE_API_CREDENTIAL, GOOGLE_ANALYTICS_SETTINGS);
const eventId = PointCounter.parseEventId(location.hash) || PointCounter.generateEventId();


if (!location.hash.length) {
    location.hash = eventId;
}

pointCounter.start(eventId);
