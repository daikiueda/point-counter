import generateTimestamp from '../../utils/generateTimestamp';

const LABEL_SEPARATOR = ',';


export default class Activity {
    /**
     * @param {string} eventId
     * @param {string} gameId
     * @param {string|null} timestamp
     * @param {Activity.Type.*} activityType
     * @param {object} [details]
     */
    constructor(eventId, gameId, timestamp, activityType, details) {

        details = details || {};

        this.theEventId = eventId;
        this.gameId = gameId;

        this.timestamp = timestamp || generateTimestamp();
        this.activityType = activityType;

        this.playerNumber = details.playerNumber;
        this.point = details.point;
        this.playerName = details.playerName;
    }

    /**
     * @return {{hitType: string, eventCategory: string, eventAction: string, eventLabel: string}}
     */
    toAnalyticsBeacon() {
        let label = [this.timestamp, this.activityType];

        switch (this.activityType) {
            case Activity.Type.START:
                break;

            case Activity.Type.NAME:
            case Activity.Type.WINNER:
                label.push(this.playerNumber);
                if (this.playerName) {
                    label.push(this.playerName);
                }
                break;

            case Activity.Type.POINT:
            case Activity.Type.MODIFY:
                label = label.concat([this.playerNumber, this.point]);
                if (this.playerName) {
                    label.push(this.playerName);
                }
                break;
        }

        return {
            hitType: 'event',
            eventCategory: this.theEventId,
            eventAction: this.gameId,
            eventLabel: label.join(LABEL_SEPARATOR)
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