import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { UserGuide } from "../models/userGuide.model.js";

User.hasMany(UserGuide, { foreignKey: "user_id" });
UserGuide.belongsTo(User, { foreignKey: "user_id" });


// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email"]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "username", "email"] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET account
export const getProfile = (req, res) => {
  const { id, username, email } = req.user;
  res.json({ id, username, email });
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameMaxLength = 20;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// PATCH profile
export const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  // Validation
  if (username && username.length > usernameMaxLength) {
    return res.status(400).json({ error: "Username must be max 20 characters" });
  }
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password && !passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be at least 8 characters, contain one uppercase letter and one number" });
  }

  if (username) req.user.username = username;
  if (email) req.user.email = email;
  if (password) req.user.password = await bcrypt.hash(password, 10);
  await req.user.save();
  res.json({
    message: "Profile updated",
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

// DELETE account
export const deleteProfile = async (req, res) => {
  await req.user.destroy();
  res.json({ message: "Account deleted" });
};
