import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({
    message: "Welcome to the Blog API!",
    version: "1.0",
    documentation_url: "https://github.com/sourdoughbredd/blog-api",
    endpoints: {
      posts: "/posts",
      users: "/users",
    },
  });
});

export default router;
