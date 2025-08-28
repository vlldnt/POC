import { User } from "../models/user.model.js";

// GET account
export const getProfile = (req, res) => {
  const { id, username, email } = req.user;
  res.json({ id, username, email });
};

// PATCH profile
export const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
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
