const db = require("../util/database");

class messages {
  constructor(senderId, recieverId, content) {
    this.senderId = senderId;
    this.recieverId = recieverId;
    this.content = content;
  }
}

module.exports = Comment;
