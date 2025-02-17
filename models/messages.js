const db = require("../util/database");

class messages {
  constructor(senderId, recieverId, content, createdAt) {
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.content = content;
    this.createdAt = createdAt;
  }

  static getChats(userId) {
    // const followersQuery =
    return db.execute(
      "SELECT users.id ,users.username,users.imgUrl FROM users,follows  WHERE userId = ? AND followingId = users.id",
      [userId]
    );
  }

  static getUsers(query) {
    return db.execute(
      "SELECT * FROM users WHERE username LIKE CONCAT('%',?,'%')",
      [query]
    );
  }

  static getLastMessage(userId, otherId) {
    return db.execute(
      "SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY createdAt DESC LIMIT 1;",
      [userId, otherId, otherId, userId]
    );
  }

  static getChat(myId, userId) {
    console.log("aa");
    return db.execute(
      "SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)",
      [myId, userId, userId, myId]
    );
  }
}

module.exports = messages;
