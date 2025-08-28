import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile, deleteProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);
router.delete("/", verifyToken, deleteProfile);

export default router;
