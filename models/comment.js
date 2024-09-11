const db = require('../util/database');

class Comment {
    constructor(userId, postId, content) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }

    save() {
        return db.execute('INSERT INTO comments (userId, postId, content) VALUES (?, ?, ?)', [
            this.userId, this.postId, this.content
        ]);
    }

    static deleteComment(id) {
        return db.execute('DELETE FROM comments WHERE comments.id = ?', [id]);
    }

    static getCommentsOnPost(postId) {
        console.log(1);
        return db.execute('SELECT * FROM comments WHERE comments.postId = ?', [postId]);
    }
}

module.exports = Comment;