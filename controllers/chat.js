const Messages = require('../models/messages');

exports.getChat = async (req, res, next) => {
    const myId = req.userId;
    const userId = req.params.userId;

    try {
        const messages = await Messages.getChat(myId, userId);
        console.log(messages);
        res.status(200).json({messages: messages[0]});
    } catch (err) {
        throw new Error("Can't get Chat");
    }
};