const { Schema, model } = require("mongoose");
const uniqued = require("mongoose-unique-validator");

var possible_values = ["M", "F"];
var email_match = [
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
  "Email is not valid",
];

let user_schema = new Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  avatar: {
    type: String,
    default: "../../public/images/icons/default.jpg",
  },
  password: {
    type: String,
    minlength: [5, "very small password"],
    required: [true, "Password is required"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: email_match,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  dateBirth: {
    type: Date,
  },
  Location: {
    latitude: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
  },
  sex: {
    type: String,
    enum: { values: possible_values, massage: "option is not valid" },
  },
  publications: [
    {
      type: Schema.Types.ObjectId,
      ref:"publications"
    },
  ],
});
//campo unico
user_schema.plugin(uniqued, { message: "Error,expected {PATH} to be unique" });

user_schema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
const user = model("users", user_schema);
module.exports = user;
