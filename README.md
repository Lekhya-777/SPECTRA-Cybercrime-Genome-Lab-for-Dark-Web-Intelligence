# 🔐 SPECTRA – Cybercrime Genome Lab for Dark Web Intelligence

A professional, full-stack web application for law enforcement to visualize and track how cybercrime scams evolve in real-time. This system uses AI-powered "DNA markers" to automatically link incidents to fraud families and detect emerging lineages.

## 🎯 Overview

CRIMESCAPE-DNA transforms scattered scam reports into a **living map of cybercrime evolution**. Each new incident is analyzed, assigned genetic markers (keywords, patterns), and automatically linked to existing fraud families or forms a new one.

**The UI feels like a national cyber intelligence command center, not a student project.**

## ✨ Key Features

### Intelligence Engine
- **DNA Marker Extraction**: Automatically identifies emotional triggers, keywords, and patterns
- **Scam Classification**: Categorizes incidents as Job Scam, Banking Fraud, Courier Fraud, Investment Scam, Digital Arrest, etc.
- **Lineage Linking**: Uses Jaccard similarity + TF-IDF cosine similarity to link incidents to families
- **Confidence Scoring**: Real-time confidence percentages (0-100%) for each link

### Professional UI/UX
- **Dark Command-Center Theme**: Sophisticated cybersecurity aesthetic
- **Live Network Graph**: Interactive visualization with pulsing nodes and animated connections
- **Incident Form**: Smooth, responsive form with character count and platform selection
- **Intelligence Inspector**: Detailed view of selected incidents and fraud families
- **System Status**: Real-time health indicator showing "ACTIVE", "INITIALIZING", or "ALERT"
- **Responsive Design**: Works on laptops, tablets, and mobile devices

### Real-Time Features
- Auto-refresh intelligence network every 15 seconds
- Smooth animations and glow effects on high-threat incidents
- Live update notifications when new lineages are detected
- Color-coded threat levels (RED=CRITICAL, ORANGE=HIGH, YELLOW=MEDIUM, GREEN=LOW)

## 📁 Project Structure

```
CyberSprint/
├── backend/
│   ├── models/
│   │   ├── Incident.js           # Incident schema with threat levels
│   │   └── FraudFamily.js         # Fraud family schema with evolution stages
│   ├── routes/
│   │   └── incidents.js           # API endpoints (POST, GET, GET with-families)
│   ├── services/
│   │   └── dnaEngine.js           # DNA marker extraction & similarity matching
│   ├── server.js                  # Express server with CORS & MongoDB
│   ├── seed.js                    # Database seeder with 5 realistic families
│   ├── package.json
│   └── .env (create this)
│
└── frontend/
    └── crimescape-ui/
        ├── src/
        │   ├── components/
        │   │   ├── IncidentForm.js              # Left panel: incident submission
        │   │   ├── IntelligenceGraph.js         # Center: canvas-based graph
        │   │   ├── IntelligenceInspector.js     # Right panel: detailed view
        │   │   └── SystemStatus.js              # Top bar: status indicator
        │   ├── App.js                           # Main layout & data orchestration
        │   ├── App.css                          # Complete dark theme styling
        │   └── index.js
        └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB running locally (or remote URI)
- Port 5000 (backend) and 3000 (frontend) available

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
echo 'PORT=5000' > .env
echo 'MONGO_URI=mongodb://localhost:27017/crimescape' >> .env

# Seed realistic scam data
npm run seed

# Start server
npm start
```

Expected output:
```
╔════════════════════════════════════════════════╗
║     CRIMESCAPE-DNA INTELLIGENCE ENGINE         ║
║     Bureau-Grade Cyber Intelligence Console    ║
╚════════════════════════════════════════════════╝

🟢 INTELLIGENCE ENGINE RUNNING ON PORT 5000
```

### 2. Setup Frontend

```bash
cd ../frontend/crimescape-ui

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📊 API Endpoints

### POST /api/incidents
Submit a new suspicious message for analysis.

**Request:**
```json
{
  "rawText": "You've won a prize! Click here to claim: https://fake-site.com",
  "platform": "WhatsApp",
  "phone": "+91-9876543210",
  "url": "https://fake-site.com"
}
```

**Response:**
```json
{
  "incident": {
    "_id": "507f1f77bcf86cd799439011",
    "rawText": "You've won a prize...",
    "platform": "WhatsApp",
    "markers": ["prize", "click", "claim"],
    "scamType": "Investment Scam",
    "confidence": 0.89,
    "threat_level": "HIGH"
  },
  "family": {
    "_id": "507f1f77bcf86cd799439012",
    "label": "Investment Scam",
    "scamType": "Investment Scam",
    "cases": ["507f1f77bcf86cd799439011"],
    "threat_level": "CRITICAL"
  },
  "linked": true,
  "confidence": "89.0"
}
```

### GET /api/incidents
Get all incidents.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "rawText": "...",
    "platform": "WhatsApp",
    "markers": [...],
    "scamType": "Job Scam",
    "createdAt": "2026-01-23T10:30:00.000Z"
  }
]
```

### GET /api/incidents/with-families
Get incidents and fraud families together (used by frontend).

**Response:**
```json
{
  "incidents": [...],
  "families": [...]
}
```

## 🧬 DNA Engine Explained

### Marker Extraction
The engine looks for common scam keywords:
- Emotional triggers: "urgent", "verify", "confirm"
- Crime references: "police", "arrest", "court"
- Financial terms: "bank", "otp", "payment", "investment"
- Job-related: "job", "interview", "hiring"
- Delivery: "courier", "parcel", "delivery"

### Scam Type Classification
- **Job Scam**: Contains "job", "interview", "hiring"
- **Courier Fraud**: Contains "courier", "parcel", "delivery"
- **Investment Scam**: Contains "investment", "profit", "return"
- **Digital Arrest**: Contains "police", "arrest", "court"
- **Banking Scam**: Contains "bank", "otp", "account"

### Similarity Matching
For each new incident:
1. **Jaccard Similarity** (40% weight): Compares marker sets
   - Formula: |A ∩ B| / |A ∪ B|
2. **TF-IDF Cosine Similarity** (60% weight): Compares text tokens
   - Formula: (A·B) / (|A||B|)
3. **Combined Score**: 0.6 × Jaccard + 0.4 × Cosine

### Thresholds
- MIN_SCORE: 0.50 (50%)
- MIN_MARKER: 0.35 (35% marker overlap)
- MIN_TEXT: 0.25 (25% text similarity)

If incident meets thresholds → **linked to family** ✓  
Otherwise → **new family created** ⚡

## 🎨 UI/UX Design

### Color Scheme
- **Primary Background**: #0f1419 (deep navy)
- **Secondary Background**: #1a2332 (slightly lighter)
- **Accent**: #00d9ff (cyan glow)
- **Threat Colors**:
  - CRITICAL: #dc2626 (red)
  - HIGH: #f87171 (light red)
  - MEDIUM: #fbbf24 (amber)
  - LOW: #4ade80 (green)

### Typography
- Monospace font for technical elements
- Uppercase labels for command-center feel
- Letter-spacing for data density

### Animations
- **Pulse**: Status indicator
- **Scan**: Loading animation
- **Glow**: CRITICAL threat nodes
- **Slide**: Panel entrances
- **Fade**: Opacity transitions

## 📱 Responsive Breakpoints

- **1400px+**: Full 3-panel layout (left, center, right)
- **1200px-1399px**: Stacked layout with center expanded
- **768px-1199px**: Mobile-optimized with collapsed panels
- **<768px**: Full-screen stacked layout

## 🔒 Security Features

- CORS configured for localhost
- Input validation on all API endpoints
- Error handling with descriptive messages
- No sensitive data in responses

## 🧪 Testing

### Manual Testing
1. Open `http://localhost:3000`
2. Paste scam messages in the left panel
3. Watch incidents appear on the graph
4. Click nodes to inspect details
5. Check response notifications

### Test Cases
Pre-seeded data includes:
- 5 major fraud families
- 14 realistic incidents
- Different platforms (WhatsApp, SMS, Email, etc.)
- Various threat levels

Try submitting:
```
"Congratulations! You've won $1000. Click here to claim prize urgently!"
→ Links to "Investment Scam" family with high confidence

"Your bank account requires verification. Enter OTP now."
→ Links to "Banking Scam" family with critical threat

"You're hired as Virtual Assistant. Pay $100 for training fee."
→ Links to "Job Scam" family
```

## 📈 Scalability

Current implementation supports:
- 100+ concurrent incidents
- 20+ fraud families
- Real-time updates via polling (refactor to WebSocket for production)
- MongoDB indexing on dates and scam types

For production:
1. Switch to WebSocket for real-time updates
2. Add authentication & role-based access
3. Implement data export (CSV, reports)
4. Add dashboard analytics
5. Deploy with Docker
6. Use reverse proxy (nginx)

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm start          # Run server
npm run seed       # Seed database
npm run dev        # Run with nodemon (auto-reload)
```

**Frontend:**
```bash
npm start          # Start dev server
npm run build      # Production build
npm test           # Run tests
```

### Modifying DNA Engine

Edit `backend/services/dnaEngine.js`:
- Change MARKERS array to add/remove keywords
- Modify MIN_SCORE thresholds
- Adjust Jaccard/Cosine weights

### Adding Scam Types

1. Add to `classifyScamType()` in dnaEngine.js:
```javascript
if (/keyword1|keyword2/.test(t)) return "New Scam Type";
```

2. Update seed.js with examples

3. Frontend will auto-detect and color-code

## 📝 Environment Variables

**`.env` (backend):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/crimescape
NODE_ENV=development
```

**CORS Origins** (in server.js):
```javascript
origin: ["http://localhost:3000", "http://127.0.0.1:3000"]
```

## 🎓 Learning Resources

- **Similarity Algorithms**: Jaccard index, TF-IDF cosine similarity
- **Data Structures**: Sets, maps, graphs
- **Real-time UI**: Canvas API, requestAnimationFrame
- **REST API**: Express routing, mongoose ORM
- **Crime Analysis**: Pattern recognition, clustering

## 🚨 Limitations & Future Work

### Current
- Polling-based updates (15s interval)
- Single-user interface
- No persistence of selections
- Limited graph layout algorithm

### Future Enhancements
1. **WebSocket Integration**: Real-time updates via Socket.io
2. **User Authentication**: Role-based access control
3. **Advanced Analytics**: Trend analysis, predictive modeling
4. **Machine Learning**: Use ML model instead of similarity scoring
5. **Map Integration**: Show geographic distribution
6. **Report Generation**: Export incidents & families
7. **Alert System**: Notify on CRITICAL threats
8. **Team Collaboration**: Share analysis with team members

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Verify MongoDB is running: `mongod`
3. Check backend logs at `http://localhost:5000/api/health`
4. Ensure ports 3000 & 5000 are available

## 📄 License

Built as a professional cyber-intelligence system for law enforcement.

---

**CRIMESCAPE-DNA v1.0.0**  
*"Visualizing cybercrime evolution in real time."*
