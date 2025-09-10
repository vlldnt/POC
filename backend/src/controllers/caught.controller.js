import { Caught } from "../models/caught.model.js";
import { UserGuide } from "../models/userGuide.model.js";


// GET : All pokemon caught by user guide (with owner check)
export const getPokemonsByGuide = async (req, res) => {
  const { guide_id } = req.params;
  const user_id = req.user.id;

  if (!guide_id) {
    return res.status(400).json({ error: "Guide not found" });
  }

  const guide = await UserGuide.findOne({ where: { id: guide_id, user_id } });
  if (!guide) {
    return res.status(403).json({ error: "Access denied to this guide" });
  }

  try {
    const pokemons = await Caught.findAll({
      where: { guide_id },
      attributes: ["pokemon_id"],
      order: [["pokemon_id", "ASC"]],
    });

    res.json({
      guide_id,
      pokemons: pokemons.map(p => p.pokemon_id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST : Add a new caught pokemon
export const addPokemon = async (req, res) => {
  let { guide_id, pokemon_id } = req.body;
  const user_id = req.user.id;

  if (!guide_id || pokemon_id === undefined) {
    return res.status(400).json({ error: "Guide id and pokemon id required" });
  }

  const guide = await UserGuide.findOne({ where: { id: guide_id, user_id } });
  if (!guide) {
    return res.status(403).json({ error: "Access denied to this guide" });
  }

  pokemon_id = pokemon_id.toString().padStart(3, "0");

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

// DELETE : Remove a caught pokemon for the connected user and guide
export const deletePokemon = async (req, res) => {
  const { guide_id, pokemon_id } = req.body;
  const user_id = req.user.id;

  if (!guide_id || !pokemon_id) {
    return res.status(400).json({ error: "Guide id and pokemon id required" });
  }

  const guide = await UserGuide.findOne({ where: { id: guide_id, user_id } });
  if (!guide) {
    return res.status(403).json({ error: "Access denied to this guide" });
  }

  const formattedId = pokemon_id.toString().padStart(3, "0");

  try {
    const deleted = await Caught.destroy({
      where: {
        guide_id,
        pokemon_id: formattedId,
      },
    });

    if (deleted) {
      return res.json({ message: `Pokemon ${formattedId} deleted from guide` });
    } else {
      return res.status(404).json({ error: `Pokemon ${formattedId} not found in guide` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};