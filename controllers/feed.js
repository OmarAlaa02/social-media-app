const {validationResult} = require('express-validator');

const User = require('../models/user');
const Post = require('../models/post');
const Like = require('../models/like');
const Comment = require('../models/comment');
const Follow = require('../models/follows');
const Views=require('../models/views');
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
        return Like.deleteLike(req.userId,postId);
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

exports.postFollow=(req,res,next)=>{
    const { followingId } = req.body;
    const follow = new Follow(req.userId,followingId);

    follow.save()
    .then(()=>{
        res.status(201).json({
            message: `User:${req.userId} followed User:${followingId}`
        })
        .catch(err => {
            if (!err.code) {
                err.code = 500;
            }
            next(err);
        });
    })
}

exports.deleteFollow=(req,res,next)=>{
    const { followingId } = req.body;

    Follow.unFollow(req.userId,followingId)
    .then(()=>{
        res.status(200).json({
            message: `User:${req.userId} unfollowed User:${followingId}`
        });
    })
    .catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });

}

exports.loadPosts=(req,res,next)=>{
    const lastPostId=req.body.lastPostId || 0;

    console.log(req.userId,lastPostId);

    //TODO fix this code
    Views.loadposts(req.userId,lastPostId)
    .then(async([result])=>{
        console.log(result);
        for(let post of result)
        {
            const loadedPost= new Views(req.userId,post.id);
            await loadedPost.save();
        }

        res.status(200).json({
            message:'loaded posts succefully'
        })
    }).catch(err => {
        if (!err.code) {
            err.code = 500;
        }
        next(err);
    });

}