import generateTimestamp from '../../utils/generateTimestamp';

const LABEL_SEPARATOR = ',';


export default class Activity {
    /**
     * @param {string} eventId
     * @param {string} gameId
     * @param {string|null} timestamp
     * @param {Activity.Type.*} type
     * @param {object} [details]
     */
    constructor(eventId, gameId, timestamp, type, details) {
        if (timestamp && !timestamp.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
            throw new TypeError(`${this}: invalid timestamp: ${timestamp}`);
        }

        details = details || {};

        this.theEventId = eventId;
        this.gameId = gameId;

        this.timestamp = timestamp || generateTimestamp();
        this.activityType = type;

        this.playerNumber = details.playerNumber;
        this.point = details.point;
        this.playerName = details.playerName;

        console.log('bbb', this);
    }

    /**
     * @return {{hitType: string, eventCategory: string, eventAction: string, eventLabel: string}}
     */
    toAnalyticsBeacon() {
        let labels = [this.timestamp, this.activityType];

        switch (this.activityType) {
            case Activity.Type.START:
                break;

            case Activity.Type.NAME:
            case Activity.Type.WINNER:
                labels.push(this.playerNumber);
                if (this.playerName) {
                    labels.push(this.playerName);
                }
                break;

            case Activity.Type.POINT:
            case Activity.Type.MODIFY:
                labels = labels.concat([this.playerNumber, this.point]);
                if (this.playerName) {
                    labels.push(this.playerName);
                }
                break;
        }

        return {
            hitType: 'event',
            eventCategory: this.theEventId,
            eventAction: this.gameId,
            eventLabel: labels.join(LABEL_SEPARATOR)
        };
    }

    static parse(gaEventLabel) {}
}

Activity.Type = {
    START: 'start',
    NAME: 'name',
    POINT: 'point',
    MODIFY: 'modify',
    WINNER: 'winner'
};