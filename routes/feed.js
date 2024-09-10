const express = require('express');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth').isAuth;

const router = express.Router();

router.get('/:userId', isAuth, feedController.getProfile);

router.post('/postt', isAuth, feedController.createPost);

router.put('/like/:postId', isAuth, feedController.like);

router.put('/unlike/:postId', isAuth, feedController.unlike);

module.exports = router;