const db = require('../util/database');

class Follow {
    constructor(userId, followingId) {
        this.userId = userId;
        this.followingId = followingId;
    }

    save() {
        return db.execute('INSERT INTO follows (userId, followingId) VALUES (?, ?', [userId, followingId]);
    }

    static getFollowingList(userId) {
        return db.execute('SELECT followingId FROM follows WHERE follows.userId = ?', [userId]);
    }

    static getFollowersList(userId) {
        return db.execute('SELECT userId FROM follows WHERE follows.followingId = ?', [userId]);
    }
}