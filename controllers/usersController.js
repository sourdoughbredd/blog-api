const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.signup = [
  // Validate/sanitize
  body("username")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 to 20 characters long")
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .matches(/^[A-Za-z0-9].*[A-Za-z0-9]$/)
    .withMessage("Username must start and end with a letter or number"),
  body("email", "Invalid email").trim().isEmail(),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and 8 characters in total."
    ),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        error: {
          code: 400,
          message: "Request validation failed",
          details: errors.array().map((err) => ({
            field: err.path,
            error: err.msg,
          })),
        },
      });
    }

    const { username, email, password } = req.body;

    // Check if email already in DB
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "A user with this email already exists.",
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

exports.login = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: login`);
};

exports.logout = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: logout`);
};

exports.getAllUsers = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get all users`);
};

exports.getUser = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get user ${req.params.userId}`);
};

exports.updateUser = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Update user ${req.params.userId}`);
};

exports.deleteUser = (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Delete user ${req.params.userId}`);
};
