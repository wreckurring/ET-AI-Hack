from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_and_revoke_refresh_token,
    get_current_user
)
from app.models.postgres_models import User, UserRole
from app.schemas.schemas import (
    LoginRequest,
    Token,
    RefreshTokenRequest,
    CitizenRegisterRequest,
    UserResponse,
    HTTPErrorDetail
)

router = APIRouter(prefix="/auth", tags=["Authentication & Access Tokens"])

@router.post(
    "/login",
    response_model=Token,
    responses={
        401: {"model": HTTPErrorDetail, "description": "Invalid credentials or unauthenticated"}
    }
)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate LE Officer (by Badge Number) or Citizen (by Email) using BCrypt.
    Returns short-lived JWT Access Token & long-lived Refresh Token.
    """
    user = db.query(User).filter(
        (User.badge_number == req.username_or_badge) | (User.email == req.username_or_badge)
    ).first()

    # Provision default inspector if database is fresh
    if not user and req.username_or_badge in ["INSP-8821", "POLICE-100"]:
        user = User(
            badge_number=req.username_or_badge,
            full_name="Inspector Vikram Singh",
            email="vikram.singh@cybercrime.gov.in",
            hashed_password=get_password_hash("police123"),
            role=UserRole.POLICE_OFFICER.value,
            department="Special Cyber Crime Cell",
            state="Delhi"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid badge/email or password credentials"
        )

    access_token = create_access_token(data={"sub": user.badge_number or user.email, "role": user.role})
    refresh_token = create_refresh_token(db, user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_name": user.full_name,
        "badge_number": user.badge_number,
        "role": user.role
    }

@router.post(
    "/refresh",
    response_model=Token,
    responses={
        401: {"model": HTTPErrorDetail, "description": "Invalid or expired refresh token"}
    }
)
def refresh_access_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Exchange valid Refresh Token for a new JWT Access Token & new rotated Refresh Token.
    """
    user = verify_and_revoke_refresh_token(db, req.refresh_token)

    new_access_token = create_access_token(data={"sub": user.badge_number or user.email, "role": user.role})
    new_refresh_token = create_refresh_token(db, user.id)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user_name": user.full_name,
        "badge_number": user.badge_number,
        "role": user.role
    }

@router.post(
    "/register-citizen",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": HTTPErrorDetail, "description": "Email already registered"}
    }
)
def register_citizen(req: CitizenRegisterRequest, db: Session = Depends(get_db)):
    """Public registration endpoint for Indian citizens."""
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        full_name=req.full_name,
        email=req.email,
        phone=req.phone,
        hashed_password=get_password_hash(req.password),
        role=UserRole.CITIZEN.value,
        department="Citizen Portal",
        state="India"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get authenticated user profile details."""
    return current_user
