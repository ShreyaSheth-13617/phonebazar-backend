const shipmentSchema = require('../Models/ShipmentModel')

const getAllShipments = async (req,res)=>{
    try{

        const shipments = await shipmentSchema.find().populate("orderId")

        res.json({
            message:"All shipments",
            data:shipments
        })

    }catch(error){
        res.status(500).json({
            message:"Error fetching shipments",
            error:error.message
        })
    }
}

const addShipment = async (req,res)=>{
    try{

        const shipment = await shipmentSchema.create(req.body)

        res.status(201).json({
            message:"Shipment created",
            data:shipment
        })

    }catch(error){
        res.status(400).json({
            message:"Error creating shipment",
            error:error.message
        })
    }
}

module.exports = {getAllShipments,addShipment}