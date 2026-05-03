const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: String,
  userId: String, // (later update)
});

module.exports = mongoose.model("Task", TaskSchema);