const express = require('express');

const chatController = require('../controllers/chat');
const isAuth = require('../middleware/is-auth').isAuth;

const router = express.Router();

router.get('/getChat/:userId', isAuth, chatController.getChat);

module.exports = router;