import { Caught } from "../models/caught.model.js";

// POST : Add a new caught pokemon
export const addPokemon = async (req, res) => {
  const { guide_id, pokemon_id } = req.body;
  if (!guide_id || !pokemon_id) {
    return res.status(400).json({ error: "Guide id and pokemon id required" });
  }

  try {
    const caught = await Caught.create({
      guide_id,
      pokemon_id,
    });
    res.status(201).json({ message: "Pokemon caught:", caught });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};