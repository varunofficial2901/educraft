import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

async def migrate():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['educraft']

    old_courses = await db['courses'].find({}).to_list(100)
    print(f'Found {len(old_courses)} courses in old collection')

    for c in old_courses:
        existing = await db['admin_courses'].find_one({'title': c['title']})
        if not existing:
            doc = {
                'title': c.get('title', ''),
                'description': c.get('description', ''),
                'price': c.get('price', 0),
                'status': 'active',
                'color': '#6366F1',
                'thumbnail': c.get('thumbnail_url'),
                'created_at': c.get('created_at', datetime.now(timezone.utc)),
                'updated_at': datetime.now(timezone.utc),
            }
            await db['admin_courses'].insert_one(doc)
            print(f'Migrated: {doc["title"]}')
        else:
            print(f'Already exists: {c["title"]}')

    print('Done!')
    client.close()

asyncio.run(migrate())