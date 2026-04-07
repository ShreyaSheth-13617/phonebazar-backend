const router = require('express').Router();
const reportController = require('../Controllers/TestingReportController');

// GET report by productId
router.get("/:productId", reportController.getReportByProductId);

// ADD report for productId (Assuming Admin only via logic or another middleware; currently just open or will add protect if needed)
router.post("/:productId", reportController.addReport);

module.exports = router;