const {validationResult} = require('express-validator');

const User = require('../models/user');
const Post = require('../models/post');
const Like = require('../models/like');

exports.getProfile = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
    .then(([result]) => {
        res.status(200).json({message: 'User loaded Successfully', username: result[0].username});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }

        next(err);
    });
}

exports.createPost = (req, res, next) => {
    // const error = validationResult(req);
    // if (!error.isEmpty()) {
    //     const err = new Error();
    //     err.data = error.array()[0].msg;
    //     throw err;
    // }

    const authorId = req.userId;
    const description = req.body.description;
    const post = new Post(authorId, description);
    post.save()
    .then(([result]) => {
        res.status(201).json({message: 'Post uploaded Successfully', post: post});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    })
}

exports.like = (req, res, next) => {
    const postId = req.params.postId;
    Post.incrementLike(postId)
    .then(() => {
        const like = new Like(req.userId, postId);
        return like.save()
    })
    .then(() => {
        res.status(201).json({message: 'liked akheran'});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}

exports.unlike = (req, res, next) => {
    const postId = req.params.postId;
    Post.decrementLike(postId)
    .then(() => {
        return Like.findByPostIdAndDelete(postId);
    })
    .then(() => {
        res.status(200).json({message: 'like removed'});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}