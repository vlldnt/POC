import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.json({
      message: "User registered",
      user: { id: user.id, username, email },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyTokenEndpoint = (req, res) => {
  res.json({ message: "Token is valid", user: { id: req.user.id, email: req.user.email, username: req.user.username } });
};

