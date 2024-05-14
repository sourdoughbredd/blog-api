import express from "express";
const router = express.Router();

import postsController from "../controllers/postsController.js";
import commentsController from "../controllers/commentsController.js";

router.get("/", postsController.getAllPosts);

router.post("/", postsController.createPost);

router.get("/:postId/comments", commentsController.getPostComments);

router.post("/:postId/comments", commentsController.createPostComment);

router.get("/:postId/comments/:commentId", commentsController.getPostComment);

router.put(
  "/:postId/comments/:commentId",
  commentsController.updatePostComment
);

router.delete(
  "/:postId/comments/:commentId",
  commentsController.deletePostComment
);

router.get("/:postId", postsController.getPost);

router.put("/:postId", postsController.updatePost);

router.delete("/:postId", postsController.deletePost);

export default router;
