import express from "express";
import { createUser } from "../controllers/userController.js";
import { verifyToken, managerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, managerOnly, createUser);

export default router;