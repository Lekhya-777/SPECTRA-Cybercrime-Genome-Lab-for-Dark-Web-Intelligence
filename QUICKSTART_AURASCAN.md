# AuraScan Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites Check
```bash
node --version     # Should be v16+
npm --version      # Should be v8+
mongo --version    # Optional - only if using local MongoDB
```

### Step 1: Navigate to Project
```bash
cd c:\Users\LEKHYA\OneDrive\Desktop\CyberSprint
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm install        # First time only
npm start
```

Expected output:
```
╔════════════════════════════════════════════════╗
║     CRIMESCAPE-DNA INTELLIGENCE ENGINE         ║
║     Bureau-Grade Cyber Intelligence Console    ║
╚════════════════════════════════════════════════╝

🔐 Initializing secure connection to MongoDB...
📍 Target: mongodb://localhost:27017/crimescape

✓ Database connection established
✓ Intelligence vault initialized
✓ DNA analysis engine ready

╔════════════════════════════════════════════════╗
║  🟢 INTELLIGENCE ENGINE RUNNING ON PORT 5000     ║
║  📊 API: http://localhost:5000              ║
║  🔍 Health: http://localhost:5000/api/health║
╚════════════════════════════════════════════════╝
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend/crimescape-ui
npm install        # First time only
npm start
```

Expected output:
```
Compiled successfully!

You can now view crimescape-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.2.0.2:3000

webpack compiled successfully
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## 🎮 Using AuraScan

### What You'll See

1. **Header**: "AuraScan | System Status: SECURE | User: Analyst_01"
2. **Left Sidebar**: Menu items (Dashboard, Shadow Feed, Case Families, etc.)
3. **Center**: DarkPulse feed with live scrolling simulated dark web events
4. **Right Panel**: Case File inspector (select a family to view intelligence)

### Testing the System

#### Method 1: Submit via API (PowerShell)
```powershell
$json = @{
  rawText = "Urgent verify your banking OTP immediately"
  platform = "SMS"
  phone = "+91-9988776655"
  url = "https://fake-bank.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/incidents" `
  -Method Post `
  -ContentType "application/json" `
  -Body $json `
  -UseBasicParsing
```

#### Method 2: View Families
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/incidents/with-families" `
  -UseBasicParsing | 
  Select-Object -ExpandProperty Content
```

#### Method 3: Click in UI
1. Wait 10 seconds for InvestigationView to refresh
2. Click any family name in the right panel
3. View computed intelligence:
   - Risk level (LOW / MEDIUM / HIGH / CRITICAL)
   - AI-generated insights
   - Collected evidence (URLs, phones)
   - Suggested investigative actions

---

## 🛑 Stopping the System

**Terminal 1 (Backend)**: `Ctrl + C`  
**Terminal 2 (Frontend)**: `Ctrl + C`

---

## ⚙️ MongoDB Setup

### Local MongoDB (if not running)

**Windows**:
1. Install: https://www.mongodb.com/try/download/community
2. Start service: `net start MongoDB`

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux**:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Cloud MongoDB (MongoDB Atlas)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.net/crimescape`
4. Update `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.net/crimescape
   ```

---

## 📊 Key Concepts

### DarkPulse (Center Panel)
- **Simulated** dark web feed
- Events every 2-3 seconds
- **NOT** connecting to real dark web
- Purely for demonstration
- Format: `[HH:MM] Event Type – Details`

### BlackGenome (Right Panel)
- Fraud family clustering
- Groups incidents by "DNA" (shared markers)
- Shows family evolution stage

### GhostTrace (Evidence Section)
- Aggregated infrastructure artifacts
- URLs detected
- Phone numbers collected
- Repeated phrases identified

### Mindframe (AI Brief)
- Generated insights and narrative
- Rule-based (not ML)
- Suggested actions for investigation
- Risk assessment with justification

---

## 🔍 Understanding Risk Scores

**Risk Calculation**:
- **Case Count**: 1-3 cases = base points; 20+ cases = highest risk
- **Artifact Reuse**: Same phone/URL across multiple incidents = higher risk
- **Scam Severity**: Banking, Phishing, Digital Arrest, BEC = high severity
- **Final Score**: Mapped to LOW / MEDIUM / HIGH / CRITICAL

**Example**:
```
Family: Banking Scam with 5 cases + 2 reused phones + 3 reused URLs
Score: 12 (cases) + 20 (phones) + 20 (URLs) + 20 (severity) = 72
Risk Level: CRITICAL ⚠️
```

---

## 📝 Sample Test Data

Here are some scams to test with:

**Banking Phishing** (gets HIGH/CRITICAL risk):
```json
{
  "rawText": "URGENT: Verify your ICICI Bank account immediately. Click: http://verify.com. Enter OTP.",
  "platform": "SMS",
  "phone": "+91-98765-43210",
  "url": "http://verify.com"
}
```

**Job Scam** (gets MEDIUM/HIGH risk):
```json
{
  "rawText": "Congratulations! You're hired for remote job, $5000/month. Pay $99 verification fee.",
  "platform": "WhatsApp",
  "phone": "+91-88776655",
  "url": "http://jobscam.com"
}
```

**Courier Fraud** (gets MEDIUM risk):
```json
{
  "rawText": "Your Amazon package held at customs. Pay $20 fee to release.",
  "platform": "SMS",
  "phone": "+91-77665544",
  "url": "http://courier-pay.com"
}
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod --version

# Clear Node cache
rm -r backend/node_modules
npm install

# Try alternate port
PORT=8080 npm start
```

### Frontend shows blank page
```bash
# Clear cache and reinstall
rm -r frontend/crimescape-ui/node_modules
npm install

# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### DarkPulse feed not updating
- Check browser console (F12) for errors
- Verify React is loaded (no webpack errors)
- Refresh page (F5)

### InvestigationView empty
- Submit at least one incident first
- Wait 2-3 seconds for automatic refresh
- Check `/api/incidents/with-families` endpoint directly

---

## 📚 Documentation

Full details available in:
- `AURA_README.md` – Complete user guide
- `AURA_IMPLEMENTATION_SUMMARY.md` – Technical deep-dive

---

## ✅ System Health Check

Run this to verify everything is working:

```powershell
# Check backend health
curl http://localhost:5000/api/health

# Check frontend running
curl http://localhost:3000

# Fetch all families
curl http://localhost:5000/api/incidents/with-families
```

---

## 🎯 Next Steps

1. **Explore**: Browse existing families in InvestigationView
2. **Submit**: Add incidents to see intelligence computation
3. **Analyze**: Review insights and suggested actions
4. **Monitor**: Watch DarkPulse feed for continuous threat updates
5. **Deploy**: Follow AURA_README.md for production setup

---

**You're ready to analyze threats with AuraScan! 🚀**
