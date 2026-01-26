/**
 * Simple rule-based intelligence engine for AuraScan.
 * Computes risk, insights, suggested actions and artifacts summary
 * based on family metadata and recent incidents. This is intentionally
 * lightweight and deterministic (no external AI or network calls).
 */

function uniqAndCompact(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

function computeRisk(family, incidents) {
  const caseCount = (incidents || []).length;
  let score = 0;

  // base score from number of cases
  if (caseCount >= 20) score += 40;
  else if (caseCount >= 10) score += 25;
  else if (caseCount >= 4) score += 12;

  // reused artifacts increase risk
  const phones = uniqAndCompact(incidents.map(i => i.phone));
  const urls = uniqAndCompact(incidents.map(i => i.url));

  if (phones.length > 3) score += 20;
  if (urls.length > 3) score += 20;

  // scam type severity heuristics
  const severe = ["Banking Scam", "Phishing", "Business Email Compromise", "Digital Arrest"];
  if (severe.includes(family.scamType)) score += 20;

  // clamp and map to label
  score = Math.min(100, score);

  if (score >= 70) return "CRITICAL";
  if (score >= 45) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}

function synthesizeInsights(family, incidents) {
  const insights = [];
  const caseCount = (incidents || []).length;

  insights.push(`Observed ${caseCount} case(s) linked to this family.`);

  if (family.scamType) {
    insights.push(`Scam profile: ${family.scamType}.`);
  }

  const urls = uniqAndCompact(incidents.map(i => i.url)).slice(0, 6);
  const phones = uniqAndCompact(incidents.map(i => i.phone)).slice(0, 6);

  if (urls.length) insights.push(`Reused URLs detected: ${urls.join(", ")}`);
  if (phones.length) insights.push(`Contact numbers reused: ${phones.join(", ")}`);

  // repeated phrases (token frequency)
  const tokens = {};
  (incidents || []).forEach(i => {
    const txt = (i.rawText || "").toLowerCase();
    txt.split(/[\s,.!?;:\-()]+/).filter(Boolean).forEach(t => {
      tokens[t] = (tokens[t] || 0) + 1;
    });
  });
  const phrases = Object.keys(tokens).sort((a,b) => tokens[b]-tokens[a]).slice(0,6);
  if (phrases.length) insights.push(`Frequently occurring tokens: ${phrases.slice(0,5).join(", ")}`);

  // short narrative
  insights.push(`This appears to be an active ${family.scamType || "scam"} campaign using urgency and centralized infrastructure.`);

  return insights;
}

function suggestActions(family, incidents) {
  const actions = [];
  const urls = uniqAndCompact(incidents.map(i => i.url));
  const phones = uniqAndCompact(incidents.map(i => i.phone));

  if (urls.length) actions.push("Initiate domain takedown for listed URLs");
  if (phones.length) actions.push("Request telecom trace for reused numbers");
  actions.push("Alert financial institutions and request blocklisting");
  actions.push("Collect additional samples and preserve evidence chain");

  return actions.slice(0, 5);
}

function collectArtifacts(family, incidents) {
  return {
    phones: uniqAndCompact(incidents.map(i => i.phone)).slice(0, 10),
    urls: uniqAndCompact(incidents.map(i => i.url)).slice(0, 10),
    phrases: uniqAndCompact(incidents.map(i => i.rawText)).slice(0, 10)
  };
}

async function computeFromFamily(family, incidents) {
  const risk = computeRisk(family, incidents);
  const insights = synthesizeInsights(family, incidents);
  const actions = suggestActions(family, incidents);
  const artifacts = collectArtifacts(family, incidents);

  return { risk, insights, actions, artifacts };
}

module.exports = {
  computeFromFamily
};
