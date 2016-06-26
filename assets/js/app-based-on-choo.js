import EventOrganizer from './service/EventOrganizer';
import PointCounter from './service/PointCounter';

const GOOGLE_API_CREDENTIAL = require('./settings/google-api-credential.json');
const GOOGLE_ANALYTICS_SETTINGS = require('./settings/google-analytics.json');


const pointCounter = new PointCounter(GOOGLE_API_CREDENTIAL, GOOGLE_ANALYTICS_SETTINGS);
const eventId = EventOrganizer.parseId(location.hash) || EventOrganizer.generateId();
const organizer = new EventOrganizer(eventId, pointCounter);


if (!location.hash.length) {
    location.hash = eventId;
}

organizer.start();
