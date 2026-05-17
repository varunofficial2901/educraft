from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime, timezone
import httpx
import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

from app.schemas.schemas import (
    SignUpRequest, SignInRequest, GoogleAuthRequest,
    TokenResponse, RefreshTokenRequest, ForgotPasswordRequest,
    ResetPasswordRequest, ChangePasswordRequest, MessageResponse, UserPublic
)
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.db.database import get_database

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def format_user(user: dict) -> UserPublic:
    return UserPublic(
        id=str(user["_id"]),
        first_name=user["first_name"],
        last_name=user["last_name"],
        email=user["email"],
        role=user["role"],
        avatar_url=user.get("avatar_url"),
        is_verified=user.get("is_verified", False),
        created_at=user["created_at"],
    )


def make_tokens(user_id: str, role: str) -> dict:
    data = {"sub": user_id, "role": role}
    return {
        "access_token": create_access_token(data),
        "refresh_token": create_refresh_token(data),
        "token_type": "bearer",
    }


# ─────────────────────────────────────────
# SIGN UP
# ─────────────────────────────────────────

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignUpRequest, db=Depends(get_database)):
    existing = await db["users"].find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "first_name": body.first_name,
        "last_name": body.last_name,
        "email": body.email,
        "password_hash": hash_password(body.password),
        "role": "student",
        "provider": "email",
        "avatar_url": None,
        "is_verified": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    tokens = make_tokens(str(result.inserted_id), "student")
    return TokenResponse(**tokens, user=format_user(user_doc))


# ─────────────────────────────────────────
# SIGN IN
# ─────────────────────────────────────────

@router.post("/signin", response_model=TokenResponse)
async def signin(body: SignInRequest, db=Depends(get_database)):
    user = await db["users"].find_one({"email": body.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.get("provider") != "email":
        raise HTTPException(status_code=400, detail=f"Please sign in with {user.get('provider', 'your social account')}")

    if not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    tokens = make_tokens(str(user["_id"]), user["role"])
    try:
        resend.Emails.send({
            "from": "EduCraft <onboarding@resend.dev>",
            "to": [user["email"]],
            "subject": "New Login to Your EduCraft Account",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366F1;">New Login Detected</h2>
                <p>Hi {user.get('first_name', '')},</p>
                <p>A new login was detected on your EduCraft account.</p>
                <p><strong>Email:</strong> {user['email']}</p>
                <p>If this was you, no action is needed.</p>
                <p>If this wasn't you, please change your password immediately.</p>
                <br>
                <p>Team EduCraft</p>
            </div>
            """
        })
    except Exception:
        pass
    return TokenResponse(**tokens, user=format_user(user))


# ─────────────────────────────────────────
# GOOGLE OAUTH
# ─────────────────────────────────────────

@router.post("/google", response_model=TokenResponse)
async def google_auth(body: GoogleAuthRequest, db=Depends(get_database)):
    """Verify Google ID token and sign in or create account."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={body.id_token}"
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    google_data = resp.json()

    # Validate audience
    if settings.GOOGLE_CLIENT_ID and google_data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=401, detail="Token audience mismatch")

    email = google_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not available from Google")

    # Find or create user
    user = await db["users"].find_one({"email": email})

    if not user:
        user_doc = {
            "first_name": google_data.get("given_name", ""),
            "last_name": google_data.get("family_name", ""),
            "email": email,
            "password_hash": None,
            "role": "student",
            "provider": "google",
            "google_id": google_data.get("sub"),
            "avatar_url": google_data.get("picture"),
            "is_verified": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        result = await db["users"].insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc

    tokens = make_tokens(str(user["_id"]), user["role"])
    return TokenResponse(**tokens, user=format_user(user))


# ─────────────────────────────────────────
# REFRESH TOKEN
# ─────────────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshTokenRequest, db=Depends(get_database)):
    payload = decode_token(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    tokens = make_tokens(str(user["_id"]), user["role"])
    return TokenResponse(**tokens, user=format_user(user))


# ─────────────────────────────────────────
# FORGOT PASSWORD
# ─────────────────────────────────────────

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(body: ForgotPasswordRequest, db=Depends(get_database)):
    user = await db["users"].find_one({"email": body.email})
    # Always return success (security: don't reveal if email exists)
    if user and user.get("provider") == "email":
        reset_token = create_access_token(
            {"sub": str(user["_id"]), "purpose": "reset"},
            # expires in 15 min (handled by access token default or override)
        )
        # TODO: Send email with reset link: {FRONTEND_URL}/reset-password?token={reset_token}
        # Integrate with SendGrid / Resend / SMTP here
        print(f"[DEV] Reset token for {body.email}: {reset_token}")

    return MessageResponse(message="If an account exists, a reset link has been sent to your email.")


# ─────────────────────────────────────────
# RESET PASSWORD
# ─────────────────────────────────────────

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(body: ResetPasswordRequest, db=Depends(get_database)):
    payload = decode_token(body.token)
    if not payload or payload.get("purpose") != "reset":
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user_id = payload.get("sub")
    result = await db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "password_hash": hash_password(body.new_password),
            "updated_at": datetime.now(timezone.utc),
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return MessageResponse(message="Password reset successfully. Please sign in.")


# ─────────────────────────────────────────
# CHANGE PASSWORD (authenticated)
# ─────────────────────────────────────────

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    body: ChangePasswordRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    if current_user.get("provider") != "email":
        raise HTTPException(status_code=400, detail="Cannot change password for social login accounts")

    if not verify_password(body.current_password, current_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    await db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": {
            "password_hash": hash_password(body.new_password),
            "updated_at": datetime.now(timezone.utc),
        }}
    )
    return MessageResponse(message="Password changed successfully")


# ─────────────────────────────────────────
# GET CURRENT USER (me)
# ─────────────────────────────────────────

@router.get("/me", response_model=UserPublic)
async def get_me(current_user=Depends(get_current_user)):
    from app.api.routes.auth import format_user
    return format_user(current_user)
