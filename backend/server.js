require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const incidentRoutes = require("./routes/incidents");

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "CRIMESCAPE-DNA Intelligence Engine Active" });
});

// Routes
app.use("/api/incidents", incidentRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/crimescape";

console.log("\n╔════════════════════════════════════════════════╗");
console.log("║     CRIMESCAPE-DNA INTELLIGENCE ENGINE         ║");
console.log("║     Bureau-Grade Cyber Intelligence Console    ║");
console.log("╚════════════════════════════════════════════════╝\n");

console.log("🔐 Initializing secure connection to MongoDB...");
console.log(`📍 Target: ${MONGO}\n`);

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✓ Database connection established");
    console.log("✓ Intelligence vault initialized");
    console.log("✓ DNA analysis engine ready\n");

    app.listen(PORT, () => {
      console.log(`╔════════════════════════════════════════════════╗`);
      console.log(`║  🟢 INTELLIGENCE ENGINE RUNNING ON PORT ${PORT}     ║`);
      console.log(`║  📊 API: http://localhost:${PORT}              ║`);
      console.log(`║  🔍 Health: http://localhost:${PORT}/api/health║`);
      console.log(`╚════════════════════════════════════════════════╝\n`);
    });
  })
  .catch((err) => {
    console.error("✗ Database connection failed:");
    console.error("  Error:", err.message);
    console.error("\n⚠️  Make sure MongoDB is running:");
    console.error("     mongod --dbpath /path/to/data\n");
    process.exit(1);
  });

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("Unhandled error:", err);
});
