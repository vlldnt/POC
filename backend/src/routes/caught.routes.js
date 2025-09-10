import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getPokemonsByGuide, addPokemon, deletePokemon } from "../controllers/caught.controller.js";

const router = Router();

router.post("/", verifyToken, addPokemon);
router.delete("/", verifyToken, deletePokemon);
router.get("/list/:guide_id", verifyToken, getPokemonsByGuide);

export default router