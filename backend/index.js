require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DEBUG (optional but useful)
========================= */
console.log("🔍 MONGO_URL:", process.env.MONGO_URL);

/* =========================
   MONGO DB CONNECT
========================= */

const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
  console.log("❌ MONGO_URL is missing");
} else {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("🟢 MongoDB connected"))
    .catch((err) => console.log("❌ MongoDB error:", err));
}

/* =========================
   TEMP DATABASE (RAM)
========================= */

let tasks = [];
let focusSessions = 0;

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "🔥 BeFocus API is running",
    routes: ["/tasks", "/focus"],
  });
});

/* =========================
   TASKS API
========================= */

// GET tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// CREATE task
app.post("/tasks", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "text is required" });
  }

  const task = {
    id: Date.now(),
    text: req.body.text,
  };

  tasks.push(task);
  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id != req.params.id);
  res.json({ ok: true });
});

/* =========================
   FOCUS API
========================= */

// increase focus session
app.post("/focus", (req, res) => {
  focusSessions++;
  res.json({ focusSessions });
});

// get focus sessions
app.get("/focus", (req, res) => {
  res.json({ focusSessions });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 BeFocus API running on port ${PORT}`);
});