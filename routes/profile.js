const express = require("express");
const multer = require("multer");
const path = require("path");
const profileController = require("../controllers/profile");
const isAuth = require("../middleware/is-auth").isAuth;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/posts/:username", isAuth, profileController.getPosts);

router.post(
  "/uploadPicture",
  isAuth,
  upload.single("profilePicture"),
  profileController.uploadPicture
);

router.get(
  "/profilePicture/:username",
  isAuth,
  profileController.getProfilePicture
);

module.exports = router;
