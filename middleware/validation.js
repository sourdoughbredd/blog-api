const { body, validationResult } = require("express-validator");

// Error handling middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
  next();
};

// USERS

exports.createSignupValidationRules = () => [
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
];

exports.createLoginValidationRules = () => [
  body("username", "Username is required").trim().notEmpty(),
  body("password", "Password is required").trim().notEmpty(),
];

exports.createUpdateUserValidationRules = () => [
  body("username")
    .trim()
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 to 20 characters long")
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .matches(/^[A-Za-z0-9].*[A-Za-z0-9]$/)
    .withMessage("Username must start and end with a letter or number"),
  body("email", "Invalid email").trim().optional().isEmail(),
  body("password")
    .trim()
    .optional()
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
];

// POSTS

exports.createPostValidationRules = () => [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title must not be empty")
    .isString()
    .withMessage("title must be a string")
    .isLength({ max: 50 })
    .withMessage("title cannot be more than 50 characters"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("text must not be empty")
    .isString()
    .withMessage("text must be a string")
    .isLength({ max: 12000 })
    .withMessage("text cannot be more than 12,000 characters"),
  body("isPublished", "isPublished must be a boolean").isBoolean(),
];