import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
