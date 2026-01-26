const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  rawText: { type: String, required: true },
  platform: { type: String, default: "Unknown" },
  phone: String,
  url: String,
  markers: [String],
  scamType: String,
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "FraudFamily" },
  location: { type: String, default: "Unknown" },
  confidence: { type: Number, default: 0 },
  threat_level: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "HIGH" },
  status: { type: String, enum: ["active", "resolved", "monitoring"], default: "active" },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model("Incident", IncidentSchema);
