# RAKSHA-NET Architecture & Production Operator Manual

**RAKSHA-NET** is an AI-powered Cyber Fraud Intelligence & Fast-Freeze Operations Platform designed for Indian Law Enforcement Agencies (LEAs), Financial Intelligence Units (FIUs), and Citizens.

---

## 🏛️ System Architecture

```
                                  ┌──────────────────────────────────────────┐
                                  │            Nginx Reverse Proxy           │
                                  │       - Rate Limiter & SSL Proxy         │
                                  └────────────────────┬─────────────────────┘
                                                       │
                           ┌───────────────────────────┴───────────────────────────┐
                           │                                                       │
                           ▼                                                       ▼
            ┌──────────────────────────────┐                       ┌──────────────────────────────┐
            │       Next.js 14 Web App     │                       │       FastAPI Python Core    │
            │  - Citizen Fraud Reporting   │                       │  - Auth & Refresh Tokens     │
            │  - LEA Command Center        │                       │  - Evidence Hasher (SHA-256) │
            │  - Hotspot Map & Vis.js Graph│                       │  - Fast-Freeze State Machine │
            └──────────────────────────────┘                       └───────────────┬──────────────┘
                                                                                   │
                                           ┌───────────────────────────────────────┴───────────────────────────────────────┐
                                           │                                                                               │
                                           ▼                                                                               ▼
                           ┌──────────────────────────────┐                                                        ┌──────────────────────────────┐
                           │    PostgreSQL (PostGIS)      │                                                        │      Neo4j 5.17.0 Graph      │
                           │  - Fraud Reports & Evidence   │                                                        │  - Scammer Network Entities  │
                           │  - Spatial DBSCAN Hotspots    │                                                        │  - Multi-hop Fraud Graph     │
                           └──────────────────────────────┘                                                        └──────────────────────────────┘
```

---

## 🔐 Database Schemas & Models

### 1. PostgreSQL (PostGIS Enabled)
- `users`: User identity, hashed passwords, roles (`CITIZEN`, `POLICE_OFFICER`, `ANALYST`, `ADMIN`), badge numbers.
- `refresh_tokens`: Token hash, user reference, expiration, revocation status.
- `fraud_reports`: Incident metadata, victim info, loss amount, financial identifiers (UTR, UPI ID, IFSC, Account No), scammer metadata (phone, URL, IP), lat/lng coordinates, PostGIS `geometry(Point, 4326)`.
- `evidence_files`: Metadata of uploaded screenshots/PDFs, file size, server-verified SHA-256 hash digest.
- `fast_freeze_actions`: Interbank freeze reference (`FF-2026-XXXX`), target account/UPI, hold status (`PENDING`, `UNDER_REVIEW`, `FREEZE_REQUESTED`, `BANK_ACKNOWLEDGED`, `ACCOUNT_FROZEN`, `FAILED`).
- `freeze_audit_logs`: Immutable audit log recording state transitions, timestamp, officer badge number, and interbank ACK token.

### 2. Neo4j Cybercrime Intelligence Graph
- **Node Labels**: `Victim`, `PhoneNumber`, `SIM`, `Device`, `UPI`, `BankAccount`, `IFSC`, `Transaction`, `IPAddress`.
- **Relationship Types**: `SENT_TO`, `USED_BY`, `CONNECTED_TO`, `TRANSFERRED_TO`, `CALLED_FROM`, `LOGIN_FROM`.

---

## 🛠️ API Reference Summary

### Authentication APIs (`/api/v1/auth`)
- `POST /auth/register-citizen`: Register new citizen account.
- `POST /auth/login`: Authenticate and issue JWT Access Token (30 min) & Refresh Token (7 days).
- `POST /auth/refresh`: Rotate refresh token and issue new access token.
- `GET /auth/me`: Get current authenticated user profile.

### Fraud Report & Evidence APIs (`/api/v1/reports`)
- `POST /reports`: Create incident report with victim & scammer financial metadata.
- `GET /reports`: List all fraud reports (with multi-filtering).
- `POST /reports/upload-evidence`: Upload multipart evidence file with client SHA-256 hash digest.

### AI Scam Detection APIs (`/api/v1/ai`)
- `POST /ai/detect-scam`: Analyze SMS, WhatsApp, Email, or Call Transcript against Indian Cybercrime taxonomy (`Digital Arrest`, `KYC Fraud`, `Investment Scam`, `Lottery Scam`, `Parcel Scam`, `Job Scam`).
- `POST /ai/detect-scam-file`: Upload transcript file for automated threat analysis.

### Fast-Freeze Workflow APIs (`/api/v1/freeze`)
- `POST /freeze/request`: Create Fast-Freeze directive and execute State Machine sequence (`FF-2026-XXXX`).
- `GET /freeze/status/{freeze_id}`: Retrieve status and full audit log timeline.
- `PATCH /freeze/status/{freeze_id}`: Advance state transition.

### PostGIS Spatial Analytics APIs (`/api/v1/analytics`)
- `GET /analytics/hotspots`: GeoJSON FeatureCollection of incident points.
- `GET /analytics/clusters`: GeoJSON FeatureCollection of DBSCAN spatial density clusters.
- `GET /analytics/heatmap`: GeoJSON FeatureCollection of weighted intensity points.
- `GET /analytics/dashboard`: Complete analytics dataset for LEA Command Center.

### Neo4j Graph APIs (`/api/v1/graph`)
- `POST /graph/ingest`: Ingest incident entities and relationships into Neo4j graph.
- `GET /graph/network/upi/{upi}`: Retrieve multi-hop fraud network graph for Vis.js visualization.
- `GET /graph/network/phone/{phone}`: Retrieve scammer SIM network graph.

---

## 🚀 Deployment & Operations Guide

### Production Docker Deployment
```bash
# 1. Clone repository & prepare production environment
cp .env.example .env

# 2. Build & launch multi-container stack with Nginx
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Check health status
curl http://localhost/health
```

### Standalone Local Development
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

### System Diagnostics & Health Monitoring
Access `GET /health` or `GET /api/v1/health` for real-time memory usage, database status, and uptime statistics.
