const TestingReport = require("../Models/TestingReportModel");

const addReport = async (req, res) => {
    try {
        const { productId } = req.params;
        const exists = await TestingReport.findOne({ productId });
        if (exists) {
            return res.status(400).json({ message: "Report already exists for this product" });
        }

        const report = await TestingReport.create({
            ...req.body,
            productId
        });

        res.status(201).json({
            message: "Testing report created",
            data: report
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating testing report",
            error: error.message
        });
    }
};

const getReportByProductId = async (req, res) => {
    try {
        const report = await TestingReport.findOne({ productId: req.params.productId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json({
            message: "Testing report found",
            data: report
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching testing report",
            error: error.message
        });
    }
};

module.exports = {
    addReport,
    getReportByProductId
};