"""
Run this once after deployment to create MongoDB indexes.
Usage: python setup_indexes.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


async def create_indexes():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    print("Creating indexes...")

    # Users
    await db["users"].create_index("email", unique=True)
    await db["users"].create_index("google_id", sparse=True)

    # Courses
    await db["courses"].create_index("category")
    await db["courses"].create_index("is_free")
    await db["courses"].create_index("is_published")

    # Tests
    await db["tests"].create_index("course_id")

    # Enrollments
    await db["enrollments"].create_index([("user_id", 1), ("course_id", 1)], unique=True)

    # Test Attempts
    await db["test_attempts"].create_index([("user_id", 1), ("test_id", 1)], unique=True)
    await db["test_attempts"].create_index("user_id")

    # Newsletter
    await db["newsletter"].create_index("email", unique=True)

    # Contacts
    await db["contacts"].create_index("is_resolved")

    # FAQs
    await db["faqs"].create_index("category")

    print("✅ All indexes created successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(create_indexes())
