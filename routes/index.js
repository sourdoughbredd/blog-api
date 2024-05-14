const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(200).json({
    message: "Welcome to the Blog API!",
    version: "1.0",
    documentation_url: "https://github.com/sourdoughbredd/blog-api",
    endpoints: {
      posts: "/posts",
      users: "/users",
    },
  });
});

module.exports = router;
