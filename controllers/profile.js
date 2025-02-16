const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");
const Follow = require("../models/follows");

exports.getProfileData = async (req, res, next) => {
  const userId = req.params.userId;
  const [posts] = await Post.getProfilePosts(userId);

  const [profilePicture] = await User.getProfilePicture(userId);
  const [userData] = await User.findById(userId);
  const [isFollowed] = await Follow.checkFollow(req.userId, userId);
  const username = userData[0].username;
  for (let post of posts) {
    const [liked] = await Like.checkLike(req.userId, post.id);
    const isLiked = liked[0]["count(*)"] > 0;
    post.isLiked = isLiked;
    post.username = username;
    //     const loadedPost= new Views(req.userId,post.id);
    //     await loadedPost.save();
  }

  res
    .status(200)
    .json({
      message: "posts loaded",
      posts: posts,
      profilePicture: profilePicture[0].imgUrl,
      isFollowed: isFollowed[0]["count(*)"] > 0,
      username,
    });
};

exports.uploadPicture = async (req, res, next) => {
  if (!req.file) {
    console.log("No file uploaded");
    throw new Error("No file uploaded");
  }

  const imageUrl = req.file.path;
  await User.uploadProfilePicture(req.userId, imageUrl);
  res.status(200).json({ message: "Profile Picture Uploaded" });
};

exports.getProfilePicture = async (req, res, next) => {
  const [result] = await User.getProfilePicture(req.params.username);
  const imgUrl = result[0];

  res
    .status(200)
    .json({ message: "Profile Picture Loaded", imgUrl: imgUrl.imgUrl });
};
