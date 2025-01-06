const express = require('express');

const profileController = require('../controllers/profile');
const isAuth = require('../middleware/is-auth').isAuth;

const router = express.Router();

router.get('/posts/:username',isAuth, profileController.getPosts);

module.exports = router;
