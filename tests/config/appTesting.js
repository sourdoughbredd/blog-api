const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const corsOptions = require("../../config/cors.js");

const indexRouter = require("../../routes/index.js");
const usersRouter = require("../../routes/users.js");
const postsRouter = require("../../routes/posts.js");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

// Connect to DB
// TO DO

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    error: {
      code: 404,
      message: "Not Found",
      detail: "The requested resource was not found on this server.",
    },
  });
});

// error handler
app.use(function (err, req, res, next) {
  // Uncaught error. Send general server error.
  const statusCode = err.status || 500; // Default to 500 if no specific status is set
  console.error(err); // Log the error for server-side diagnostics

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message: err.message || "Internal Server Error", // Use a generic message for 500 errors
    },
  });
});

module.exports = app;
