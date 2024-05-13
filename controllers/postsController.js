const Post = require("../models/post");
const Comment = require("../models/comment");
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
    const posts = await Post.find(query)
      .populate("user", "username")
      .sort({ timestamp: -1 })
      .exec();
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
    res.status(201).json({ message: "Post created successfully.", post });
  }),
];

exports.getPost = [
  authenticate,
  asyncHandler(async (req, res, next) => {
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
    const userIsAuthor = req.user && req.user.isAuthor;
    if (!post.isPublished && !userIsAuthor) {
      return res.status(404).json({
        error: {
          code: 401,
          message: "Unauthorized",
        },
      });
    }
    res.status(200).json({ message: "Success", post });
  }),
];

exports.updatePost = [
  authorizer.canUpdatePost,
  ...validator.createUpdatePostValidationRules(),
  validator.validate,
  asyncHandler(async (req, res, next) => {
    // Make sure post ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid post ID",
          id: req.params.postId,
        },
      });
    }

    // Make sure post exists
    const post = await Post.findById(req.params.postId).exec();
    if (!post) {
      res.status(404).json({
        error: {
          code: 404,
          message: "Post not found",
        },
      });
    }

    // Make sure we got some new data
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newIsPublished = req.body.isPublished;
    if (
      (!newTitle || newTitle === post.title) &&
      (!newText || newText === post.text) &&
      (newIsPublished === undefined ||
        newIsPublished === null ||
        newIsPublished === post.isPublished)
    ) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Bad Request: No new data provided",
        },
      });
    }

    // Update the post
    if (newTitle) post.title = newTitle;
    if (newText) post.text = newText;
    if (newIsPublished !== null || newIsPublished !== undefined)
      post.isPublished = newIsPublished;
    await post.save();
    res.status(200).json({ message: "Successfully updated post.", post });
  }),
];

exports.deletePost = [
  authorizer.canDeletePost,
  asyncHandler(async (req, res, next) => {
    // Make sure post ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid post ID",
          id: req.params.postId,
        },
      });
    }

    // Delete the post
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Post not found",
          id: req.params.postId,
        },
      });
    }

    // Delete the post comments
    await Comment.deleteMany({ post: post._id }).exec();
    return res.status(200).json({ message: "Successfully deleted post" });
  }),
];
