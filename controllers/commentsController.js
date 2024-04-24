const Comment = require("../models/comment");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const authorizer = require("../middleware/authorization");
const validator = require("../middleware/validation");
const mongoose = require("mongoose");

exports.getPostComments = asyncHandler(async (req, res, next) => {
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

  // Check that post exists
  const postExists = await Post.exists({ _id: req.params.postId });
  if (!postExists) {
    res.status(404).json({
      error: {
        code: 404,
        message: "Post not found",
      },
    });
  }

  // Get post comments
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username")
    .exec();
  res.status(200).json({ message: "Success", comments });
});

exports.createPostComment = [
  authorizer.canCreateComment,
  ...validator.createCommentValidationRules(),
  validator.validate,
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

    // Check that post exists
    const postExists = await Post.exists({ _id: req.params.postId });
    if (!postExists) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Post not found",
        },
      });
    }

    // Create the comment
    const comment = new Comment({
      post: req.params.postId,
      user: req.user._id,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).json({ message: "Comment created successfully", comment });
  }),
];

exports.getPostComment = asyncHandler(async (req, res, next) => {
  // Make sure IDs provided are valid
  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Invalid post ID",
        id: req.params.postId,
      },
    });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Invalid comment ID",
        id: req.params.commentId,
      },
    });
  }

  // Check that post exists
  const postExists = await Post.exists({ _id: req.params.postId });
  if (!postExists) {
    return res.status(404).json({
      error: {
        code: 404,
        message: "Post not found",
      },
    });
  }

  // Retrieve the comment
  const comment = await Comment.findById(req.params.commentId).exec();
  if (!comment) {
    return res.status(404).json({
      error: {
        code: 404,
        message: "Comment not found",
      },
    });
  }
  res.status(201).json({ message: "Success", comment });
});

exports.updatePostComment = [
  authorizer.canUpdateComment,
  ...validator.createUpdateCommentValidationRules(),
  validator.validate,
  asyncHandler(async (req, res, next) => {
    // Make sure IDs provided are valid
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid post ID",
          id: req.params.postId,
        },
      });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid comment ID",
          id: req.params.commentId,
        },
      });
    }

    // Check that post exists
    const postExists = await Post.exists({ _id: req.params.postId });
    if (!postExists) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Post not found",
        },
      });
    }

    // Retrieve the comment
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Comment not found",
        },
      });
    }

    // Make sure the current user is the comment's author
    if (!req.user._id.equals(comment.user._id)) {
      return res.status(401).json({
        error: {
          code: 401,
          message: "Unauthorized. Cannot edit someone else's comment",
        },
      });
    }

    // Update the comment
    comment.text = req.body.text;
    await comment.save();
    return res
      .status(200)
      .json({ message: "Successfully updated comment", comment });
  }),
];

exports.deletePostComment = [
  authorizer.canDeleteComment,
  asyncHandler(async (req, res, next) => {
    // Make sure IDs provided are valid
    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid post ID",
          id: req.params.postId,
        },
      });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid comment ID",
          id: req.params.commentId,
        },
      });
    }

    // Check that post exists
    const postExists = await Post.exists({ _id: req.params.postId });
    if (!postExists) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Post not found",
        },
      });
    }

    // Retrieve the comment
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Comment not found",
        },
      });
    }

    // Make sure the current user is the comment's author
    if (!req.user._id.equals(comment.user._id)) {
      return res.status(401).json({
        error: {
          code: 401,
          message: "Unauthorized. Cannot delete someone else's comment",
        },
      });
    }

    // Delete the comment
    await comment.save();
    return res.status(204).json({ message: "Successfully deleted comment" });
  }),
];
