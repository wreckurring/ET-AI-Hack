# RAKSHA-NET: AI Cyber Fraud Intelligence Platform (India)

**RAKSHA-NET** is an enterprise-grade AI Cyber Fraud Intelligence, Spatial Analytics, and Fast-Freeze Operations Platform designed for Indian Law Enforcement Agencies (LEAs), Financial Intelligence Units (FIUs), and Citizens.

---

## 🚀 System Highlights

- **Citizen Reporting Portal**: Multi-step reporting for financial fraud, capturing UTR, UPI ID, target IFSC, victim details, and evidence files.
- **Cryptographic Evidence Engine**: Client-side Web Crypto API SHA-256 calculation verified on FastAPI server with strict byte hashing mismatch rejection.
- **Modular AI Scam Classifier**: Detects Digital Arrest, KYC Fraud, Investment Scams, Lottery Scams, Parcel Scams, and Job Scams across SMS, WhatsApp, Emails, and Call Transcripts.
- **Fast-Freeze State Machine**: Generates interbank freeze directives (`FF-2026-XXXX`) with automated state machine transitions (`PENDING` → `UNDER_REVIEW` → `FREEZE_REQUESTED` → `BANK_ACKNOWLEDGED` → `ACCOUNT_FROZEN`) and PostgreSQL audit logs.
- **PostGIS Spatial Intelligence**: DBSCAN spatial clustering algorithms computing cluster centroids, incident density, monetary loss volume, and GeoJSON features for interactive Leaflet maps.
- **Neo4j Intelligence Engine**: Multi-hop graph engine mapping relationships (`SENT_TO`, `USED_BY`, `CONNECTED_TO`, `TRANSFERRED_TO`, `CALLED_FROM`, `LOGIN_FROM`) for Vis.js visual network analysis.
- **Production Hardened & Monitored**: Includes Nginx reverse proxy with rate limiting, GZip response compression, security headers (`nosniff`, `DENY`), request tracing (`X-Request-ID`), global error boundaries, and `/health` diagnostics API.

---

## 🛠️ Quick Start Instructions

### Option 1: Docker Compose (Recommended)
```bash
# 1. Clone repository
git clone <repository_url>
cd ET_AI

# 2. Copy environment file
cp .env.example .env

# 3. Launch production stack (PostgreSQL + PostGIS, Neo4j, FastAPI, Next.js, Nginx)
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Verify system health
curl http://localhost/health
```

### Option 2: Standalone Local Setup

#### Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Citizen Portal: [http://localhost:3000](http://localhost:3000)
- Police Command Center: [http://localhost:3000/police](http://localhost:3000/police)

---

## 🧪 Running Unit Tests
```bash
cd backend
python -m unittest discover tests/
```

---

## 📚 Complete Technical Documentation
Refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete architecture diagrams, database schemas, Cypher graph schemas, REST API documentation, and operator guides.
