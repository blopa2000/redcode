const { Schema, model } = require("mongoose");

let follows_schema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  follows: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const follows = model("follows", follows_schema);
module.exports = follows;
