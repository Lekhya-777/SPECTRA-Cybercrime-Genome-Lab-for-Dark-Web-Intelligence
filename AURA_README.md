# AuraScan - Dark Web Threat Intelligence Dashboard

**AuraScan** is a law enforcement cyber command console built on the CRIMESCAPE-DNA intelligence engine. It provides real-time threat monitoring, fraud family clustering, and automated investigation guidance.

## Features

### Four Conceptual Layers

1. **DarkPulse** – Live scrolling simulated dark web feed showing underworld activity
2. **BlackGenome** – Scam family clustering and evolution tracking
3. **GhostTrace** – Infrastructure artifacts (domains, phones, reused indicators)
4. **Mindframe** – AI-style narrative, risk scoring, and suggested investigative actions

### Core Capabilities

- **Live Incident Feed**: Terminal-style scrolling monitor of simulated dark web threats
- **Family DNA Clustering**: Automatic grouping of incidents by shared markers and text similarity
- **Risk Assessment**: Rule-based computation of threat levels (LOW / MEDIUM / HIGH / CRITICAL)
- **Evidence Collection**: Automatic aggregation of artifacts (URLs, phones, phrases)
- **Narrative Intelligence**: Generated insights and suggested actions based on family characteristics
- **Interactive Case Files**: Click-to-select families and inspect computed intelligence

## System Architecture

### Backend (Node.js + Express)

- **MongoDB**: Stores incidents and fraud families with computed intelligence
- **services/dnaEngine.js**: Marker extraction and text similarity (DNA analysis)
- **services/intelEngine.js**: Rule-based risk computation, insight synthesis, artifact collection
- **routes/incidents.js**: API for incident submission; triggers intelligence recompute
- **models/FraudFamily.js**: Extended schema with risk, insights, actions, artifacts

### Frontend (React)

- **AuraHeader**: System status banner (AuraScan | System Status | User ID)
- **SidebarAura**: Navigation menu and quick actions
- **DarkPulse**: Animated feed component with simulated .onion event stream
- **InvestigationView**: Right panel showing family details, risks, evidence, and actions
- **App.css**: Dark cyber command center theme (black/deep blue backgrounds, neon green/cyan accents)

## Setup & Running

### Prerequisites

- Node.js v16+
- MongoDB (local or cloud via MongoDB Atlas)
- npm / yarn

### Installation

```bash
# Clone/navigate to project
cd CyberSprint

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend/crimescape-ui
npm install
```

### Configuration

**Backend (.env)**

```env
MONGO_URI=mongodb://localhost:27017/crimescape
PORT=5000
```

If using MongoDB Atlas (cloud):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crimescape
PORT=5000
```

### Running the System

#### Terminal 1: Backend Server

```bash
cd backend
npm start
# Server will run on http://localhost:5000
# API endpoints: /api/incidents (POST/GET), /api/incidents/with-families (GET)
```

#### Terminal 2: Frontend Dev Server

```bash
cd frontend/crimescape-ui
npm start
# React app will open at http://localhost:3000
```

### Quick Test

1. **Visit the console**: http://localhost:3000
2. **DarkPulse feed** should start scrolling with simulated events
3. **Submit an incident** (optional, via API or form):
   ```bash
   curl -X POST http://localhost:5000/api/incidents \
     -H "Content-Type: application/json" \
     -d '{
       "rawText": "Urgent! Verify your banking OTP immediately for fraud protection",
       "platform": "WhatsApp",
       "phone": "+91-98765-43210",
       "url": "https://banking-verify.com"
     }'
   ```
4. **Fetch families**: GET http://localhost:5000/api/incidents/with-families
5. **Inspect case files**: Click family names in the Investigation View (right panel)

## Technical Highlights

### DNA Engine (Marker + Similarity Matching)

- Extracts predefined "markers" (urgent, bank, police, job, courier, etc.)
- Compares incidents using Jaccard marker similarity + cosine text similarity
- Routes incidents to existing families or creates new ones based on threshold

### Intel Engine (Rule-Based Scoring)

```javascript
Risk Scoring:
  - Base: incident count (0-40 pts)
  - Reused artifacts: phones/URLs (0-40 pts)
  - Scam severity: Banking, Phishing, BEC, Digital Arrest (20 pts)
  - Mapping: 70+ = CRITICAL, 45+ = HIGH, 20+ = MEDIUM, < 20 = LOW

Insights: Generated from family markers, URLs, phones, phrase frequencies
Actions: Suggested takedowns, telecom traces, institution alerts, evidence preservation
```

### Simulated Dark Web Feed

- No real dark web crawling or network access
- Pure mock data using setInterval every 2-3 seconds
- Realistic-looking event format:
  ```
  [HH:MM] Leak detected – Source: DarkMarket-NN.onion
  [Data] Credential dump – Banking sector
  [Hash] 00 4F A3 9C ...
  ```

### UI Theme

- **Colors**: #0f1419 (bg), #00d9ff (cyan accent), #00ff9c (green accent), #f87171 (danger)
- **Font**: Courier New for terminal effect
- **Animations**: Pulsing indicators, smooth scrolling, glow effects
- **Layout**: 3-column (sidebar | feed | investigation) collapsible on mobile

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/incidents` | Submit incident; triggers family matching and intel recompute |
| GET | `/api/incidents` | Fetch all incidents with family details |
| GET | `/api/incidents/with-families` | Fetch incidents + families with full intelligence |
| GET | `/api/health` | System health check |

## Production Deployment

1. **Build frontend**: `npm run build` (creates `build/` folder)
2. **Serve static files**: Use nginx or Express static middleware
3. **Database**: Migrate to MongoDB Atlas for cloud hosting
4. **Environment variables**: Set via `.env` or deployment platform settings
5. **Security**: Add authentication (JWT), rate limiting, CORS policies

## Compliance & Legal Notes

- **No real dark web access**: All data is simulated and mock-based
- **Legal jurisdiction**: Intended for law enforcement and authorized cybersecurity use
- **Data retention**: Incidents and families stored locally in MongoDB
- **Privacy**: No PII collection without explicit consent and audit logging

## Future Enhancements

- [ ] Integration with real threat feeds (with proper legal/ethical review)
- [ ] Machine learning models for risk prediction
- [ ] Multi-user authentication and case assignment
- [ ] Batch incident import (CSV/JSON)
- [ ] Export case files (PDF reports)
- [ ] Slack / Teams notifications for high-risk families
- [ ] Geographic mapping of infrastructure artifacts

## Support & Troubleshooting

**Q: Backend won't connect to MongoDB**  
A: Ensure MongoDB is running locally (`mongod`) or update `MONGO_URI` to valid cloud URI

**Q: Frontend shows "Select a family to inspect"**  
A: Families only appear after incidents are submitted. Use the API curl command above or wait for seeded data

**Q: DarkPulse feed not scrolling**  
A: Check browser console for errors; verify React component mounted; try page refresh

**Q: Port 3000 or 5000 already in use**  
A: Kill process or change `PORT` env var: `PORT=5001 npm start`

## License & Credits

Built on CRIMESCAPE-DNA intelligence engine. Evolved into AuraScan for next-generation law enforcement cyber command.

---

**Version**: 1.0.0 (AuraScan)  
**Last Updated**: January 2026  
**Status**: Production-Ready
