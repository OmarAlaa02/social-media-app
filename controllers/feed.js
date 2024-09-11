const {validationResult} = require('express-validator');

const User = require('../models/user');
const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');

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

exports.likePost = (req, res, next) => {
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

exports.unlikePost = (req, res, next) => {
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

exports.getLikes = (req, res, next) => {
    const postId = req.params.postId;

    Like.getLikesOnPost(postId)
    .then(([result]) => {
        res.status(200).json({message: 'likes loaded', likes: result});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}

exports.commentOnPost = (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const content = req.body.content;
    const comment = new Comment(userId, postId, content);

    comment.save()
    .then(() => {
        return Post.incrementComment(postId);
    })
    .then(() => {
        res.status(201).json({message: 'Commented Successfully'});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;

    Comment.deleteComment(commentId)
    .then(() => {
        return Post.decrementComment(postId);
    })
    .then(() => {
        res.status(200).json({message: 'comment deleted'});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}

exports.getComments = (req, res, next) => {
    const postId = req.params.postId;

    Comment.getCommentsOnPost(postId)
    .then(([result]) => {
        console.log(result);
        res.status(200).json({message: 'Comments loaded!!!', comments: result});
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });
}