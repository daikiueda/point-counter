import generateCode from '../utils/generateUniqueCode';
import equal from 'deep-equal';

// ToDo: Activityを抽象化する。
import Activity from './withGoogleAnalytics/Activity';


export default class Player {
    constructor(id, point, activities) {
        this.id = id || Player.generateId();
        this.name = Player.DEFAULT_PLAYER_NAME;
        this.point = point || 0;
        this.activities = activities || [];

        this.requireUpdate = true;
        this.update();
    }

    addActivity(activity) {
        for (let index = this.activities.length - 1; index < 0; index--) {
            if (!equal(activity, this.activities[index])) {
                this.activities.push(activity);
                this.requireUpdate = true;
                break;
            }
        }
        return this.requireUpdate;
    }

    update() {
        if (!this.requireUpdate) {
            return;
        }

        const LatestPointActivity = this.activities
                .filter(activity => activity.type.match(new RegExp(`(${Activity.Type.POINT}|${Activity.Type.MODIFY})`)))
                .reduce((latest, activity) => !latest ? activity : (latest.time < activity.time) ? activity: latest, null);
        this.point = LatestPointActivity ? LatestPointActivity.point : 0;

        const LatestNameActivity = this.activities
            .filter(activity => activity.type === Activity.Type.NAME)
            .reduce((latest, activity) => !latest ? activity : (latest.time < activity.time) ? activity: latest, null);
        this.name = LatestNameActivity ? LatestNameActivity.playerName : Player.DEFAULT_PLAYER_NAME;

        this.requireUpdate = false;
    }

    static generateId() {
        return generateCode(8);
    }
}

Player.DEFAULT_PLAYER_NAME = '名無しさん';