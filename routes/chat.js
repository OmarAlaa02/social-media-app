const express = require("express");
const router = express.Router();

// const isAuth = require('../middleware/is-auth');
const chatController = require("../controllers/chat");

router.get("/getChats", chatController.getChats);

module.exports = router;
