import Player from './Player';
import generateCode from '../utils/generateUniqueCode';


export default class Game {

    constructor(id, players) {
        this.id = id || Game.generateId();
        this.players = players = [];

        while (Object.keys(this.players).length <= 1) {
            const player = new Player();
            this.players[player.id] = player;
        }
    }

    static generateId() {
        return generateCode(8, true);
    }
}