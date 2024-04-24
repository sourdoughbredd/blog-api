const Post = require("../models/post");
const authorizer = require("../middleware/authorization");
const validator = require("../middleware/validation");
const asyncHandler = require("express-async-handler");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).exec();
  res.status(200).json({ message: "Success", posts });
});

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
