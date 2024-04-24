const { body } = require("express-validator");

exports.createPostValidator = () => [
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
