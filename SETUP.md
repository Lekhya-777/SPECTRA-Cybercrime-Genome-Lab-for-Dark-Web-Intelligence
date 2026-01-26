# CRIMESCAPE-DNA Setup & Installation Guide

## System Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: v16 or higher
- **MongoDB**: v4.4 or higher (local or remote)
- **RAM**: 2GB minimum
- **Disk**: 500MB free space

## Prerequisites Installation

### 1. Install Node.js

**Windows/macOS/Linux:**
- Download from https://nodejs.org/
- Install LTS version (v20+)
- Verify: `node --version` & `npm --version`

### 2. Install MongoDB

**Option A: Local MongoDB**

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer, choose "Install as a Service"
3. Start service: `net start MongoDB`
4. Verify: `mongod --version`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/crimescape`
4. Update backend `.env` with this URI

## Installation Steps

### Step 1: Clone/Navigate to Project

```bash
cd /path/to/CyberSprint
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB URI
echo PORT=5000 > .env
echo MONGO_URI=mongodb://localhost:27017/crimescape >> .env
```

**Windows (PowerShell):**
```powershell
@"
PORT=5000
MONGO_URI=mongodb://localhost:27017/crimescape
"@ | Out-File -Encoding UTF8 .env
```

### Step 3: Seed Database

```bash
npm run seed
```

Expected output:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Seeded 5 fraud families with incidents
```

### Step 4: Start Backend Server

```bash
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
║  📊 API: http://localhost:5000                ║
║  🔍 Health: http://localhost:5000/api/health ║
╚════════════════════════════════════════════════╝
```

### Step 5: Frontend Setup (New Terminal)

```bash
cd frontend/crimescape-ui

# Install dependencies
npm install

# Start development server
npm start
```

The app will automatically open at `http://localhost:3000`

## Verification

### Test Backend API

```bash
# Check health status
curl http://localhost:5000/api/health

# Should return:
# {"status":"CRIMESCAPE-DNA Intelligence Engine Active"}

# Fetch incidents
curl http://localhost:5000/api/incidents

# Should return array of incidents
```

### Test Frontend

1. Open `http://localhost:3000` in browser
2. Should see:
   - Green status indicator "ACTIVE"
   - Dark command-center UI
   - Central graph with nodes
   - Left panel with "ADD INCIDENT" form
   - Right panel with "INTELLIGENCE" inspector

## Troubleshooting

### MongoDB Connection Error

**Error:**
```
✗ Database connection failed:
  Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Ensure MongoDB is running:
   - Windows: Check Services for "MongoDB"
   - macOS: `brew services list | grep mongodb`
   - Linux: `sudo systemctl status mongodb`
2. Start if not running:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongodb`

### Port Already in Use

**Port 5000 in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Port 3000 in use:**
```bash
# Kill existing React process
pkill -f "react-scripts"
```

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error in Frontend

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:** Verify backend `server.js` has:
```javascript
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
```

### Database Empty (No Incidents Showing)

```bash
# Re-seed database
cd backend
npm run seed
```

## Configuration

### Backend `.env` File

```env
# Server Port
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/crimescape

# Optional: For production
NODE_ENV=production
```

### Frontend CORS

If running frontend on different port, update `server.js`:
```javascript
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
```

## Running in Production

### Backend

1. Build & deploy to server
2. Set environment variables:
   ```bash
   export PORT=5000
   export MONGO_URI=<production_mongodb_uri>
   export NODE_ENV=production
   ```
3. Start with process manager:
   ```bash
   npm install -g pm2
   pm2 start server.js --name crimescape
   ```

### Frontend

1. Build optimized bundle:
   ```bash
   npm run build
   ```
2. Deploy `build/` folder to web server (nginx, Apache, Vercel, etc.)
3. Update API endpoint in code if needed

## Docker Deployment (Optional)

**Dockerfile for Backend:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t crimescape-backend .
docker run -p 5000:5000 -e MONGO_URI=<uri> crimescape-backend
```

## Next Steps

1. ✅ Verify system is running
2. 📝 Read main README.md for features & usage
3. 🧪 Test with sample data (see Testing section)
4. 🔧 Customize DNA engine markers (see Customization)
5. 🚀 Deploy to production

## Support

**Still having issues?**

1. Check terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure no port conflicts
4. Check MongoDB is accessible
5. Review browser console (F12) for frontend errors

**Helpful Commands:**
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"

# Clear npm cache if install fails
npm cache clean --force
```

---

**Installation Complete!**  
Your CRIMESCAPE-DNA system is now ready to analyze and track cybercrime scams.
