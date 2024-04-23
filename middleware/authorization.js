const { authenticate } = require("./authentication");

const isLoggedIn = authenticate;

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

exports.canGetAllUsers = [isLoggedIn, isAuthor];

exports.canGetUser = [isLoggedIn, isAuthor];

exports.canUpdateUser = [isLoggedIn, isReferencedUser];

exports.canDeleteUser = [isLoggedIn, isReferencedUserOrAuthor];

// COMMENTS

exports.canPostComment = isLoggedIn;
