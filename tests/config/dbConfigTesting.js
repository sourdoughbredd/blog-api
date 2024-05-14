const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server");

// This object will hold the reference to the in-memory server and connection
const mongoServerConfig = {
  mongoServer: null,
  mongoUri: null,
};

exports.initializeMongoServer = async function () {
  // Create the MongoMemoryServer instance
  mongoServerConfig.mongoServer = await MongoMemoryServer.create();
  mongoServerConfig.mongoUri = mongoServerConfig.mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(mongoServerConfig.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.error(e);
      mongoose.connect(mongoServerConfig.mongoUri);
    }
    console.error(e);
  });

  mongoose.connection.once("open", () => {
    console.log(
      `MongoDB successfully connected to ${mongoServerConfig.mongoUri}`
    );
  });
};

exports.closeDatabase = async function () {
  // Close the connection and stop the server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServerConfig.mongoServer.stop();
};
