require("dotenv").config();
const mongoose = require("mongoose");
const Incident = require("./models/Incident");
const FraudFamily = require("./models/FraudFamily");

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/crimescape";

const seedData = [
  {
    family: {
      label: "Job Offer Scam - Premium Positions",
      scamType: "Job Scam",
      coreMarkers: ["job", "interview", "hiring", "urgent", "payment", "fee"],
      threat_level: "CRITICAL",
      description: "Fraudsters impersonating HR departments and offering high-paying remote jobs",
      evolution_stage: "peak"
    },
    incidents: [
      {
        rawText: "Congratulations! You've been selected for a Senior Data Engineer role at Google. No interview needed! Just pay $99 for background verification.",
        platform: "LinkedIn",
        scamType: "Job Scam",
        location: "New Delhi",
        confidence: 0.92
      },
      {
        rawText: "URGENT: You are hired as a Virtual Assistant. Work from home, $5000/month. Click link to verify identity and pay processing fee NOW!",
        platform: "WhatsApp",
        scamType: "Job Scam",
        location: "Mumbai",
        confidence: 0.88
      },
      {
        rawText: "Microsoft hiring! $8000/month for customer support. Reply ASAP before position closes. Payment required to activate account.",
        platform: "SMS",
        scamType: "Job Scam",
        location: "Bangalore",
        confidence: 0.85
      }
    ]
  },
  {
    family: {
      label: "Banking OTP Fraud",
      scamType: "Banking Scam",
      coreMarkers: ["bank", "otp", "account", "verify", "urgent", "payment"],
      threat_level: "CRITICAL",
      description: "Phishing attempts to extract bank credentials and OTPs",
      evolution_stage: "peak"
    },
    incidents: [
      {
        rawText: "Your ICICI Bank account has suspicious activity. Click here to verify: bit.ly/verify-bank. Enter your OTP when prompted.",
        platform: "SMS",
        scamType: "Banking Scam",
        location: "Delhi",
        confidence: 0.95
      },
      {
        rawText: "HDFC Alert: Verify your account immediately. Your password will expire in 2 hours. https://hdfc-secure-verify.com",
        platform: "Email",
        scamType: "Banking Scam",
        location: "Unknown",
        confidence: 0.89
      },
      {
        rawText: "Your bank account is locked due to failed verification. Update payment method urgently to unlock.",
        platform: "WhatsApp",
        scamType: "Banking Scam",
        location: "Hyderabad",
        confidence: 0.91
      }
    ]
  },
  {
    family: {
      label: "Courier Package Fraud",
      scamType: "Courier Fraud",
      coreMarkers: ["courier", "parcel", "delivery", "payment", "urgent", "customs"],
      threat_level: "HIGH",
      description: "False delivery notifications claiming unpaid customs or fees",
      evolution_stage: "spreading"
    },
    incidents: [
      {
        rawText: "Your package from Amazon is held at customs. Pay $20 to release: https://kurrier-pay.com/release",
        platform: "SMS",
        scamType: "Courier Fraud",
        location: "Chennai",
        confidence: 0.87
      },
      {
        rawText: "FedEx: Your parcel requires customs clearance. Click here to pay: http://fedex-customs-clearance.net",
        platform: "WhatsApp",
        scamType: "Courier Fraud",
        location: "Pune",
        confidence: 0.84
      },
      {
        rawText: "DHL delivery failed. Your package is returning. Pay $15 for re-delivery or visit our office.",
        platform: "SMS",
        scamType: "Courier Fraud",
        location: "Kolkata",
        confidence: 0.82
      }
    ]
  },
  {
    family: {
      label: "Investment Fraud - Crypto Pump",
      scamType: "Investment Scam",
      coreMarkers: ["investment", "profit", "return", "guarantee", "urgent", "limited"],
      threat_level: "HIGH",
      description: "False investment schemes promising unrealistic returns",
      evolution_stage: "spreading"
    },
    incidents: [
      {
        rawText: "Invest $100, get $500 guaranteed return in 48 hours! Crypto trading bot proven 99.8% success rate. Limited slots!",
        platform: "Telegram",
        scamType: "Investment Scam",
        location: "Unknown",
        confidence: 0.90
      },
      {
        rawText: "Join our exclusive investment group. Minimum investment ₹50,000. 35% monthly returns. DM for details.",
        platform: "Instagram",
        scamType: "Investment Scam",
        location: "Unknown",
        confidence: 0.86
      }
    ]
  },
  {
    family: {
      label: "Digital Arrest Scam",
      scamType: "Digital Arrest",
      coreMarkers: ["police", "arrest", "court", "crime", "urgent", "verification"],
      threat_level: "CRITICAL",
      description: "Impersonating law enforcement threatening arrest for fake crimes",
      evolution_stage: "peak"
    },
    incidents: [
      {
        rawText: "This is CBI. A case has been filed against your Aadhaar. Reply with OTP sent to your email to verify identity.",
        platform: "WhatsApp",
        scamType: "Digital Arrest",
        location: "Noida",
        confidence: 0.94
      },
      {
        rawText: "URGENT: Crime branch alert. Your PAN number used in money laundering. Verify immediately or arrest warrant will be issued.",
        platform: "SMS",
        scamType: "Digital Arrest",
        location: "Gurgaon",
        confidence: 0.92
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await Incident.deleteMany({});
    await FraudFamily.deleteMany({});
    console.log("✓ Cleared existing data");

    // Seed families and incidents
    for (const data of seedData) {
      const family = await FraudFamily.create({
        ...data.family,
        cases: [],
        last_seen: new Date()
      });

      const incidentDocs = await Incident.insertMany(
        data.incidents.map(inc => ({
          ...inc,
          markers: data.family.coreMarkers,
          familyId: family._id,
          threat_level: family.threat_level,
          status: "active"
        }))
      );

      family.cases = incidentDocs.map(doc => doc._id);
      await family.save();
    }

    console.log(`✓ Seeded ${seedData.length} fraud families with incidents`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
