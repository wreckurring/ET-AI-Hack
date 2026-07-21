import random
import hashlib
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.database import Base, engine
from app.models.postgres_models import User, FraudReport, EvidenceFile
from app.core.security import get_password_hash

router = APIRouter(prefix="/seed", tags=["Database Seeder"])

@router.post("")
def seed_database(db: Session = Depends(get_db)):
    """
    Populates database with sample Indian Cyber Crime records, Officers, and Evidence.
    """
    # Create tables if not present
    Base.metadata.create_all(bind=engine)

    # 1. Seed Officer
    officer = db.query(User).filter(User.badge_number == "INSP-8821").first()
    if not officer:
        officer = User(
            badge_number="INSP-8821",
            full_name="Inspector Vikram Singh",
            email="vikram.singh@cybercrime.gov.in",
            hashed_password=get_password_hash("police123"),
            role="POLICE_OFFICER",
            department="Special Cyber Crime Cell, Northern Range",
            state="Delhi"
        )
        db.add(officer)

    # 2. Sample Fraud Reports
    existing_reports = db.query(FraudReport).count()
    if existing_reports == 0:
        sample_data = [
            {
                "ack": "RK-2026-8801",
                "name": "Ramesh Kumar",
                "phone": "+91 98102 33419",
                "email": "ramesh.k@gmail.com",
                "state": "Delhi",
                "district": "South East Delhi",
                "category": "Phishing Scam",
                "amount": 185000.0,
                "utr": "402918471092",
                "upi": "refund.sbi@okicici",
                "ifsc": "SBIN0004921",
                "scammer_phone": "+91 98351 90211",
                "scammer_url": "https://sbi-kyc-update-portal.info",
                "scammer_ip": "103.145.72.19",
                "lat": 28.5494, "lng": 77.2690,
                "desc": "Received SMS claiming SBI YONO account block. Clicked link and entered OTP. Money debited instantly.",
                "status": "INVESTIGATING",
                "risk": 92
            },
            {
                "ack": "RK-2026-8802",
                "name": "Priya Sharma",
                "phone": "+91 97110 55412",
                "email": "priya.sharma@yahoo.com",
                "state": "Haryana",
                "district": "Gurugram",
                "category": "OLX Fake Army Officer",
                "amount": 340000.0,
                "utr": "402919882310",
                "upi": "elect.bill.pay@ybl",
                "ifsc": "ICIC0000184",
                "scammer_phone": "+91 97182 44102",
                "scammer_url": "https://olx-army-pay.site",
                "scammer_ip": "45.132.227.10",
                "lat": 28.4595, "lng": 77.0266,
                "desc": "Buyer posing as CISF officer on OLX sent QR code claiming to advance pay rent. Scanned code and ₹3.4 Lakhs debited.",
                "status": "NEW",
                "risk": 88
            },
            {
                "ack": "RK-2026-8803",
                "name": "Dr. Anish Varma",
                "phone": "+91 99304 88102",
                "email": "dr.varma@aiims.edu",
                "state": "Maharashtra",
                "district": "Mumbai City",
                "category": "Telegram Stock Investment Scam",
                "amount": 750000.0,
                "utr": "403011029481",
                "upi": "task.reward99@paytm",
                "ifsc": "CNRB0001100",
                "scammer_phone": "+91 88261 00293",
                "scammer_url": "https://vip-institutional-wealth.cc",
                "scammer_ip": "185.220.101.5",
                "lat": 19.0760, "lng": 72.8777,
                "desc": "Promised 400% return on institutional stock trading app. Initial small withdrawals worked, then requested big deposit.",
                "status": "FROZEN",
                "risk": 98
            },
            {
                "ack": "RK-2026-8804",
                "name": "Sneha Gupta",
                "phone": "+91 98450 11928",
                "email": "sneha.g@outlook.com",
                "state": "Karnataka",
                "district": "Bengaluru Urban",
                "category": "FedEx Customs Digital Arrest Scam",
                "amount": 95000.0,
                "utr": "403198002341",
                "upi": "verify.customs@axisbank",
                "ifsc": "UTIB0000045",
                "scammer_phone": "+91 79901 88402",
                "scammer_url": "N/A - Skype Call",
                "scammer_ip": "104.28.20.1",
                "lat": 12.9716, "lng": 77.5946,
                "desc": "Fake Skype call from Mumbai Cyber Cell claiming parcel containing illegal drugs in my name. Transfered money for clearance.",
                "status": "INVESTIGATING",
                "risk": 85
            }
        ]

        for data in sample_data:
            report = FraudReport(
                ack_number=data["ack"],
                victim_name=data["name"],
                victim_phone=data["phone"],
                victim_email=data["email"],
                victim_state=data["state"],
                victim_district=data["district"],
                category=data["category"],
                amount_lost=data["amount"],
                utr_number=data["utr"],
                target_upi_id=data["upi"],
                target_ifsc=data["ifsc"],
                scammer_phone=data["scammer_phone"],
                scammer_url_app=data["scammer_url"],
                scammer_ip_address=data["scammer_ip"],
                latitude=data["lat"],
                longitude=data["lng"],
                description=data["desc"],
                status=data["status"],
                risk_score=data["risk"],
                is_frozen=(data["status"] == "FROZEN"),
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 5))
            )
            db.add(report)
            db.flush()

            # Attach sample evidence with real SHA-256 hash
            sample_content = f"EVIDENCE CONTENT FOR REPORT {data['ack']} TIMESTAMP {datetime.utcnow().isoformat()}".encode()
            sha256 = hashlib.sha256(sample_content).hexdigest()

            evidence = EvidenceFile(
                report_id=report.id,
                file_name=f"Screenshot_Bank_Statement_{data['ack']}.png",
                file_path=f"uploads/Screenshot_{data['ack']}.png",
                file_type="image/png",
                file_size=len(sample_content),
                sha256_hash=sha256,
                hash_verified=True
            )
            db.add(evidence)

    db.commit()
    return {"message": "Database and sample Indian cybercrime records successfully seeded."}
