import express from "express";
import {
  addPhone,
  getAllPhones,
  getPhoneById,
  updatePhone,
  deletePhone,
  verifyImei,
  getSellerListings
} from "../Controllers/PhoneController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ GET all phones
router.get("/", getAllPhones);

// ✅ Seller listings
router.get("/seller-listings", protect, getSellerListings);

// ✅ Verify IMEI
router.post("/verify-imei", protect, verifyImei);

// ✅ GET phone by id
router.get("/:id", getPhoneById);

// ✅ ADD phone
router.post("/", protect, (req, res, next) => {
  const contentType = (req.headers["content-type"] || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return addPhone(req, res, next);
  }

  upload.array("images", 5)(req, res, (err) => {
    if (err) return next(err);
    addPhone(req, res, next);
  });
});

// ✅ UPDATE phone
router.put("/:id", protect, updatePhone);

// ✅ DELETE phone
router.delete("/:id", protect, deletePhone);

// ✅ IMAGE UPLOAD
router.post(
  "/upload",
  protect,
  upload.single("image"),
  (req, res) => {
    res.json({
      message: "Image uploaded",
      image: req.file.filename,
    });
  }
);

export default router;