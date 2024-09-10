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
}

module.exports = Post;