import "dotenv/config.js";

// Set up database connection
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const uri = process.env.MONGODB_URI;

async function connect() {
  try {
    console.log("Connecting to db...");
    await mongoose.connect(uri);
    console.log("Connected successfully.");
  } catch (err) {
    console.error("Database connection failed!", err);
  }
}

const connection = mongoose.connection;

async function disconnect() {
  try {
    console.log("Disconnecting from db...");
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (err) {
    console.error("Failed to disconnect cleanly", err);
    throw err; // Maintain consistency in error handling
  }
}

export default { connect, connection, disconnect };
