const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    phoneId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Phone",
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model("Review",reviewSchema)