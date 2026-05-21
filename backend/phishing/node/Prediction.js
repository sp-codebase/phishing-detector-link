const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  url: { type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
