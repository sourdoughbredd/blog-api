const Post = require("../models/post");
const authorizer = require("../middleware/authorization");
const { authenticate } = require("../middleware/authentication");
const validator = require("../middleware/validation");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

exports.getAllPosts = [
  authenticate,
  asyncHandler(async (req, res, next) => {
    let query;
    if (req.user && req.user.isAuthor) {
      query = {};
    } else {
      query = { isPublished: true };
    }
    const posts = await Post.find(query).exec();
    res.status(200).json({ message: "Success", posts });
  }),
];

exports.createPost = [
  authorizer.canCreatePost,
  ...validator.createPostValidationRules(),
  validator.validate,
  asyncHandler(async (req, res, next) => {
    // All checks passed. Create the post
    const { title, text, isPublished } = req.body;
    const post = new Post({
      user: req.user._id,
      title,
      text,
      timestamp: Date.now(),
      isPublished,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully." });
  }),
];

exports.getPost = asyncHandler(async (req, res, next) => {
  // Make sure ID provided is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Invalid post ID",
        id: req.params.postId,
      },
    });
  }

  // Get post
  const post = await Post.findById(req.params.postId)
    .populate("user", "username")
    .exec();
  if (!post) {
    return res.status(404).json({
      error: {
        code: 404,
        message: "Could not find post",
      },
    });
  }
  res.status(200).json({ message: "Success", post });
});

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
