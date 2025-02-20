const db = require('../util/database');

class Views {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = postId;
    }

    save() {
        return db.execute('INSERT INTO views (userId, postId) VALUES (?, ?)', [this.userId, this.postId]);
    }
    
    static loadposts(userId,lastPostId)
    {
        // return db.execute('SELECT posts.id,posts.authorId,posts.likeCount,posts.commentCount,posts.description From posts Where posts.authorId in (select follows.followingId from follows where follows.userId = ? ) AND posts.id not in (select views.postId from views where views.userId = ? ) And posts.id > ? limit 4',[userId,userId,lastPostId]);
        return db.execute(`
            SELECT 
                users.username, 
                users.imgUrl, 
                posts.id, 
                posts.authorId, 
                posts.likeCount, 
                posts.commentCount, 
                posts.description 
            FROM posts
            JOIN users ON posts.authorId = users.id
            WHERE posts.authorId IN (
                SELECT follows.followingId 
                FROM follows 
                WHERE follows.userId = ?
            )
        `, [userId]);        
    }
}

module.exports=Views;