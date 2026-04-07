const mongoose = require("mongoose")

const shipmentSchema = new mongoose.Schema({

    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    trackingNumber:{
        type:String,
        unique:true
    },
    shipmentStatus:{
        type:String,
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model("Shipment",shipmentSchema)