const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role:{
        type:String,
        default:"Buyer",
        enum:["Buyer","Seller","Admin"]
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Active",
        enum:["Active","Inactive","Blocked","Deleted"]
    },
    resetToken:{
        type:String
    },
    resetTokenExpire:{
        type:Date
    }
})
module.exports = mongoose.model("User",userSchema)