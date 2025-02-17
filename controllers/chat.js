const messages = require("../models/messages");
const redisClient = require("../redis");

exports.getChats = async (req, res, next) => {
  const searchQuery = req.query.query;
  //get from req.userId after returning isAuth
  const userId = 2;
  if (!searchQuery) {
    //following
    const [chats] = await messages.getChats(userId);
    const lastMessagesPromises = [];
    for (let user of chats) {
      const first = Math.min(userId, user.id);
      const second = Math.max(userId, user.id);
      lastMessagesPromises.push(redisClient.get([first, second]));
    }

    const lastMessages = await Promise.all(lastMessagesPromises);

    const DBpromises = [];
    for (let i = 0; i < lastMessages.length; i++) {
      if (!lastMessages[i]) {
        //ask DB
        DBpromises.push(messages.getLastMessage(userId, chats[i].id));
      }
    }
    const DBresults = await Promise.all(DBpromises);

    res.json({ chats, lastMessages, DBresults });
  } else {
    //searching
    const [users] = await messages.getUsers(searchQuery);

    res.json(users);
  }
};
