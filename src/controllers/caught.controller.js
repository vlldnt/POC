import { Caught } from "../models/caught.model.js";

// POST : Add a new caught pokemon
export const addPokemon = async (req, res) => {
    const { caught } = req.body;
    if (!caught) return res.status(400).Json({ error: "Pokemon id required"});

    try {
        const caught = await Caught.create({
            guide_id: `Pokemon ${caught} caught`,
            caught,
        });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};