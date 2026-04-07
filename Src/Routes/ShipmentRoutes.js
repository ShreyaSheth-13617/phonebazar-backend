const router = require('express').Router();
const shipmentController = require('../Controllers/ShipmentController')

// GET all shipments
router.get("/", shipmentController.getAllShipments)

// ADD shipment
router.post("/", shipmentController.addShipment)

module.exports = router;