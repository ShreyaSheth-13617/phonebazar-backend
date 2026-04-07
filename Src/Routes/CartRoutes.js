import express from "express";
import {
  addItem,
  getCart,
  removeItem,
  updateQuantity,
  clearCart
} from "../Controllers/CartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add to cart
router.post("/add", protect, addItem);

// ✅ Get cart
router.get("/", protect, getCart);

// ✅ Remove item
router.delete("/remove/:phoneId", protect, removeItem);

// ✅ Update quantity
router.patch("/item/:phoneId", protect, updateQuantity);

// ✅ Clear cart
router.post("/clear", protect, clearCart);

export default router;