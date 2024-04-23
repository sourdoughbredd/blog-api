const passport = require("../config/passport");

// Authentication will fail if user not found in DB or if the refresh token in
// their user record has been revoked (nullified)
exports.authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user || user.refreshToken === null) {
      return res.status(401).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
