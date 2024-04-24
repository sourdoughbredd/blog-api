const { authenticate } = require("./authentication");

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 401,
        message: "Unauthorized: You must be logged in to access this resource",
      },
    });
  }
  next();
};

const isAuthor = (req, res, next) => {
  if (!req.user.isAuthor) {
    return res.status(401).json({
      error: {
        code: 401,
        message:
          "Unauthorized: Must have Author privileges to access this resource",
      },
    });
  }
  next();
};

const isReferencedUser = (req, res, next) => {
  if (req.params.userId !== req.user._id.toString()) {
    return res.status(401).json({
      error: {
        code: 401,
        message: "Unauthorized: Cannot update other users' info",
      },
    });
  }
  next();
};

const isReferencedUserOrAuthor = (req, res, next) => {
  if (req.params.userId !== req.user._id && !req.user.isAuthor) {
    return res.status(401).json({
      error: {
        code: 401,
        message: "Unauthorized: Cannot delete other users",
      },
    });
  }
  next();
};

// USERS

exports.canGetAllUsers = [authenticate, isLoggedIn, isAuthor];

exports.canGetUser = [authenticate, isLoggedIn, isAuthor];

exports.canUpdateUser = [authenticate, isLoggedIn, isReferencedUser];

exports.canDeleteUser = [authenticate, isLoggedIn, isReferencedUserOrAuthor];

// POSTS

exports.canCreatePost = [authenticate, isLoggedIn, isAuthor];

exports.canUpdatePost = [authenticate, isLoggedIn, isAuthor];

exports.canDeletePost = [authenticate, isLoggedIn, isAuthor];

// COMMENTS

exports.canCreateComment = [authenticate, isLoggedIn];

exports.canUpdateComment = [authenticate, isLoggedIn]; // more done in controller after looking up comment

exports.canDeleteComment = [authenticate, isLoggedIn]; // more done in controller after looking up comment
