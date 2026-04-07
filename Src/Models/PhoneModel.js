const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Excellent", "Good", "Fair", "Used"],
      default: "Used",
    },
    city: String,
    batteryHealth: String,
    defects: String,
    storage: String,
    color: String,
    images: [String],
    description: String,

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
    imeiNumber: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isSold: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Phone", phoneSchema);