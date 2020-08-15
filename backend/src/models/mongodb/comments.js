const { Schema, model } = require("mongoose");

let comment_schema = new Schema({
    author: { type: String, required: [true, "author is required"] },
    timestamp: { type: Date, default: Date.now },
    publicationId: { type: String, required: [true, "publicationId is required"] },
    comment: { type: String, required: [true, "comment is required"] },
    enabled: { type: Boolean, default: true },
});

const comment = model("comment", comment_schema)
module.exports = comment