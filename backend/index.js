const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 in-memory database
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

// 📥 Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ➕ Add task
app.post("/tasks", (req, res) => {
  const task = {
    id: Date.now(),
    text: req.body.text
  };

  tasks.push(task);
  res.json(task);
});

// ❌ Delete task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.json({ ok: true });
});

/* =========================
   FOCUS SESSIONS (POMODORO)
========================= */

// ➕ increase focus session
app.post("/focus", (req, res) => {
  focusSessions++;
  res.json({ focusSessions });
});

// 📊 get focus sessions
app.get("/focus", (req, res) => {
  res.json({ focusSessions });
});

/* =========================
   START SERVER
========================= */
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`🚀 BeFocus API running on http://localhost:${PORT}`);
});