const passport = require("../config/passport");

// Authentication will fail if user not found in DB or if the refresh token in
// their user record has been revoked (nullified)
exports.authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user || user.refreshToken === null) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  })(req, res, next);
};
