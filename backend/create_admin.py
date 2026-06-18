"""
Run once to create admin user:
  python create_admin.py

Make sure your .env file is set up with MONGODB_URL and DATABASE_NAME.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL   = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "educraft")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def create_admin():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    email    = input("Admin email: ").strip().lower()
    password = input("Admin password (min 8 chars): ").strip()
    name     = input("Admin name: ").strip()

    if len(password) < 8:
        print("❌ Password too short!")
        return

    existing = await db["users"].find_one({"email": email})
    if existing:
        print(f"⚠️  User {email} already exists. Role: {existing.get('role')}")
        update = input("Update to admin? (y/n): ").strip().lower()
        if update == 'y':
            parts = name.split(" ", 1)
            await db["users"].update_one(
                {"email": email},
                {"$set": {
                    "role": "admin",
                    "first_name": parts[0],
                    "last_name": parts[1] if len(parts) > 1 else "",
                    "password_hash": pwd_context.hash(password),
                }}
            )
            print(f"✅ {email} updated to admin!")
        return

    parts = name.split(" ", 1)
    await db["users"].insert_one({
        "first_name":    parts[0],
        "last_name":     parts[1] if len(parts) > 1 else "",
        "email":         email,
        "password_hash": pwd_context.hash(password),
        "role":          "admin",
        "provider":      "email",
        "is_active":     True,
        "created_at":    datetime.now(timezone.utc),
        "updated_at":    datetime.now(timezone.utc),
    })
    print(f"✅ Admin created: {email}")
    client.close()


asyncio.run(create_admin())
