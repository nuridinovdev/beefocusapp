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
    routes: [
      "/register",
      "/login",
      "/tasks"
    ]
  });
});

/* =========================
   AUTH ROUTES
========================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({
      message: "✅ User registered",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Wrong password"
      });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login success",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =========================
   TASK ROUTES
========================= */

// GET ALL TASKS
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// CREATE TASK
app.post("/tasks", async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Task text is required"
      });
    }

    const task = await Task.create({
      text,
      userId
    });

    res.json(task);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      ok: true
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 BeFocus API running on port ${PORT}`);
});