const mongoose = require("mongoose");

const FraudFamilySchema = new mongoose.Schema({
  label: { type: String, required: true },
  coreMarkers: [String],
  scamType: { type: String, index: true },
  sampleText: String,
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Incident" }],
  // existing threat indicator (kept for compatibility)
  threat_level: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "HIGH" },
  // computed risk label used by AuraScan
  risk: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
  description: String,
  last_seen: { type: Date, default: Date.now },
  evolution_stage: { type: String, enum: ["emerging", "spreading", "peak", "declining"], default: "emerging" },
  // Narrative insights produced by intel engine
  insights: { type: [String], default: [] },
  // Suggested actions for investigators
  actions: { type: [String], default: [] },
  // Artifacts aggregated across cases
  artifacts: {
    phones: { type: [String], default: [] },
    urls: { type: [String], default: [] },
    phrases: { type: [String], default: [] }
  },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model("FraudFamily", FraudFamilySchema);
