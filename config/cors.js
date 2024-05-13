require("dotenv").config();

const developmentOrigins = [process.env.DEV_FRONTEND_URL];
const productionOrigins = [
  process.env.BLOG_CLIENT_URL,
  process.env.BLOG_CMS_URL,
];

let allowedOrigins = [];

if (process.env.NODE_ENV === "development") {
  allowedOrigins = developmentOrigins;
} else if (process.env.NODE_ENV === "production") {
  allowedOrigins = productionOrigins;
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

module.exports = corsOptions;
