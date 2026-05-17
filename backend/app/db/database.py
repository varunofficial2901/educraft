from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tls=True,
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000,
        directConnection=False,
    )
    print(f"✅ Connected to MongoDB: {settings.DATABASE_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    return client[settings.DATABASE_NAME]