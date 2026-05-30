import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    client = AsyncIOMotorClient(
        'mongodb+srv://Varunchauhan_2901:lwprDMGxwmQGx1Sa@cluster0.lmnarwz.mongodb.net/?appName=Cluster0',
        tls=True,
        tlsAllowInvalidCertificates=True,
    )
    db = client['educraft']
    
    collections = await db.list_collection_names()
    print('Collections:', collections)
    
    papers = await db['admin_papers'].find({}).to_list(100)
    for p in papers:
        print('PAPER:', p.get('title'), '->', p.get('type'), '->', p.get('course_id'))
    
    courses = await db['admin_courses'].find({}).to_list(10)
    for c in courses:
        print('COURSE:', c.get('title'), '->', str(c['_id']))
    
    client.close()

asyncio.run(check())