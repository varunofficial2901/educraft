import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from bson import ObjectId

MONGO_URL = 'mongodb+srv://Varunchauhan_2901:lwprDMGxwmQGx1Sa@cluster0.lmnarwz.mongodb.net/?appName=Cluster0'

async def migrate():
    client = AsyncIOMotorClient(MONGO_URL, tls=True, tlsAllowInvalidCertificates=True)
    db = client['educraft']

    # Get all paid papers
    papers = await db['admin_papers'].find({'type': 'paid'}).to_list(100)
    print(f'Found {len(papers)} paid papers to migrate')

    for p in papers:
        existing = await db['admin_bundles'].find_one({'title': p['title'], 'course_id': p['course_id']})
        if not existing:
            bundle = {
                'title': p.get('title', ''),
                'description': p.get('description', ''),
                'course_id': p.get('course_id', ''),
                'price': p.get('price', 0),
                'points': p.get('points', []),
                'visible': p.get('visible', True),
                'test_papers': [],
                'created_at': p.get('created_at', datetime.now(timezone.utc)),
            }
            await db['admin_bundles'].insert_one(bundle)
            print(f'Migrated bundle: {p["title"]}')
        else:
            print(f'Already exists: {p["title"]}')

    print('Done!')
    client.close()

asyncio.run(migrate())