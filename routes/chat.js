const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth").isAuth;
const chatController = require("../controllers/chat");

router.get("/getChats", isAuth, chatController.getChats);

router.get("/getChat/:userId", isAuth, chatController.getChat);

router.post("/sendMessage/:userId", isAuth, chatController.send);

module.exports = router;
