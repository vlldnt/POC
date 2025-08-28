import { UserGuide } from "../models/userGuide.model.js";

export const addGuide = async (req, res) => {
  const { guide } = req.body;
  if (!guide) return res.status(400).json({ error: "Guide name required" });

  try {
    const userGuide = await UserGuide.create({
      user_id: req.user.id,
      guide,
    });
    res.status(201).json({
      message: "Guide added",
      userGuide,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};