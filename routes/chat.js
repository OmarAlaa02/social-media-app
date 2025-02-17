const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth").isAuth;
const chatController = require("../controllers/chat");

router.get("/getChats", chatController.getChats);

router.get("/getChat/:userId", isAuth, chatController.getChat);

module.exports = router;
