exports.getPostComments = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get comments for post ${req.params.postId}`);
};

exports.createPostComment = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Create comment for post ${req.params.postId}`);
};

exports.getPostComment = (req, res, next) => {
  res.send(
    `NOT IMPLEMENTED: Get comment ${req.params.commentId} for post ${req.params.postId}`
  );
};

exports.updatePostComment = (req, res, next) => {
  res.send(
    `NOT IMPLEMENTED: Update comment ${req.params.commentId} for post ${req.params.postId}`
  );
};

exports.deletePostComment = (req, res, next) => {
  res.send(
    `NOT IMPLEMENTED: Delete comment ${req.params.commentId} for post ${req.params.postId}`
  );
};
