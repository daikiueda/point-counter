import Emitter from 'tiny-emitter';
import Game from './Game';
import generateCode from '../utils/generateUniqueCode';


export default class EventOrganizer extends Emitter {

    /**
     * @constructor
     * @param {string} eventId
     * @param {PointCounter} pointCounter
     */
    constructor(eventId, pointCounter) {
        super();

        this.PointCounter = pointCounter.constructor;
        this.Activity = this.PointCounter.Activity;

        this.eventId = eventId;
        this.pointCounter = pointCounter;
        this.games = [];
        
        this.reportGameStatus = this.reportGameStatus.bind(this);

        if (this.PointCounter.Event.REQUEST_AUTH) {
            this.pointCounter.on(this.PointCounter.Event.REQUEST_AUTH, () => {
                this.emit(EventOrganizer.Event.REQUEST_AUTH);
            });
        }
    }

    /**
     * 初期化
     * ポイント・カウンターを初期化する。
     * @return {Promise.<EventOrganizer>}
     */
    init() {
        return this.pointCounter.init(true).then(() => (this));
    }

    start() {
        return this.init()
            .then(() => {
                return this.pointCounter.report(this.eventId)
                    .then(results => {
                        if (!results || !results.length) {
                            let game = this.addGame();
                            return this.startGame(game);
                        }
                    });
            })
            .then(() => {
                this.pointCounter.on(this.PointCounter.Event.REPORT, this.reportGameStatus);
                return this.pointCounter.start(this.eventId);
            });
    }

    addGame(game) {
        game = game || new Game();
        this.games[game.id] = game;
        return game;
    }

    startGame(game) {
        const activity = new this.Activity(this.eventId, game.id, null, this.Activity.Type.START);
        return this.pointCounter.track(activity);
    }

    reportGameStatus(result) {
        console.log(result);
        const isUpdated = Object.keys(result).reduce((isAnyGameUpdated, gameId) => {
            if (!this.games[gameId]) {
                this.addGame(new Game(gameId));
            }
            return this.games[gameId].update(result[gameId]) || isAnyGameUpdated;
        }, false);

        if (isUpdated) {
            this.emit(EventOrganizer.Event.REPORT, this.games);
        }
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
            ('0' + today.getDate()).substr(-2)
        ].join('-') + `--${generateCode(8)}`;
    }
}

EventOrganizer.Event = {
    REQUEST_AUTH: 'request-auth',
    REPORT: 'report'
};
