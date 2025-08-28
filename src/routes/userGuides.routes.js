import { Router } from "express";
import { addGuide, getAllGuides } from "../controllers/userGuides.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { deleteGuide } from "../controllers/userGuides.controller.js";

const router = Router();

router.post("/", verifyToken, addGuide);
router.get("/all", getAllGuides);
router.get("/:user_id", verifyToken, getAllGuides);
router.get("/guide/:guide", getAllGuides);
router.get("/username/:user_name", getAllGuides);
router.delete("/:user_id/:guide_id", verifyToken, deleteGuide);

export default router;