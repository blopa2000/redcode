const { Schema, model } = require("mongoose");
const uniqued = require("mongoose-unique-validator")


var posibles_valores = ["M", "F"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, "email is not valid"];

let user_schema = new Schema({
    username: { type: String, required: [true, "name is required"], unique: true },
    avatar: { type: String, default: "../../public/icons/default.jpg" },
    password: { type: String, minlength: [5, "very small password"] },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    email: { type: String, required: [true, "email is required"], match: email_match },
    timestamp: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    dateBirth: { type: Date, required: [true, "age is required"] },
    Location: {
        latitude: { type: Number, default: 0 },
        length: { type: Number, default: 0 },
    },
    sex: { type: String, enum: { values: posibles_valores, massage: "option is not valid" } }
});
//campo unico
user_schema.plugin(uniqued, { message: "Error,expected {PATH} to be unique" })

user_schema.virtual("fullname").
get(function() { return `${this.firstName} ${this.lastName}`; })
const user = model("users", user_schema);
module.exports = user;