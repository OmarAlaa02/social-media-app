const db = require("../util/database");

class messages {
  constructor(senderId, recieverId, content, createdAt) {
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.content = content;
    this.createdAt = createdAt;
  }

  static getChat(myId, userId) {
    console.log("aa");
    return db.execute('SELECT * FROM messages WHERE (senderId = ? AND recieverId = ?) OR (senderId = ? AND recieverId = ?)', [myId, userId, userId, myId]);
  }
}

module.exports = messages;
