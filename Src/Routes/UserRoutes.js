import express from "express";
import userController from "../Controllers/UserController.js";

const router = express.Router();

// POST register
router.post("/register", userController.registerUser);

// POST login
router.post("/login", userController.loginUser);

// forgot password
router.post("/forgot-password", userController.forgotPassword);

// reset password
router.post("/reset-password/:token", userController.resetPassword);

// GET all users
router.get("/", userController.getAllUsers);

// GET user by id
router.get("/:id", userController.getUserById);

// UPDATE user
router.put("/:id", userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

export default router;