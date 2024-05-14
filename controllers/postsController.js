import Post from "../models/post.js";
import Comment from "../models/comment.js";
import {
  canCreatePost,
  canUpdatePost,
  canDeletePost,
} from "../middleware/authorization.js";
import authenticate from "../middleware/authentication.js";
import {
  createPostValidationRules,
  createUpdatePostValidationRules,
  validate,
} from "../middleware/validation.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

const getAllPosts = [
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

const createPost = [
  canCreatePost,
  ...createPostValidationRules(),
  validate,
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

const getPost = [
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

const updatePost = [
  canUpdatePost,
  ...createUpdatePostValidationRules(),
  validate,
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

const deletePost = [
  canDeletePost,
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

const postsController = {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};

export default postsController;
