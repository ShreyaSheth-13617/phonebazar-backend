const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({

    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMode:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model("Payment",paymentSchema)