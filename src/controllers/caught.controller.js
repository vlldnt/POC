import { Caught } from "../models/caught.model.js";

// POST : Add a new caught pokemon
export const addPokemon = async (req, res) => {
  let { guide_id, pokemon_id } = req.body;
  if (!guide_id || pokemon_id === undefined) {
    return res.status(400).json({ error: "Guide id and pokemon id required" });
  }

  // Format pokemon_id string of 3 numbers
  pokemon_id = pokemon_id.toString().padStart(3, "0");

  // format validation
  if (!/^[0-9]{3}$/.test(pokemon_id) || Number(pokemon_id) < 1 || Number(pokemon_id) > 151) {
    return res.status(400).json({ error: "pokemon_id must be a string from '001' to '151'" });
  }

  try {
    const caught = await Caught.create({
      guide_id,
      pokemon_id,
    });
    res.status(201).json({ message: `Pokemon caught: ${pokemon_id}` });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: `Pokemon ${pokemon_id} already caught` });
    }
    res.status(500).json({ error: err.message });
  }
};