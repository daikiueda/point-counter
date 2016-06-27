import Emitter from 'tiny-emitter';
import PointCounter from './PointCounter';
import Activity from './Activity';
import generateCode from '../utils/generateUniqueCode';

export default class EventOrganizer extends Emitter{
    constructor(eventId, pointCounter) {
        super();
        this.eventId = eventId;
        this.pointCounter = pointCounter;
        this.games = [];
        
        this.pointCounter.on(PointCounter.Event.REQUEST_AUTH, () => {
            this.emit(EventOrganizer.Event.REQUEST_AUTH);
        });
    }

    init() {
        return this.pointCounter.init(true)
            .then(() => (this));
    }

    start() {
        return this.init()
            .then(() => {
                return this.pointCounter.report(this.eventId)
                    .then(results => {
                        console.log(this, results);
                        if (!results.totalResults) {
                            return this.addNewGame();
                        }
                    });
            })
            // .then(() => {return this.pointCounter.start(this.eventId);});
    }

    addNewGame() {
        const gameId = EventOrganizer.Game.generateId();
        let activity = new Activity(this.eventId, gameId, Activity.Type.START);
        console.log(activity);
        return this.pointCounter.track(activity);
    }

    static parseId(hashFragment) {
        var id = hashFragment.replace('#', '').split('/').shift();
        return id.length ? id : null;
    }

    static generateId() {
        let today = new Date();
        return [
            today.getFullYear(),
            ('0' + (today.getMonth() + 1)).substr(-2),
            ('0' + today.getDate()).substr(-2),
            generateCode(8)
        ].join('-');
    }
}

EventOrganizer.Event = {
    REQUEST_AUTH: 'request-auth',
    REPORT: 'report'
};

EventOrganizer.Game = class Game {
    constructor(id) {
        this.id = id || EventOrganizer.Game.generateId();
        this.players = [];
    }

    static generateId() {
        return generateCode(8, true);
    }
};

EventOrganizer.Player = class Player {
    constructor(id) {
        this.id = id || EventOrganizer.Player.generateId();
        this.point = 0;
    }

    static generateId() {
        return generateCode(8);
    }
};