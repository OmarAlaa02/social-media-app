const db = require('../util/database');

class Like {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = postId;
    }

    save() {
        return db.execute('INSERT INTO likes (userId, postId) VALUES (?, ?)', [this.userId, this.postId]);
    }

    static findByPostIdAndDelete(id) {
        console.log('delete like is called with id = ', id);
        return db.execute('DELETE FROM likes WHERE likes.postId = ?', [id]);
    }
}

module.exports = Like;