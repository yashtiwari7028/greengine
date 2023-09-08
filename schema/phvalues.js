const mongoose = require("mongoose");

const phValueSchema = new mongoose.Schema({
  plant: String,
  date: Date,
  hour: Number,
  phValue: Number,
});

module.exports = mongoose.model("PhValue", phValueSchema);
