import choo from 'choo';
import html from 'choo/html';
import EventOrganizer from './service/EventOrganizer';
import PointCounter from './service/withGoogleAnalytics/PointCounter';

const GOOGLE_API_CREDENTIAL = require('./settings/google-api-credential.json');
const GOOGLE_ANALYTICS_SETTINGS = require('./settings/google-analytics.json');

const pointCounter = new PointCounter(GOOGLE_API_CREDENTIAL, GOOGLE_ANALYTICS_SETTINGS);
const eventId = EventOrganizer.parseId(location.hash) || EventOrganizer.generateId();
const organizer = new EventOrganizer(eventId, pointCounter);

const app = choo();

app.model({
    state: {
        title: 'Not quite set yet',
        authRequired: false,
        games: []
    },
    subscriptions: [
        (send, done) => {
            organizer.on(EventOrganizer.Event.REQUEST_AUTH, () => {
                console.log(organizer, 'REQUEST AUTH');
            });
        },
        (send, done) => {
            organizer.on(EventOrganizer.Event.REPORT, (result) => {
                console.log(organizer, result);
                send('update', result, err => {
                    if (err) return done(err);
                });
            });
        }
    ],
    reducers: {
        update: (data, state) => ({ games: data })
    }
});

const mainView = (state, prev, send) => html`
  <main>
    <h1>Title: ${state.title}</h1>
    <input
      type="text"
      oninput=${(e) => send('update', e.target.value)}>

    ${state.games.length}
  </main>
`;

app.router((route) => [
    route('/', mainView),
]);

const tree = app.start();
document.getElementById('app').appendChild(tree);

organizer.start();

// if (!location.hash.length) {
//     app.router(`/${eventId}`);
// }


