import express from "express";
import {
  getAllOrders,
  getOrdersByUser,
  addOrder,
  updateOrder,
  getSellerOrders,
  updateShipmentStatus,
  getSellerStats
} from "../Controllers/OrderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User orders
router.get("/user", protect, getOrdersByUser);

// ✅ All orders (admin)
router.get("/", getAllOrders);

// ✅ Create order
router.post("/", protect, addOrder);

// ✅ Update order
router.put("/:id", protect, updateOrder);

// ✅ Update shipment status
router.put("/:id/shipment", protect, updateShipmentStatus);

// ✅ Seller orders
router.get("/seller-orders", protect, getSellerOrders);

// ✅ Seller stats
router.get("/seller-stats", protect, getSellerStats);

export default router;