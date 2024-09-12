const db = require('../util/database');

class Like {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = postId;
    }

    save() {
        return db.execute('INSERT INTO likes (userId, postId) VALUES (?, ?)', [this.userId, this.postId]);
    }

    static deleteLike(userId,postId) {
        return db.execute('DELETE FROM likes WHERE likes.postId = ? and likes.userId = ?', [postId, userId]);
    }

    static getLikesOnPost(postId) {
        return db.execute('SELECT userId FROM likes WHERE likes.postId = ?', [postId]);
    }
}

module.exports = Like;