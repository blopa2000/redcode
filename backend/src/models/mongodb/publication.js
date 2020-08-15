const {Schema,model} = require("mongoose");

let publication_schema = new Schema({
    idUser:{type:String,required:[true,"id user is required"]},
    images:{type:String,required:[true,"id user is required"]},
    description:{type:String},
    timestamp:{type:Date,default:Date.now},
    reactions:{type:Array},
    report:{type:Array},
});

const publicacion = model("publications",publication_schema);
module.exports = publicacion;