import request from "supertest";
import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

// Setup ephemeral in-memory SQLite DB
const sequelize = new Sequelize("sqlite::memory:", { logging: false });

// User model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Express app and routes
const app = express();
app.use(express.json());

// Controllers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameMaxLength = 20;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || username.length > usernameMaxLength) {
    return res
      .status(400)
      .json({ error: "Username must be max 20 characters" });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!password || !passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least 8 characters, contain one uppercase letter and one number",
      });
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, email, password: hashed });
    res
      .status(201)
      .json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["id", "username", "email"],
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "email"] });
  res.json(users);
});

app.patch("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { username, email, password } = req.body;
  if (username && username.length > usernameMaxLength) {
    return res
      .status(400)
      .json({ error: "Username must be max 20 characters" });
  }
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password && !passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least 8 characters, contain one uppercase letter and one number",
      });
  }
  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.json({ id: user.id, username: user.username, email: user.email });
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  await user.destroy();
  res.json({ message: "Account deleted" });
});

// Tests
beforeAll(async () => {
  await sequelize.sync({ force: true });
});
afterAll(async () => {
  await sequelize.close();
});

describe("User API (ephemeral DB)", () => {
  let userId;
  test("Create user with valid data", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        username: "adrien",
        email: "adrien@email.com",
        password: "Password1",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("adrien");
    userId = res.body.id;
  });

  test("Fail to create user with invalid email", async () => {
    const res = await request(app)
      .post("/users")
      .send({ username: "adrien2", email: "bademail", password: "Password1" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid email/);
  });

  test("Fail to create user with short password", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        username: "adrien3",
        email: "adrien3@email.com",
        password: "pass",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Password must be/);
  });

  test("Get user by ID", async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("adrien");
  });

  test("Update user profile", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ username: "adrienUpdated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("adrienUpdated");
  });

  test("Update with invalid username (too long)", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ username: "a".repeat(21) });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Username must be max 20 characters/);
  });

  test("Update with invalid email format", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ email: "bademail" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid email format/);
  });

  test("Update with invalid password format", async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ password: "nopass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Password must be at least 8 characters/);
  });

  test("Update with invalid user id", async () => {
    const res = await request(app)
      .patch(`/users/invalid-id-1234`)
      .send({ username: "test" });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/User not found/);
  });

  test("Delete user", async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account deleted");
  });

  test("Get deleted user returns 404", async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});
