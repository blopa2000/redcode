const {Schema,model} = require("mongoose");

let follows_schema = new Schema({
  idUser:{type:String,require:[true,"id user is required"]},
  follows:{type:Array},
});

const follows = model("follows",follows_schema);
module.exports = follows;