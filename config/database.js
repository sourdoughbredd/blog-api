require("dotenv").config();

// Set up database connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const uri = process.env.MONGODB_URI;

module.exports.connect = async () => {
  try {
    console.log("Connecting to db...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");
  } catch (err) {
    console.error("Database connection failed!", err);
  }
};

module.exports.connection = mongoose.connection;

module.exports.disconnect = async () => {
  try {
    console.log("Disconnecting from db...");
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (err) {
    console.error("Failed to disconnect cleanly", err);
    throw err; // Maintain consistency in error handling
  }
};
