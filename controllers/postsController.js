exports.getAllPosts = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Get all posts");
};

exports.createPost = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Post");
};

exports.getPost = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get post ${req.params.postId}`);
};

exports.updatePost = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Update post ${req.params.postId}`);
};

exports.deletePost = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Delete post ${req.params.postId}`);
};
