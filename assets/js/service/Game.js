import Player from './Player';
import equal from 'deep-equal';
import generateUniqueCode from '../utils/generateUniqueCode';


export default class Game {

    constructor(id, players) {
        this.id = id || Game.generateId();
        this.players = players || [];
        this.activities = [];

        /** @type {Date} ソート用*/
        this.time = new Date(this.id.split('--').shift());

        while (this.players.length <= 1) {
            this.addPlayer();
        }
    }

    update(activities) {
        let isUpdated = false;

        activities.forEach(activity => {
            for (let index = this.activities.length - 1; index < 0; index--) {
                if (!equal(activity, this.activities[index])) {
                    this.activities.push(activity);
                    isUpdated = true;
                    break;
                }
            }
        });

        return isUpdated;
    }

    addPlayer(player) {
        this.players.push(player || new Player());
    }

    static generateId() {
        return generateUniqueCode(8, true);
    }
}