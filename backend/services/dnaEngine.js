const MARKERS = [
  "urgent","police","arrest","verify","bank","otp","job","courier",
  "payment","account","transfer","investment","loan","tax","fee"
];

function extractMarkers(text = "") {
  const low = text.toLowerCase();
  const found = new Set();
  for (const m of MARKERS) {
    const re = new RegExp(`\\b${m}\\b`, "i");
    if (re.test(low)) found.add(m);
  }
  return [...found];
}

function classifyScamType(markers, text = "") {
  const t = text.toLowerCase();
  if (/job|interview|hiring/.test(t)) return "Job Scam";
  if (/courier|parcel|delivery/.test(t)) return "Courier Fraud";
  if (/investment|profit|return/.test(t)) return "Investment Scam";
  if (/police|arrest|court/.test(t)) return "Digital Arrest";
  if (/bank|otp|account/.test(t)) return "Banking Scam";
  return "Other";
}

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

module.exports = {
  extractMarkers,
  classifyScamType,
  familySimilarity
};
