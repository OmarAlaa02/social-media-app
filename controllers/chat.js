const Messages = require("../models/messages");
const redisClient = require("../redis");

exports.getChats = async (req, res, next) => {
  const searchQuery = req.query.query;
  //get from req.userId after returning isAuth
  const userId = 2;
  if (!searchQuery) {
    //following
    const [chats] = await Messages.getChats(userId);
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
        DBpromises.push(Messages.getLastMessage(userId, chats[i].id));
      }
    }
    const DBresults = await Promise.all(DBpromises);

    res.json({ chats, lastMessages, DBresults });
  } else {
    //searching
    const [users] = await Messages.getUsers(searchQuery);

    res.json(users);
  }
};

exports.getChat = async (req, res, next) => {
  const myId = req.userId;
  const userId = req.params.userId;

  try {
    const messages = await Messages.getChat(myId, userId);
    console.log(messages);
    res.status(200).json({ messages: messages[0] });
  } catch (err) {
    throw new Error("Can't get Chat");
  }
};
