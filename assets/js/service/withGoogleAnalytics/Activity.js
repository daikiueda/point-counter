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

        this.playerIndex = details.playerIndex;
        this.point = details.point;
        this.playerName = details.playerName;

        /** @type {Date} ソート用*/
        this.time = new Date(this.timestamp);
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
                labels.push(this.playerIndex);
                if (this.playerName) {
                    labels.push(this.playerName);
                }
                break;

            case Activity.Type.POINT:
            case Activity.Type.MODIFY:
                labels = labels.concat([this.playerIndex, this.point]);
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

    static parseEventLabel(gaEventLabel) {
        const labelCols = gaEventLabel.split(LABEL_SEPARATOR),
            params = {
                timestamp: labelCols[0],
                type: labelCols[1]
            };

        switch (labelCols[1]) {
            case Activity.Type.START:
                break;

            case Activity.Type.NAME:
            case Activity.Type.WINNER:
                Object.assign(params, {
                    playerIndex: labelCols[2],
                    playerName: labelCols[3]
                });
                break;

            case Activity.Type.POINT:
            case Activity.Type.MODIFY:
                Object.assign(params, {
                    playerIndex: labelCols[2],
                    point: labelCols[3],
                    playerName: labelCols[4]
                });
                break;

            default:
                throw new Error(`Activity.parseEventLabel: invalid format: ${gaEventLabel}`);
        }

        return params;
    }
}

Activity.Type = {
    START: 'start',
    NAME: 'name',
    POINT: 'point',
    MODIFY: 'modify',
    WINNER: 'winner'
};