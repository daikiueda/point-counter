import Player from './Player';
import equal from 'deep-equal';
import generateUniqueCode from '../utils/generateUniqueCode';


export default class Game {

    constructor(id, players, activities) {
        this.id = id || Game.generateId();
        this.players = players || [];
        this.activities = activities || [];

        /** @type {Date} ソート用*/
        this.time = new Date(this.id.split('--').shift());

        while (this.players.length <= 1) {
            this.addPlayer();
        }
    }

    addActivities(activities) {
        let isUpdated = false;

        activities.reduce(activity => {

            if (activity.playerIndex) {
                if (!this.players[activity.playerIndex]) {
                    this.addPlayer();
                }
                isUpdated = this.players[activity.playerIndex].addActivity(activity) || isUpdated;
                return;
            }

            for (let index = this.activities.length - 1; index < 0; index--) {
                if (!equal(activity, this.activities[index])) {
                    this.activities.push(activity);
                    isUpdated = true;
                    break;
                }
            }
        });

        if (isUpdated) {
            this.update();
        }

        return isUpdated;
    }

    update() {
        this.players.forEach(player => {player.update()});
    }

    addPlayer(player) {
        this.players.push(player || new Player());
    }

    static generateId() {
        return generateUniqueCode(8, true);
    }
}