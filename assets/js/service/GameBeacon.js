import generateTimestamp from '../utils/generateTimestamp';

const LABEL_SEPARATOR = ',';

export default class GameBeacon {
    constructor(eventId, gameId, type, details) {
        this.eventId = eventId;
        this.gameId = gameId;

        this.type = type;

        // this.playerIndex;
    }

    format() {
        let label = [generateTimestamp(), this.type];
        switch (this.type) {
            case GameBeacon.Type.START:
                break;

            case GameBeacon.Type.POINT:
            case GameBeacon.Type.MODIFY:
                label = label.concat([

                ]);
                break;
        }
        return {
            hitType: 'event',
            eventCategory: this.eventId,
            eventAction: this.gameId,
            eventLabel: label.join(LABEL_SEPARATOR)
        };
    }
}

GameBeacon.Type = {
    START: 'start',
    POINT: 'point',
    MODIFY: 'modify'
};