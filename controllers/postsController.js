const Post = require("../models/post");
const authorizer = require("../middleware/authorization");
const validator = require("../middleware/validation");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).exec();
  res.status(200).json({ message: "Success", posts });
});

exports.createPost = [
  authorizer.canCreatePost,
  ...validator.createPostValidator(),
  asyncHandler(async (req, res, next) => {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Request validation failed",
          details: errors.array().map((err) => ({
            field: err.path,
            error: err.msg,
          })),
        },
      });
    }

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
