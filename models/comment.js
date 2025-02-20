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
        return db.execute(`
            SELECT comments.*, users.username, users.imgUrl 
            FROM comments 
            JOIN users ON comments.userId = users.id 
            WHERE comments.postId = ?`, 
            [postId]
        );
    }

    static canDelete(commentId){
        return db.execute('SELECT userId FROM comments WHERE comments.id = ?',[commentId]);
    }
}

module.exports = Comment;