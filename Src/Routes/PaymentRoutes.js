import express from 'express';
import { getAllPayments, addPayment, createOrder, verifyPayment, releasePayment } from '../Controllers/PaymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);

// GET all payments
router.get("/", getAllPayments);

// Release payment
router.put("/:id/release", protect, releasePayment);

// ADD payment
router.post("/", addPayment);

export default router;