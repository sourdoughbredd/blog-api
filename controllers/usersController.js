require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const authorizer = require("../middleware/authorization");
const validator = require("../middleware/validation");
const mongoose = require("mongoose");

// SIGNUP
exports.signup = [
  ...validator.createSignupValidationRules(),
  validator.validate,
  // Process the request
  asyncHandler(async (req, res, next) => {
    // Check validation

    const { username, email, password } = req.body;

    // Check if email already in DB
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "A user with this email already exists.",
        },
      });
    }

    // Check if username already taken
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "This username is not available.",
        },
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully." });
  }),
];

// LOGIN
exports.login = [
  ...validator.createLoginValidationRules(),
  validator.validate,
  // Process the request
  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    // Get user from DB and check password
    const user = await User.findOne({ username }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // User not found or password does not match
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    // All checks passed. Assign a JWT
    const accessToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    return res.status(200).json({
      message: "Login successful.",
      tokens: { accessToken, refreshToken },
    });
  }),
];

// REFRESH TOKEN
exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  // Grab refresh token
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Refresh token required",
      },
    });
  }
  try {
    // Extract payload and use to find user
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.user_id).exec();
    if (!user || refreshToken !== user.refreshToken) {
      // User not found or refresh token mismatch with DB.
      // This allows us to revoke refresh tokens by nullifying them in the DB
      return res.status(401).json({
        error: {
          code: 401,
          message: "Unauthorized: Invalid refresh token",
        },
      });
    }
    // Refresh the token
    const accessToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({ accessToken, message: "Access token refreshed." });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          code: 401,
          message: "Unauthorized: Expired refresh token",
        },
      });
    }
  }
});

// LOGOUT
exports.logout = asyncHandler(async (req, res, next) => {
  // Logout by deleting refreshToken from user so it can't be used again
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Refresh token required",
      },
    });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.user_id).exec();
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: "Successfully logged out." });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          code: 401,
          message: "Unauthorized: Expired refresh token",
        },
      });
    }
  }
});

exports.getAllUsers = [
  authorizer.canGetAllUsers,
  asyncHandler(async (req, res, next) => {
    const users = await User.find({}, "username email").exec();
    res.status(200).json({ message: "Success", users });
  }),
];

exports.getUser = [
  authorizer.canGetUser,
  asyncHandler(async (req, res, next) => {
    // Make sure ID provided is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid user ID",
          id: req.params.userId,
        },
      });
    }
    // Get user
    const user = await User.findById(req.params.userId, "username email");
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
    return res.status(200).json({ message: "Success", user });
  }),
];

exports.updateUser = [
  authorizer.canUpdateUser,
  ...validator.createUpdateUserValidationRules(),
  validator.validate,
  asyncHandler(async (req, res, next) => {
    // Make sure ID provided is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid user ID",
          id: req.params.userId,
        },
      });
    }

    // Find the user
    const user = await User.findById(req.params.userId).exec();
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }

    // Make sure new data was provided
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    if (
      (!newUsername || newUsername === user.username) &&
      (!newEmail || newEmail === user.email) &&
      !newPassword
    ) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Bad Request: No new data provided",
        },
      });
    }

    // Check if email already in DB
    const existingEmail = newEmail
      ? await User.findOne({ email: newEmail }).exec()
      : null;
    if (existingEmail && newEmail !== user.email) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "A user with this email already exists.",
        },
      });
    }

    // Check if username already taken
    const existingUser = newUsername
      ? await User.findOne({ username: newUsername }).exec()
      : null;
    if (existingUser && newUsername !== user.username) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "This username is not available.",
        },
      });
    }

    // All checks passed. Update user
    if (newUsername && newUsername !== user.username)
      user.username = newUsername;
    if (newEmail && newEmail !== user.email) user.email = newEmail;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "User updated successfully" });
  }),
];

exports.deleteUser = [
  authorizer.canDeleteUser,
  asyncHandler(async (req, res, next) => {
    // Make sure ID provided is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid user ID",
          id: req.params.userId,
        },
      });
    }

    // Delete the user
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "User not found",
        },
      });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  }),
];
