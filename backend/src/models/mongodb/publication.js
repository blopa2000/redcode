const { Schema, model } = require("mongoose");

let publication_schema = new Schema({
  // idUser:{type:String,required:[true,"id user is required"]},
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

const publicacion = model("publications", publication_schema);
module.exports = publicacion;
