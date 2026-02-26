import express from "express";
import { getUserProfile, updateUser, updatePreferences } from "../Controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", protect, getUserProfile);
router.put("/user", protect, updateUser);
router.put("/user/preferences", protect, updatePreferences);

export default router;
