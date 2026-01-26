# ⚡ CRIMESCAPE-DNA Quick Start (60 Seconds)

## What You Have

A **professional cyber-intelligence console** for tracking scam evolution with:
- 🧠 AI-powered DNA marker extraction
- 📊 Real-time network visualization
- 🎯 Automatic fraud family linking
- 🌙 Bureau-grade dark UI

## Prerequisites Check

```bash
# Verify Node.js installed
node --version        # Should be v16+

# Verify MongoDB running
mongod --version      # Should work

# If MongoDB not running:
# Windows: services.msc → start "MongoDB"
# macOS:   brew services start mongodb-community
# Linux:   sudo systemctl start mongodb
```

## Run (2 Commands)

### Terminal 1: Backend
```bash
cd backend
npm install
npm run seed
npm start
```

You should see:
```
🟢 INTELLIGENCE ENGINE RUNNING ON PORT 5000
```

### Terminal 2: Frontend
```bash
cd frontend/crimescape-ui
npm install
npm start
```

Browser will open to `http://localhost:3000`

## What You See

1. **Top Bar**: Status indicator (green = ACTIVE)
2. **Left Panel**: Form to submit suspicious messages
3. **Center**: Interactive graph with nodes (incident dots)
4. **Right Panel**: Details of selected incident

## Try It

### Test Case 1: Job Scam
Paste in left panel:
```
You've been hired! Work from home, $5000/month. Pay $100 for training fee.
```
→ Should link to "Job Offer Scam" family (HIGH threat)

### Test Case 2: Banking Fraud
```
Your bank account locked. Verify here immediately with OTP: https://fake-site.com
```
→ Should link to "Banking OTP Fraud" family (CRITICAL threat)

### Test Case 3: Investment Scam
```
Invest $500, get $5000 guaranteed return in 48 hours. Crypto algorithm proven 99% success!
```
→ Links to "Investment Fraud" family (HIGH threat)

## See It Work

1. **Click a node** → Details appear in right panel
2. **Watch the graph** → Animates in real-time
3. **Submit incident** → New node appears instantly
4. **Notifications** → Shows if linked to existing family

## API (Advanced)

```bash
# Get all incidents
curl http://localhost:5000/api/incidents

# Check server health
curl http://localhost:5000/api/health

# Submit via curl (if curious)
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "rawText": "Scam message here",
    "platform": "WhatsApp"
  }'
```

## Files to Know

| File | Does What |
|------|-----------|
| `backend/services/dnaEngine.js` | Analyzes text, extracts markers, calculates similarity |
| `backend/routes/incidents.js` | API endpoints |
| `backend/seed.js` | Populates database with examples |
| `frontend/src/App.js` | Main orchestration |
| `frontend/src/App.css` | All styling (dark theme, animations) |
| `frontend/src/components/IntelligenceGraph.js` | Canvas graph rendering |

## Troubleshooting

### Port Error
```bash
# Kill process on port 5000
Windows: netstat -ano | findstr :5000 → taskkill /PID <PID> /F
Mac/Linux: lsof -i :5000 → kill -9 <PID>
```

### MongoDB Error
```bash
# Start MongoDB
Windows: net start MongoDB
Mac:     brew services start mongodb-community
Linux:   sudo systemctl start mongodb
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ **System Running** → Check above
2. 📖 **Read Docs** → `README.md` for features
3. 🧪 **Test More** → Try different scam types
4. 🔧 **Customize** → Edit DNA engine markers
5. 🚀 **Deploy** → See SETUP.md for production

## Key Concepts

| Term | Meaning |
|------|---------|
| **DNA Marker** | Keywords/patterns extracted from scam text |
| **Family** | Group of similar scams linked together |
| **Lineage** | Evolution of a fraud family over time |
| **Confidence** | % match when linking incident to family (0-100%) |
| **Threat Level** | Risk (CRITICAL=red, HIGH=orange, MEDIUM=yellow, LOW=green) |

## Success Indicators

✅ Backend running on port 5000  
✅ Frontend compiled at port 3000  
✅ Graph shows seeded incidents  
✅ Form submits without errors  
✅ Clicking nodes updates inspector  
✅ New incidents appear on graph  

## Real-World Usage

Law enforcement can:
- 👮 Submit reported scam messages
- 📊 See patterns & connections automatically
- 🧬 Identify emerging fraud families
- 📈 Track evolution of scam tactics
- 🚨 Alert on CRITICAL threats
- 📁 Build case files against rings

---

**That's it! You're running a professional cyber-intelligence system.**

Questions? Check `README.md` or `SETUP.md`

*CRIMESCAPE-DNA: Visualizing cybercrime evolution in real time.*
