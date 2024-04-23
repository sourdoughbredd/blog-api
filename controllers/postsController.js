const authorizer = require("../middleware/authorization");

exports.getAllPosts = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get all posts");
};

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
