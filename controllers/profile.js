const Post = require("../models/post");
const User = require("../models/user");
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


exports.uploadPicture=async (req,res,next)=>{
  if(!req.file)
  {
    console.log("No file uploaded");
    throw new Error("No file uploaded");
  }

  const imageUrl=req.file.path;
  await User.uploadProfilePicture(req.userId,imageUrl);
  res.status(200).json({message:"Profile Picture Uploaded"});
}

exports.getProfilePicture=async(req,res,next)=>{
  const [result] = await User.getProfilePicture(req.params.username);
  const imgUrl=result[0];

  res.status(200).json({message:"Profile Picture Loaded",imgUrl:imgUrl.imgUrl});
}