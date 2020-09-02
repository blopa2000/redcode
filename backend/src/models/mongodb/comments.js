const { Schema, model } = require("mongoose");

let comment_schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "author is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: [true, "post id is required"],
  },
  comment: {
    type: String,
    required: [true, "comment is required"],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const comment = model("comments", comment_schema);
module.exports = comment;
