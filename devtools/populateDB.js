require("dotenv").config();
const db = require("../config/database");

const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

db.connect().catch((err) => console.log(err));

const users = [
  new User({
    username: "brettbussell",
    email: "brettbussell@bb.com",
    password: "bwb123",
    isAuthor: true,
  }),
  new User({
    username: "johndoe",
    email: "john.doe@example.com",
    password: "abc123",
    isAuthor: false,
  }),
  new User({
    username: "janedoe",
    email: "jane.doe@example.com",
    password: "123abc",
    isAuthor: false,
  }),
];

// Sample Messages
const posts = [
  new Post({
    user: users[0]._id,
    title: "Hello Blog World",
    text: "This is my first blog post. I hope it goes all.",
    isPublished: true,
  }),
  new Post({
    user: users[0]._id,
    title: "Another thought",
    text: "I hope you have a good night, or a good day, and a good life.",
    isPublished: true,
  }),
  new Post({
    user: users[0]._id,
    title: "I love populating DBs!",
    text: "Populating DBs with dummy data is an exhilirating exercise in programming prowess! Don't you agree?",
    isPublished: true,
  }),
  new Post({
    user: users[0]._id,
    title: "An unfinished thought...",
    text: "You know, I was thinking the other day, that if we as a society just accepted the fact that...",
    isPublished: false,
  }),
];

const comments = [
  // Post 1: No comments

  // Post 2: One comment
  new Comment({
    post: posts[1]._id,
    user: users[1]._id,
    text: "Thought-provoking indeed!",
    timestamp: new Date(),
  }),

  // Post 3: Multiple comments
  new Comment({
    post: posts[2]._id,
    user: users[2]._id,
    text: "Absolutely agree with you!",
    timestamp: new Date(),
  }),
  new Comment({
    post: posts[2]._id,
    user: users[0]._id,
    text: "This is fascinating, more posts like this please!",
    timestamp: new Date(),
  }),
  new Comment({
    post: posts[2]._id,
    user: users[1]._id,
    text: "Can't wait to see what you write next!",
    timestamp: new Date(),
  }),
];

// Save Data to DB
const saveData = async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

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
  db.disconnect();
};

saveData().catch(console.error);
