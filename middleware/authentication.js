// const passport = require("passport");

// Load the passport configuration
const passport = require("../config/passport");

// Authenticate JWT with passport
function authenticate(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      // Valid token
      req.user = user;
      res.locals.currentUser = user;
    } else {
      // Invalid token
      res.locals.currentUser = null;
    }

    next();
  })(req, res, next);
}

module.exports = authenticate;
