import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone

# Monkeypatch bcrypt for passlib compatibility
import bcrypt
if not hasattr(bcrypt, "__about__"):
    bcrypt.__about__ = type('About', (object,), {'__version__': bcrypt.__version__})

async def seed():
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed = pwd_context.hash("admin123")
    
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["educraft"]
    
    # Check if admin already exists
    existing = await db["users"].find_one({"email": "admin@eduplatform.com"})
    if existing:
        print("Admin user already exists.")
        return
        
    admin_doc = {
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@eduplatform.com",
        "password_hash": hashed,
        "role": "admin",
        "provider": "email",
        "avatar_url": None,
        "is_verified": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    
    await db["users"].insert_one(admin_doc)
    print("✅ Default admin user seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
