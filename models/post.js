const db = require('../util/database');

class Post {
    constructor(authorId, description) {
        this.authorId = authorId;
        this.likeCount = 0;
        this.commentCount = 0;
        this.description = description;
    }

    save() {
        return db.execute('INSERT INTO posts (authorId, likeCount, commentCount, description) VALUES (?, ?, ?, ?)', 
            [this.authorId, 0, 0, this.description]
        );
    }

    static incrementLike(id) {
        return db.execute('UPDATE posts SET likeCount = likeCount + 1 WHERE posts.id = ?', [id]);
    }

    static decrementLike(id) {
        return db.execute('UPDATE posts SET likeCount = likeCount - 1 WHERE posts.id = ?', [id]);
    }

    static incrementComment(id) {
        return db.execute('UPDATE posts SET commentCount = commentCount + 1 WHERE posts.id = ?', [id]);
    }

    static decrementComment(id) {
        return db.execute('UPDATE posts SET commentCount = commentCount - 1 WHERE posts.id = ?', [id]);
    }
}

module.exports = Post;