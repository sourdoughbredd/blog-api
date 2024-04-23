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
