const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const commentsController = require("../controllers/commentsController");

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

module.exports = router;
