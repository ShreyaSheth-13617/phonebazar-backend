const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    phoneId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Phone",
        required:true
    },
    quantity:{
        type:Number,
        default:1,
        min:1
    },
    orderDate:{
        type:Date,
        required:true
    },
    orderStatus:{
        type:String,
        required:true
    },
    shippingInfo:{
        type:mongoose.Schema.Types.Mixed
    },
    paymentMethod:{
        type:String
    },
    totalAmount:{
        type:Number
    },
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shipmentStatus: {
        type: String,
        default: "Pending"
    },
    deliveryType: {
        type: String,
        enum: ["Normal", "Insured"],
        default: "Normal"
    },
    returnEligible: {
        type: Boolean,
        default: false
    }

},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema)