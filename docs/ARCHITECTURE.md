# Under-Tow System Architecture & Operator Manual

**Under-Tow** is an AI-powered Digital Public Safety Intelligence Platform designed for Indian Law Enforcement Agencies (LEAs), Financial Intelligence Units (FIUs), Financial Institutions, and Citizens.

---

## 🏛️ System Architecture Diagram

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
            │  - Citizen Fraud Reporting   │                       │  - Auth & JWT Refresh Tokens │
            │  - LEA Command Center        │                       │  - Evidence Hasher (SHA-256) │
            │  - Hotspot Map & Vis.js Graph│                       │  - Fast-Freeze State Machine │
            │  - Our Activities Carousel   │                       │  - Counterfeit Currency API  │
            └──────────────────────────────┘                       └───────────────┬──────────────┘
                                                                                   │
                                           ┌───────────────────────────────────────┴───────────────────────────────────────┐
                                           │                                                                               │
                                           ▼                                                                               ▼
                           ┌──────────────────────────────┐                                                        ┌──────────────────────────────┐
                           │    PostgreSQL (PostGIS)      │                                                        │      Neo4j 5.17.0 Graph      │
                           │  - Fraud Reports & Evidence   │                                                        │  - Scammer Network Entities  │
                           │  - Spatial DBSCAN Hotspots    │                                                        │  - Multi-hop Fraud Graph     │
                           │  - Counterfeit Currency FICN  │                                                        │  - Syndicate Node Links      │
                           └──────────────────────────────┘                                                        └──────────────────────────────┘
```

---

## 🔐 Database Schemas & Data Models

### 1. PostgreSQL (PostGIS Enabled)
- `users`: User identity, hashed passwords, roles (`CITIZEN`, `POLICE_OFFICER`, `CYBER_CELL`, `FINANCIAL_INSTITUTION`, `ADMIN`), badge numbers.
- `refresh_tokens`: Token hash, user reference, expiration, revocation status.
- `fraud_reports`: Incident metadata, victim info, loss amount, financial identifiers (UTR, UPI ID, IFSC, Account No), scammer metadata (phone, URL, IP), lat/lng coordinates, PostGIS `geometry(Point, 4326)`.
- `evidence_files`: Metadata of uploaded screenshots/PDFs, file size, server-verified SHA-256 hash digest.
- `fast_freeze_actions`: Interbank freeze reference (`FF-2026-XXXX`), target account/UPI, hold status (`PENDING`, `UNDER_REVIEW`, `FREEZE_REQUESTED`, `BANK_ACKNOWLEDGED`, `ACCOUNT_FROZEN`, `FAILED`).
- `freeze_audit_logs`: Immutable audit log recording state transitions, timestamp, officer badge number, and interbank ACK token.
- `counterfeit_currency_reports`: FICN seizure tracking, denomination (500, 200, 100), serial numbers, seizure location, state, district, and risk level.

### 2. Neo4j Cybercrime Intelligence Graph
- **Node Labels**: `Victim`, `PhoneNumber`, `SIM`, `Device`, `UPI`, `BankAccount`, `IFSC`, `Transaction`, `IPAddress`.
- **Relationship Types**: `SENT_TO`, `USED_BY`, `CONNECTED_TO`, `TRANSFERRED_TO`, `CALLED_FROM`, `LOGIN_FROM`.

---

## 🛠️ API Reference Summary

### 1. Authentication APIs (`/api/v1/auth`)
- `POST /auth/register-citizen`: Register new citizen account.
- `POST /auth/login`: Authenticate and issue JWT Access Token (60 min) & Refresh Token (7 days).
- `POST /auth/refresh`: Rotate refresh token and issue new access token.
- `GET /auth/me`: Get current authenticated user profile.

### 2. Fraud Incident Reporting APIs (`/api/v1/reports`)
- `POST /reports`: Create new citizen fraud incident report (`ACK-2026-XXXX`).
- `POST /reports/{report_id}/upload-evidence`: Upload screenshot/document evidence with SHA-256 validation.
- `GET /reports/{report_id}`: Retrieve report details and verified evidence attachments.
- `GET /reports/track/{ack_number}`: Public complaint status tracking endpoint.

### 3. Fast-Freeze Operations APIs (`/api/v1/fast-freeze`)
- `POST /fast-freeze/request`: Issue interbank Fast-Freeze account hold directive.
- `GET /fast-freeze/status/{freeze_id}`: Get real-time freeze status and complete audit trail timeline.
- `POST /fast-freeze/update-status`: Update interbank freeze state (`BANK_ACKNOWLEDGED` / `ACCOUNT_FROZEN`).

### 4. Counterfeit Currency Intelligence APIs (`/api/v1/counterfeit`)
- `POST /counterfeit/report`: Submit fake currency seizure report (denomination, serial prefix, location).
- `GET /counterfeit/analytics`: Retrieve FICN circulation intelligence and regional hotspot data.

### 5. PostGIS Spatial & Dashboard Analytics APIs (`/api/v1/analytics`)
- `GET /analytics/dashboard/summary`: Unified platform metrics (active complaints, fast-freeze count, protected funds, risk score).
- `GET /analytics/hotspots`: PostGIS spatial incident points & district aggregates.
- `GET /analytics/clusters`: DBSCAN spatial density clusters.
- `GET /analytics/kpis`: Live command center telemetry.

### 6. AI Scam & Copilot Intelligence APIs (`/api/v1/ai-scam` & `/api/v1/copilot`)
- `POST /ai-scam/detect`: Text scam risk score classifier & keyword extractor.
- `POST /copilot/query`: LLM-powered investigation copilot timeline summarizer.

---

## 🛡️ Production Security Hardening

1. **GZip Compression**: Automatic HTTP response compression for payloads >1KB.
2. **CORS & Security Headers**: Strict origin policies, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`.
3. **Request Tracing**: `X-Request-ID` attached to all HTTP request headers.
4. **Health Diagnostics**: `/health` system health endpoint returning database latency and system status.
