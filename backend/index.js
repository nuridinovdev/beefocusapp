const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGO DB CONNECT
========================= */

const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
  console.log("❌ MONGO_URL is missing");
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB error:", err));
}

/* =========================
   TEMP DATABASE
========================= */

let tasks = [];
let focusSessions = 0;

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "🔥 BeFocus API is running",
    routes: ["/tasks", "/focus"]
  });
});

/* =========================
   TASKS API
========================= */

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    text: req.body.text
  };

  tasks.push(task);
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ ok: true });
});

/* =========================
   FOCUS API
========================= */

app.post("/focus", (req, res) => {
  focusSessions++;
  res.json({ focusSessions });
});

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