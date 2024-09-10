const express = require('express');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth').isAuth;

const router = express.Router();

router.get('/:userId', isAuth, feedController.getProfile);

router.post('/postt', isAuth, feedController.createPost);

router.put('/likee/:postId', isAuth, feedController.like);

module.exports = router;