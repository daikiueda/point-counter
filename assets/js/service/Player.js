import generateCode from '../utils/generateUniqueCode';


export default class Player {
    constructor(id, point) {
        this.id = id || Player.generateId();
        this.point = point || 0;
    }

    static generateId() {
        return generateCode(8);
    }
}