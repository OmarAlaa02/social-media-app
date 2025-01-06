const Post = require("../models/post");
const Like = require("../models/like");
exports.getPosts =  (req, res, next) => {
  const username = req.params.username;
  Post.getProfilePosts(username)
    .then(async ([result]) => {

        for (let post of result) {
            const [liked] = await Like.checkLike(req.userId, post.id);
            const isLiked = liked[0]["count(*)"] > 0;
            post.isLiked = isLiked;
            post.username = username;
            //     const loadedPost= new Views(req.userId,post.id);
            //     await loadedPost.save();
          }

      res.status(200).json({ message: "posts loaded", posts: result });
    })
    .catch((err) => {
      if (!err.code) {
        err.code = 500;
      }
      next(err);
    });
};
