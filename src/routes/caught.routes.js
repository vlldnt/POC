import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addPokemon } from "../controllers/caught.controller.js";

const router = Router();

router.post("/", verifyToken, addPokemon);

export default router