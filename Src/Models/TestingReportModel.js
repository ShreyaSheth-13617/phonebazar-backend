const mongoose = require("mongoose");

const testingReportSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phone",
      required: true,
      unique: true
    },
    batteryHealth: {
      type: String,
      required: true
    },
    screenCondition: {
      type: String,
      required: true
    },
    cameraStatus: {
      type: String,
      required: true
    },
    overallScore: {
      type: Number,
      required: true
    },
    certification: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestingReport", testingReportSchema);