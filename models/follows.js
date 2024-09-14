const db = require('../util/database');

class Follow {
    constructor(userId, followingId) {
        this.userId = userId;
        this.followingId = followingId;
    }

    save() {
        return db.execute('INSERT INTO follows (userId, followingId) VALUES (?, ?)', [this.userId, this.followingId]);
    }

    static getFollowingList(userId) {
        return db.execute('SELECT followingId FROM follows WHERE follows.userId = ?', [userId]);
    }

    static getFollowersList(userId) {
        return db.execute('SELECT userId FROM follows WHERE follows.followingId = ?', [userId]);
    }

    static unFollow(userId,followingId){
        return db.execute('DELETE FROM follows WHERE follows.userId = ? AND follows.followingId = ?',[userId,followingId]);
    }
}

module.exports=Follow;