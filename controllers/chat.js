const Messages = require("../models/messages");
const redisClient = require("../redis");
const IO = require("../socket");

exports.getChats = async (req, res, next) => {
  const searchQuery = req.query.query;
  //get from req.userId after returning isAuth
  const userId = req.userId;
  if (!searchQuery) {
    //following
    const [chats] = await Messages.getChats(userId);
    const lastMessagesPromises = [];
    for (let i = 0; i < chats.length; i++) {
      const first = Math.min(userId, chats[i].id);
      const second = Math.max(userId, chats[i].id);
      lastMessagesPromises.push(redisClient.get([first, second]));
      chats[i].lastmessage = "bye";
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

    res.json({ chats });
  } else {
    //searching
    const [chats] = await Messages.getUsers(searchQuery);

    res.json({ chats });
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

exports.send = async (req, res, next) => {
  console.log("in send controller");
  const message = req.body.message;
  const myId = req.userId;
  const userId = req.params.userId;
  console.log(myId, userId, message);
  const userSocketId = await redisClient.get(userId);
  const mySocketId = await redisClient.get(myId);
  const io = IO.getIO();
  const dateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

  const sentMsgObj = {
    senderId: myId,
    receiverId: userId,
    content: message,
    createdAt: dateTime,
  };

  io.to(userSocketId).emit("newMessage", { sentMsgObj });
  io.to(mySocketId).emit("newMessage", { sentMsgObj });
  
  const msg = new Messages(myId, userId, message, dateTime);

  await msg.save();
  res.json({ message: "Sent Successfully" });
};
