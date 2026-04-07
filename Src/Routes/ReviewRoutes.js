import express from "express";
import { addReview, getAllReviews, getReviewsByProduct } from "../Controllers/ReviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:productId", getReviewsByProduct);
router.post("/add", protect, addReview);

export default router;