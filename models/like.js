const db = require('../util/database');

class Like {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = postId;
    }

    save() {
        return db.execute('INSERT INTO like (userId, postId) VALUES (?, ?)', [this.userId, this.postId]);
    }
}

module.exports = Like;