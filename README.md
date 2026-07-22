# Under-Tow — AI-Powered Digital Public Safety Intelligence Platform

**Under-Tow** is an AI-powered Digital Public Safety Intelligence Platform that enables Law Enforcement Agencies (LEAs), Financial Institutions, Government Organizations, and Citizens to proactively detect, disrupt, investigate, and respond to digital fraud networks, counterfeit currency circulation, and organized cybercrime.

---

## 🏛️ Executive Summary

Traditional cybercrime management relies on reactive case filing. **Under-Tow** shifts the paradigm toward **predictive threat neutralization**, providing an integrated national-level intelligence ecosystem:

- **Proactive AI Scam Detection**: Scans SMS, WhatsApp, Email, and Call Transcripts for Digital Arrest, UPI Scams, KYC Scams, and Fake Investment Schemes.
- **Fast-Freeze Account Hold Directives**: Automated interbank hold engine issuing Section 91 CrPC hold directives across Indian banks to lock stolen funds within the Golden Hour window.
- **Neo4j Fraud Graph Intelligence**: Multi-hop graph engine mapping relationships between Fraudsters, Bank Accounts, Phone Numbers, Devices, IP Addresses, Wallets, and UPI IDs.
- **Counterfeit Currency Intelligence**: Seizure tracking, serial prefix analysis, and regional circulation hotspot mapping for Fake Indian Currency Notes (FICN).
- **PostGIS Spatial Intelligence**: DBSCAN clustering, district-wise incident density, and interactive fraud heatmaps.
- **AI Investigation Copilot**: LLM-powered investigation assistant generating timeline summaries, suspect links, and automated evidence dossiers.

---

## 🚀 Key Features & Capability Domains

### 🛡️ Domain 1: AI Threat Intelligence
- **AI Scam Detection**: Detects phishing, fake investment schemes, OTP scams, QR scams, and digital arrest scams using NLP and rule-based scam classifiers.
- **Predictive Threat Analytics**: Predicts emerging scam campaigns before large-scale incidents occur.
- **AI Investigation Copilot**: Assists officers with automated case timelines, suspect correlation, and executive investigation summaries.

### 🕸️ Domain 2: Fraud Network Intelligence
- **Scam Network Graph Engine**: Visualizes multi-hop connections using Vis.js and Neo4j (`SENT_TO`, `USED_BY`, `CONNECTED_TO`, `TRANSFERRED_TO`, `LOGIN_FROM`).
- **Counterfeit Currency Intelligence**: Tracks fake note seizures (500, 200, 100 denominations), serial number prefixes (e.g., `7AK`, `4EF`), and border transit routes.
- **Organized Crime Correlation**: Connects isolated complaints into unified criminal syndicate dossiers.

### 🏦 Domain 3: Law Enforcement & Banking Intelligence
- **Fast-Freeze Engine**: Interbank account hold state machine (`PENDING` → `UNDER_REVIEW` → `FREEZE_REQUESTED` → `BANK_ACKNOWLEDGED` → `ACCOUNT_FROZEN`) with immutable audit logs.
- **Nodal Banking Portal**: Secure coordination portal for RBI, NPCI, and commercial banks to acknowledge freeze directives and update recovery statuses.
- **Police Command Center**: Real-time LEA dashboard with threat scores, priority queues, and cryptographic evidence verification.

### 🛡️ Domain 4: Citizen Protection Services
- **Multi-Step Complaint Portal**: Secure registration of financial cybercrime with UTR numbers, UPI IDs, target account numbers, and evidence upload.
- **Cryptographic Evidence Management**: Client-side Web Crypto API SHA-256 calculation verified on the backend to enforce strict chain of custody.
- **Complaint Status Tracker**: Real-time status updates for citizens using acknowledgment numbers (`ACK-2026-XXXX`).
- **Emergency Helpline 1930 & Cyber Awareness**: Direct integration with National Cyber Helpline 1930 and NDMA-inspired Do's & Don'ts photo carousels.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & Theme** | Vanilla CSS Tokens, Tailwind CSS, NDMA Government Portal Aesthetics |
| **Backend Framework** | FastAPI (Python 3.12/3.14), Pydantic v2, Uvicorn |
| **Relational Database** | PostgreSQL 16 with PostGIS extension (SQLite local fallback) |
| **Graph Database** | Neo4j Graph DB 5.x (Vis.js interactive visualization) |
| **AI / Machine Learning** | Rule-Based NLP Scam Classifier, PaddleOCR / EasyOCR, Faster-Whisper |
| **Security & Middleware** | JWT Authentication, GZip Compression, CORS, Request Tracing (`X-Request-ID`), SHA-256 Hashing |

---

## 📂 Project Directory Structure

```text
ET_AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/            # FastAPI API Routers (counterfeit, fast_freeze, ai_scam, etc.)
│   │   ├── core/              # Config, DB, Security, WebSockets
│   │   ├── models/            # SQLAlchemy ORM Models
│   │   ├── schemas/           # Pydantic Request/Response Schemas
│   │   └── services/          # Scam Detector, Fast Freeze, PostGIS, Neo4j, OCR
│   ├── tests/                 # 38 Automated Unit Tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js Pages (page.tsx, login/, report/, track/, police/)
│   │   ├── components/        # Handcrafted NDMA Components (Navbar, OurActivities, DosAndDonts, etc.)
│   │   ├── context/           # Multilingual i18n Language Context
│   │   └── lib/               # API Fetch Utilities & i18n Dictionaries
│   └── package.json
├── docs/                      # Architecture, API & System Documentation
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 🛠️ Installation & Setup

### Option 1: Docker Compose (Production Environment)
```bash
# Clone the repository
git clone https://github.com/wreckurring/ET-AI-Hack.git
cd ET-AI-Hack

# Copy environment configuration
cp .env.example .env

# Launch production stack (PostgreSQL + PostGIS, Neo4j, FastAPI, Next.js, Nginx)
docker-compose -f docker-compose.prod.yml up -d --build

# Verify system diagnostic health
curl http://localhost/health
```

### Option 2: Standalone Local Setup

#### 1. Backend Setup (FastAPI)
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Endpoint**: [http://localhost:8000/health](http://localhost:8000/health)

#### 2. Frontend Setup (Next.js)
```bash
cd frontend

# Install Node dependencies
npm install

# Run development server
npm run dev
```
- **Under-Tow Citizen Portal**: [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/v1/analytics/dashboard/summary` | `GET` | Returns unified platform metrics (active complaints, fast freezes, protected amount, risk score) |
| `POST /api/v1/counterfeit/report` | `POST` | Submits Counterfeit Currency Seizure Report (denomination, serial prefix, location) |
| `GET /api/v1/counterfeit/analytics` | `GET` | Returns FICN counterfeit circulation intelligence & hotspot trends |
| `POST /api/v1/fast-freeze/request` | `POST` | Triggers interbank Fast-Freeze hold directive |
| `POST /api/v1/ai-scam/detect` | `POST` | Classifies text for scam risk score, category, and suspicious keywords |
| `POST /api/v1/copilot/query` | `POST` | Generates AI LLM investigation summary and suspect links |
| `GET /api/v1/graph/network/{report_id}` | `GET` | Returns Neo4j multi-hop fraud graph data for Vis.js visualization |
| `GET /api/v1/health` | `GET` | Returns system diagnostic status |

---

## 🎨 UI Screenshots & Layout

- **NDMA-Exact Header & Navigation**: Official emblem, search bar, language toggle (`English | हिन्दी`), and dark gray navigation strip.
- **Our Activities Showcase**: 2-large-card auto-sliding carousel detailing the 4 Major Intelligence Domains.
- **Do's & Don'ts Photo Carousel**: High-resolution cyber hazard covers with green checkmarks (`✓`), red crosses (`✕`), and circular arrows controls (`<` `>`).
- **Publication Cover Resource Gallery**: Realistic 3:4 aspect ratio publication covers with PDF document preview.
- **Important Websites Directory**: Circular official logos (`CERT-In`, `RBI`, `NPCI`, `I4C`, `MHA`, `CYBER PORTAL`, `DIGITAL INDIA`, `NIC`) with centered text labels.

---

## 🔒 Security & Compliance

- **Cryptographic Hashing**: SHA-256 evidence verification.
- **Role-Based Access Control**: Restricted portals for Citizens, Police Officers, Cyber Crime Cells, Financial Institutions, and Admins.
- **Security Headers**: HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`.

---

## 📜 License & Ownership

© 2026 **Under-Tow** National Cyber Crime Directorate, Ministry of Home Affairs, Government of India. Designed for Public Safety & Law Enforcement Excellence.
