const Post = require("../models/post");
const authorizer = require("../middleware/authorization");
const asyncHandler = require("express-async-handler");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).exec();
  res.status(200).json({ message: "Success", posts });
});

exports.createPost = [
  authorizer.canCreatePost,
  (req, res, next) => {
    res.send("NOT IMPLEMENTED: Create Post");
  },
];

exports.getPost = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get post ${req.params.postId}`);
};

exports.updatePost = [
  authorizer.canUpdatePost,
  (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Update post ${req.params.postId}`);
  },
];

exports.deletePost = [
  authorizer.canDeletePost,
  (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Delete post ${req.params.postId}`);
  },
];
