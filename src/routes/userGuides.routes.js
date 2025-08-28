import { Router } from "express";
import { addGuide } from "../controllers/userGuides.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, addGuide);

export default router;