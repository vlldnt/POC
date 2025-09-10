import { UserGuide } from "../models/userGuide.model.js";

// POST a new guide
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

// GET all guides
export const getAllGuides = async (req, res) => {
  try {
    const { user_id, guide } = req.query;
    const { user_id: paramUserId, guide: paramGuide, user_name } = req.params;
    const where = {};

    // GET api/userGuides/:user_id with token
    if (req.user && paramUserId) {
      if (req.user.id !== paramUserId) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only access your own guides." });
      }
      where.user_id = paramUserId;
    } else if (paramUserId) {
      where.user_id = paramUserId;
    }
    if (paramGuide) {
      where.guide = paramGuide;
    }
    if (user_name) {
      const { User } = await import("../models/user.model.js");
      const user = await User.findOne({ where: { username: user_name } });
      if (user) {
        where.user_id = user.id;
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    }
    if (user_id) {
      where.user_id = user_id;
    }
    if (guide) {
      where.guide = guide;
    }
    const guides = await UserGuide.findAll({
      attributes: ["id", "user_id", "guide"],
      where,
    });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE guide if user connected (TOken)
export const deleteGuide = async (req, res) => {
  const { user_id, guide_id } = req.params;
  if (!req.user || req.user.id !== user_id) {
    return res
      .status(403)
      .json({ error: "Forbidden: You can only delete your own guides." });
  }
  try {
    const deleted = await UserGuide.destroy({
      where: {
        id: guide_id,
        user_id: user_id,
      },
    });
    if (deleted) {
      res.json({ message: "Guide deleted" });
    } else {
      res.status(404).json({ error: "Guide not found or not yours" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
