const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Connect to DB
const db = require("./config/database");
db.connect().catch((err) => console.log(err));

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
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Optionally include the stack trace in development mode
    },
  });
});

module.exports = app;
