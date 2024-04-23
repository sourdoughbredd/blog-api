const { authenticate } = require("./authentication");

exports.isLoggedIn = authenticate;

exports.isAuthor = (req, res, next) => {
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

exports.canUpdateUser = (req, res, next) => {
  if (req.params.userId !== req.user._id) {
    return res.status(401).json({
      error: {
        code: 401,
        message: "Unauthorized: Cannot update other users' info",
      },
    });
  }
  next();
};

exports.canDeleteUser = (req, res, next) => {
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
