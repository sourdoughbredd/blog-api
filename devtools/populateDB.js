import "dotenv/config.js";
import { connect, disconnect } from "../config/database.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";

(async () => {
  try {
    await connect();

    const users = [
      new User({
        username: "brettbussell",
        email: "brettbussell@bb.com",
        password: "bwb123",
        isAuthor: true,
      }),
      // Add more users as needed
    ];

    const posts = [
      new Post({
        user: users[0]._id,
        title: "Hello Blog World",
        text: "This is my first blog post. I hope it goes well.",
        isPublished: true,
      }),
      // Add more posts as needed
    ];

    const comments = [
      // Add comments as needed
    ];

    // Save Data to DB
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    for (let user of users) {
      await user.save();
    }

    for (let post of posts) {
      await post.save();
    }

    for (let comment of comments) {
      await comment.save();
    }

    console.log("Database has been populated!");
  } catch (err) {
    console.error(err);
  } finally {
    await disconnect();
  }
})();
