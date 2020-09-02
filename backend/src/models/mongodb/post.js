const { Schema, model } = require("mongoose");

let post_schema = new Schema({
  idUser:{type:String,required:[true,"id user is required"]},
  images: { type: String, required: [true, "id user is required"] },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  report: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const post = model("posts", post_schema);
module.exports = post;
