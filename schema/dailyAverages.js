const mongoose = require("mongoose");

const dailyAverageSchema = new mongoose.Schema({
  plant: String,
  date: Date,
  averagePhValue: Number,
});

module.exports = mongoose.model("DailyAverage", dailyAverageSchema);
