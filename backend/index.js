require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Task = require("./models/Task");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DEBUG
========================= */
console.log("🔍 MONGO_URL:", process.env.MONGO_URL);

/* =========================
   MONGO DB CONNECT
========================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🟢 MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

/* =========================
   HOME
========================= */
app.get("/", (req, res) => {
  res.json({
    message: "🔥 BeFocus API is running",
    routes: ["/register", "/login", "/tasks"],
  });
});

/* =========================
   AUTH ROUTES
========================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   TASKS (REAL DB)
========================= */

// GET ALL TASKS
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// CREATE TASK
app.post("/tasks", async (req, res) => {
  try {
    const { text, userId } = req.body;

    const task = await Task.create({
      text,
      userId,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 BeFocus API running on port ${PORT}`);
});