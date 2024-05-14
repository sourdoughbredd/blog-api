import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import corsOptions from "./config/cors.js";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.url, "public")));
app.use(cors(corsOptions));

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

export default app;
