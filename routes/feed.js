const express = require('express');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth').isAuth;

const router = express.Router();

router.get('/posts',isAuth ,feedController.loadPosts);

router.get('/:userId', isAuth, feedController.getProfile);

router.post('/postt', isAuth, feedController.createPost);

router.put('/like/:postId', isAuth, feedController.likePost);

router.put('/unlike/:postId', isAuth, feedController.unlikePost);

router.get('/like/:postId', isAuth, feedController.getLikes);

router.put('/comment/:postId', isAuth, feedController.commentOnPost);

router.delete('/comment/:postId/:commentId', isAuth, feedController.deleteComment);

router.get('/comment/:postId', isAuth, feedController.getComments);

router.post('/follow', isAuth, feedController.postFollow);

router.delete('/unfollow', isAuth, feedController.deleteFollow)

module.exports = router;