import authenticate from "./authentication.js";

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
const canGetAllUsers = [authenticate, isLoggedIn, isAuthor];
const canGetUser = [authenticate, isLoggedIn, isAuthor];
const canUpdateUser = [authenticate, isLoggedIn, isReferencedUser];
const canDeleteUser = [authenticate, isLoggedIn, isReferencedUserOrAuthor];

// POSTS
const canCreatePost = [authenticate, isLoggedIn, isAuthor];
const canUpdatePost = [authenticate, isLoggedIn, isAuthor];
const canDeletePost = [authenticate, isLoggedIn, isAuthor];

// COMMENTS
const canCreateComment = [authenticate, isLoggedIn];
const canUpdateComment = [authenticate, isLoggedIn]; // more done in controller after looking up comment
const canDeleteComment = [authenticate, isLoggedIn]; // more done in controller after looking up comment

// Export all
export {
  canGetAllUsers,
  canGetUser,
  canUpdateUser,
  canDeleteUser,
  canCreatePost,
  canUpdatePost,
  canDeletePost,
  canCreateComment,
  canUpdateComment,
  canDeleteComment,
};
