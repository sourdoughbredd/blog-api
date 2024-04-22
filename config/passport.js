require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const User = require("../models/user");

// Set up options for JWT strategy
const JWT_SECRET = process.env.JWT_SECRET;
const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(options, (payload, done) => {
  // Find user using payload subject
  User.findById(payload.user_id)
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});

passport.use(strategy);

module.exports = passport;
