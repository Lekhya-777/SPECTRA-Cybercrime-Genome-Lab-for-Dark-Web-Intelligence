const express = require("express");
const router = express.Router();

const Incident = require("../models/Incident");
const FraudFamily = require("../models/FraudFamily");
const dnaEngine = require("../services/dnaEngine");
const intelEngine = require("../services/intelEngine");

// NOTE: some helper functions below were kept for similarity calculations
const MARKERS = [
  "urgent","police","arrest","verify","bank","otp","job","courier",
  "payment","account","transfer","investment","loan","tax","fee"
];

// Use dnaEngine helpers for markers and classification

function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/["'.,\/()\[\]:;<>?!\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function tf(tokens) {
  const m = {};
  tokens.forEach(t => (m[t] = (m[t] || 0) + 1));
  return m;
}

function cosine(a, b) {
  const terms = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, ma = 0, mb = 0;
  terms.forEach(k => {
    const x = a[k] || 0, y = b[k] || 0;
    dot += x * y; ma += x * x; mb += y * y;
  });
  if (!ma || !mb) return 0;
  return dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

function jaccard(a = [], b = []) {
  const sa = new Set(a), sb = new Set(b);
  const inter = [...sa].filter(x => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size;
  return uni ? inter / uni : 0;
}

function familySimilarity(fam, markers, text, famText) {
  const mj = jaccard(fam.coreMarkers || [], markers || []);
  const cos = cosine(tf(tokenize(famText)), tf(tokenize(text)));
  const score = 0.6 * mj + 0.4 * cos;
  return { score, markerJaccard: mj, textCosine: cos };
}

router.post("/", async (req, res) => {
  try {
    const { rawText, platform, phone, url } = req.body;

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: "Raw text is required" });
    }

    const markers = dnaEngine.extractMarkers(rawText);
    const scamType = dnaEngine.classifyScamType(markers, rawText);

    const families = await FraudFamily.find({ scamType });

    let best = null, bestScore = 0, breakdown = { mj: 0, cos: 0 };

    for (const fam of families) {
      const sim = familySimilarity(fam, markers, rawText, fam.sampleText || "");
      if (sim.score > bestScore) {
        best = fam; bestScore = sim.score; breakdown = sim;
      }
    }

    const MIN_SCORE = 0.50, MIN_MARKER = 0.35, MIN_TEXT = 0.25;

    let family;
    const strong =
      best &&
      bestScore >= MIN_SCORE &&
      (breakdown.markerJaccard >= MIN_MARKER ||
        breakdown.textCosine >= MIN_TEXT);

    if (strong) {
      family = best;
    } else {
      family = await FraudFamily.create({
        label: `${scamType}`,
        coreMarkers: markers,
        scamType,
        sampleText: rawText,
        cases: [],
        threat_level: "HIGH",
        last_seen: new Date()
      });
    }

    const incident = await Incident.create({
      rawText,
      platform: platform || "Unknown",
      phone: phone || "",
      url: url || "",
      markers,
      scamType,
      familyId: family._id,
      location: "Unknown",
      confidence: bestScore
    });

    family.cases.push(incident._id);
    family.last_seen = new Date();
    await family.save();

    // recompute intelligence for the family and persist
    const incidentsForFamily = await Incident.find({ familyId: family._id });
    try {
      const intel = await intelEngine.computeFromFamily(family, incidentsForFamily);
      family.risk = intel.risk;
      family.insights = intel.insights;
      family.actions = intel.actions;
      family.artifacts = intel.artifacts;
      await family.save();
    } catch (ie) {
      console.warn("Intel engine error:", ie && ie.message);
    }

    const populatedFamily = await FraudFamily.findById(family._id);
    const populatedIncident = await Incident.findById(incident._id);

    res.json({
      incident: populatedIncident,
      family: populatedFamily,
      linked: strong,
      confidence: (bestScore * 100).toFixed(1)
    });
  } catch (e) {
    console.error("Incident submission error:", e.message);
    res.status(500).json({ error: e.message || "Failed to process incident" });
  }
});

router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.find().populate("familyId").sort({ createdAt: -1 });
    res.json(incidents);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

router.get("/with-families", async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("familyId")
      .sort({ createdAt: -1 })
      .limit(100);

    const families = await FraudFamily.find()
      .populate("cases")
      .sort({ last_seen: -1 });

    res.json({ incidents, families });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;
