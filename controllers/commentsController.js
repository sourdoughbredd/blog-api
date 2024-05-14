import Comment from "../models/comment.js";
import Post from "../models/post.js";
import asyncHandler from "express-async-handler";
import {
  canCreateComment,
  canUpdateComment,
  canDeleteComment,
} from "../middleware/authorization.js";
import {
  createCommentValidationRules,
  createUpdateCommentValidationRules,
  validate,
} from "../middleware/validation.js";
import mongoose from "mongoose";

const getPostComments = asyncHandler(async (req, res, next) => {
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
    .sort({ timestamp: -1 })
    .exec();
  res.status(200).json({ message: "Success", comments });
});

const createPostComment = [
  canCreateComment,
  ...createCommentValidationRules(),
  validate,
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

const getPostComment = asyncHandler(async (req, res, next) => {
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
  const comment = await Comment.findById(req.params.commentId)
    .populate("user", "username")
    .exec();
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

const updatePostComment = [
  canUpdateComment,
  ...createUpdateCommentValidationRules(),
  validate,
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

const deletePostComment = [
  canDeleteComment,
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
    await Comment.findByIdAndDelete(comment._id).exec();
    return res.status(200).json({ message: "Successfully deleted comment" });
  }),
];

const commentsController = {
  getPostComments,
  createPostComment,
  getPostComment,
  updatePostComment,
  deletePostComment,
};

export default commentsController;
