import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from bson import ObjectId

MONGO_URL = 'mongodb+srv://Varunchauhan_2901:lwprDMGxwmQGx1Sa@cluster0.lmnarwz.mongodb.net/?appName=Cluster0'

MATH_COURSE_ID = "6a10c2bb2069307f7a5b63d6"
REASONING_COURSE_ID = "6a10c2e32069307f7a5b63d7"

math_questions = [
    {"text": "A bag contains 5 red balls and 3 blue balls. One ball is picked at random. What is the probability of picking a blue ball?", "topic": "Probability", "difficulty": "easy", "options": [{"id": "A", "text": "3/5"}, {"id": "B", "text": "3/8"}, {"id": "C", "text": "5/8"}, {"id": "D", "text": "1/2"}], "correctAnswer": "B"},
    {"text": "What is 25% of 200?", "topic": "Percentages", "difficulty": "easy", "options": [{"id": "A", "text": "25"}, {"id": "B", "text": "40"}, {"id": "C", "text": "50"}, {"id": "D", "text": "75"}], "correctAnswer": "C"},
    {"text": "A notebook costs $4. How much do 6 notebooks cost?", "topic": "Multiplication", "difficulty": "easy", "options": [{"id": "A", "text": "$20"}, {"id": "B", "text": "$22"}, {"id": "C", "text": "$24"}, {"id": "D", "text": "$26"}], "correctAnswer": "C"},
    {"text": "What is the area of a rectangle with length 8 cm and width 5 cm?", "topic": "Geometry", "difficulty": "easy", "options": [{"id": "A", "text": "13 cm²"}, {"id": "B", "text": "26 cm²"}, {"id": "C", "text": "40 cm²"}, {"id": "D", "text": "80 cm²"}], "correctAnswer": "C"},
    {"text": "A car travels 180 km in 3 hours. What is its average speed?", "topic": "Speed", "difficulty": "easy", "options": [{"id": "A", "text": "50 km/h"}, {"id": "B", "text": "60 km/h"}, {"id": "C", "text": "70 km/h"}, {"id": "D", "text": "80 km/h"}], "correctAnswer": "B"},
    {"text": "What fraction is equivalent to 0.75?", "topic": "Fractions", "difficulty": "easy", "options": [{"id": "A", "text": "1/2"}, {"id": "B", "text": "2/3"}, {"id": "C", "text": "3/4"}, {"id": "D", "text": "4/5"}], "correctAnswer": "C"},
    {"text": "If 3 pencils cost $9, how much does 1 pencil cost?", "topic": "Division", "difficulty": "easy", "options": [{"id": "A", "text": "$2"}, {"id": "B", "text": "$3"}, {"id": "C", "text": "$4"}, {"id": "D", "text": "$5"}], "correctAnswer": "B"},
    {"text": "What is the perimeter of a square with side 7 cm?", "topic": "Geometry", "difficulty": "easy", "options": [{"id": "A", "text": "14 cm"}, {"id": "B", "text": "21 cm"}, {"id": "C", "text": "28 cm"}, {"id": "D", "text": "49 cm"}], "correctAnswer": "C"},
    {"text": "A pizza is cut into 8 equal slices. If 3 slices are eaten, what fraction remains?", "topic": "Fractions", "difficulty": "easy", "options": [{"id": "A", "text": "3/8"}, {"id": "B", "text": "5/8"}, {"id": "C", "text": "1/2"}, {"id": "D", "text": "7/8"}], "correctAnswer": "B"},
    {"text": "What is 15% of 80?", "topic": "Percentages", "difficulty": "easy", "options": [{"id": "A", "text": "10"}, {"id": "B", "text": "12"}, {"id": "C", "text": "15"}, {"id": "D", "text": "18"}], "correctAnswer": "B"},
]

reasoning_questions = [
    {"text": "A shopkeeper buys 48 pens at £0.75 each and sells them at £1.20 each. What is his total profit?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "£14.40"}, {"id": "B", "text": "£21.60"}, {"id": "C", "text": "£57.60"}, {"id": "D", "text": "£36.00"}, {"id": "E", "text": "£18.40"}], "correctAnswer": "A"},
    {"text": "All cats are animals. Some animals are dogs. Which of the following must be true?", "topic": "Logical", "difficulty": "medium", "options": [{"id": "A", "text": "All cats are dogs"}, {"id": "B", "text": "Some dogs are cats"}, {"id": "C", "text": "All animals are cats"}, {"id": "D", "text": "Cats are animals"}, {"id": "E", "text": "All dogs are animals"}], "correctAnswer": "D"},
    {"text": "Choose the word most similar in meaning to LUCID.", "topic": "Verbal", "difficulty": "easy", "options": [{"id": "A", "text": "Confusing"}, {"id": "B", "text": "Clear"}, {"id": "C", "text": "Dark"}, {"id": "D", "text": "Lengthy"}, {"id": "E", "text": "Loud"}], "correctAnswer": "B"},
    {"text": "What is 15% of 340?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "48"}, {"id": "B", "text": "51"}, {"id": "C", "text": "54"}, {"id": "D", "text": "45"}, {"id": "E", "text": "57"}], "correctAnswer": "B"},
    {"text": "Which word is most similar in meaning to DILIGENT?", "topic": "Verbal", "difficulty": "easy", "options": [{"id": "A", "text": "Lazy"}, {"id": "B", "text": "Careless"}, {"id": "C", "text": "Hardworking"}, {"id": "D", "text": "Cheerful"}, {"id": "E", "text": "Rude"}], "correctAnswer": "C"},
    {"text": "A sequence follows a pattern: 3, 6, 11, 18, 27, ___. What is the next number?", "topic": "Logical", "difficulty": "medium", "options": [{"id": "A", "text": "36"}, {"id": "B", "text": "38"}, {"id": "C", "text": "40"}, {"id": "D", "text": "35"}, {"id": "E", "text": "42"}], "correctAnswer": "B"},
    {"text": "A factory produces 1,200 units in 8 hours. How many units will it produce in 15 hours at the same rate?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "2,000"}, {"id": "B", "text": "1,800"}, {"id": "C", "text": "2,250"}, {"id": "D", "text": "2,100"}, {"id": "E", "text": "1,950"}], "correctAnswer": "C"},
    {"text": "Which pair of words is most OPPOSITE in meaning? TACITURN : ?", "topic": "Verbal", "difficulty": "medium", "options": [{"id": "A", "text": "Silent"}, {"id": "B", "text": "Garrulous"}, {"id": "C", "text": "Timid"}, {"id": "D", "text": "Grumpy"}, {"id": "E", "text": "Pensive"}], "correctAnswer": "B"},
    {"text": "Five people sit in a row. Anna sits to the left of Ben. Ben sits to the left of Cara. Dan sits to the right of Cara. Eve sits between Anna and Ben. Who sits in the middle?", "topic": "Logical", "difficulty": "medium", "options": [{"id": "A", "text": "Anna"}, {"id": "B", "text": "Ben"}, {"id": "C", "text": "Cara"}, {"id": "D", "text": "Dan"}, {"id": "E", "text": "Eve"}], "correctAnswer": "E"},
    {"text": "A recipe needs 250g of flour to make 10 biscuits. How much flour is needed to make 35 biscuits?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "750g"}, {"id": "B", "text": "850g"}, {"id": "C", "text": "875g"}, {"id": "D", "text": "900g"}, {"id": "E", "text": "800g"}], "correctAnswer": "C"},
]

async def migrate():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tls=True,
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000,
    )
    db = client['educraft']

    # Math test
    existing_math = await db['admin_tests'].find_one({'course_id': MATH_COURSE_ID})
    if not existing_math:
        math_doc = {
            "course_id": MATH_COURSE_ID,
            "title": "Mathematics Assessment Paper",
            "description": "Basic maths, fractions & geometry",
            "duration_minutes": 45,
            "is_free": True,
            "questions": [{"id": str(ObjectId()), **q} for q in math_questions],
            "total_questions": len(math_questions),
            "total_marks": len(math_questions),
            "created_at": datetime.now(timezone.utc),
        }
        await db['admin_tests'].insert_one(math_doc)
        print(f"Migrated Mathematics: {len(math_questions)} questions")
    else:
        print("Mathematics test already exists:", existing_math.get('title'))

    # Reasoning test
    existing_reasoning = await db['admin_tests'].find_one({'course_id': REASONING_COURSE_ID})
    if not existing_reasoning:
        reasoning_doc = {
            "course_id": REASONING_COURSE_ID,
            "title": "Reasoning Assessment Paper",
            "description": "Numerical | Logical | Verbal Reasoning",
            "duration_minutes": 45,
            "is_free": True,
            "questions": [{"id": str(ObjectId()), **q} for q in reasoning_questions],
            "total_questions": len(reasoning_questions),
            "total_marks": len(reasoning_questions),
            "created_at": datetime.now(timezone.utc),
        }
        await db['admin_tests'].insert_one(reasoning_doc)
        print(f"Migrated Reasoning: {len(reasoning_questions)} questions")
    else:
        print("Reasoning test already exists:", existing_reasoning.get('title'))

    print("Done!")
    client.close()

asyncio.run(migrate())


# import asyncio
# from motor.motor_asyncio import AsyncIOMotorClient
# from datetime import datetime, timezone
# from bson import ObjectId

# MATH_COURSE_ID = "6a10c2bb2069307f7a5b63d6"  # Mathematics ka _id
# REASONING_COURSE_ID = "6a10c2e32069307f7a5b63d7"  # Reasoning ka _id

# math_questions = [
#     {"text": "A bag contains 5 red balls and 3 blue balls. One ball is picked at random. What is the probability of picking a blue ball?", "topic": "Probability", "difficulty": "easy", "options": [{"id": "A", "text": "3/5"}, {"id": "B", "text": "3/8"}, {"id": "C", "text": "5/8"}, {"id": "D", "text": "1/2"}], "correctAnswer": "B"},
#     {"text": "What is 25% of 200?", "topic": "Percentages", "difficulty": "easy", "options": [{"id": "A", "text": "25"}, {"id": "B", "text": "40"}, {"id": "C", "text": "50"}, {"id": "D", "text": "75"}], "correctAnswer": "C"},
#     {"text": "A notebook costs $4. How much do 6 notebooks cost?", "topic": "Multiplication", "difficulty": "easy", "options": [{"id": "A", "text": "$20"}, {"id": "B", "text": "$22"}, {"id": "C", "text": "$24"}, {"id": "D", "text": "$26"}], "correctAnswer": "C"},
#     {"text": "What is the area of a rectangle with length 8 cm and width 5 cm?", "topic": "Geometry", "difficulty": "easy", "options": [{"id": "A", "text": "13 cm²"}, {"id": "B", "text": "26 cm²"}, {"id": "C", "text": "40 cm²"}, {"id": "D", "text": "80 cm²"}], "correctAnswer": "C"},
#     {"text": "A car travels 180 km in 3 hours. What is its average speed?", "topic": "Speed", "difficulty": "easy", "options": [{"id": "A", "text": "50 km/h"}, {"id": "B", "text": "60 km/h"}, {"id": "C", "text": "70 km/h"}, {"id": "D", "text": "80 km/h"}], "correctAnswer": "B"},
#     {"text": "What fraction is equivalent to 0.75?", "topic": "Fractions", "difficulty": "easy", "options": [{"id": "A", "text": "1/2"}, {"id": "B", "text": "2/3"}, {"id": "C", "text": "3/4"}, {"id": "D", "text": "4/5"}], "correctAnswer": "C"},
#     {"text": "If 3 pencils cost $9, how much does 1 pencil cost?", "topic": "Division", "difficulty": "easy", "options": [{"id": "A", "text": "$2"}, {"id": "B", "text": "$3"}, {"id": "C", "text": "$4"}, {"id": "D", "text": "$5"}], "correctAnswer": "B"},
#     {"text": "What is the perimeter of a square with side 7 cm?", "topic": "Geometry", "difficulty": "easy", "options": [{"id": "A", "text": "14 cm"}, {"id": "B", "text": "21 cm"}, {"id": "C", "text": "28 cm"}, {"id": "D", "text": "49 cm"}], "correctAnswer": "C"},
#     {"text": "A pizza is cut into 8 equal slices. If 3 slices are eaten, what fraction remains?", "topic": "Fractions", "difficulty": "easy", "options": [{"id": "A", "text": "3/8"}, {"id": "B", "text": "5/8"}, {"id": "C", "text": "1/2"}, {"id": "D", "text": "7/8"}], "correctAnswer": "B"},
#     {"text": "What is 15% of 80?", "topic": "Percentages", "difficulty": "easy", "options": [{"id": "A", "text": "10"}, {"id": "B", "text": "12"}, {"id": "C", "text": "15"}, {"id": "D", "text": "18"}], "correctAnswer": "B"},
# ]

# reasoning_questions = [
#     {"text": "A shopkeeper buys 48 pens at £0.75 each and sells them at £1.20 each. What is his total profit?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "£14.40"}, {"id": "B", "text": "£21.60"}, {"id": "C", "text": "£57.60"}, {"id": "D", "text": "£36.00"}, {"id": "E", "text": "£18.40"}], "correctAnswer": "A"},
#     {"text": "All cats are animals. Some animals are dogs. Which of the following must be true?", "topic": "Logical", "difficulty": "medium", "options": [{"id": "A", "text": "All cats are dogs"}, {"id": "B", "text": "Some dogs are cats"}, {"id": "C", "text": "All animals are cats"}, {"id": "D", "text": "Cats are animals"}, {"id": "E", "text": "All dogs are animals"}], "correctAnswer": "D"},
#     {"text": "Choose the word most similar in meaning to LUCID.", "topic": "Verbal", "difficulty": "easy", "options": [{"id": "A", "text": "Confusing"}, {"id": "B", "text": "Clear"}, {"id": "C", "text": "Dark"}, {"id": "D", "text": "Lengthy"}, {"id": "E", "text": "Loud"}], "correctAnswer": "B"},
#     {"text": "What is 15% of 340?", "topic": "Numerical", "difficulty": "easy", "options": [{"id": "A", "text": "48"}, {"id": "B", "text": "51"}, {"id": "C", "text": "54"}, {"id": "D", "text": "45"}, {"id": "E", "text": "57"}], "correctAnswer": "B"},
#     {"text": "Which word is most similar in meaning to DILIGENT?", "topic": "Verbal", "difficulty": "easy", "options": [{"id": "A", "text": "Lazy"}, {"id": "B", "text": "Careless"}, {"id": "C", "text": "Hardworking"}, {"id": "D", "text": "Cheerful"}, {"id": "E", "text": "Rude"}], "correctAnswer": "C"},
# ]

# async def migrate():
#     client = AsyncIOMotorClient('mongodb://localhost:27017')
#     db = client['educraft']

#     # Math test
#     existing_math = await db['admin_tests'].find_one({'course_id': MATH_COURSE_ID})
#     if not existing_math:
#         math_doc = {
#             "course_id": MATH_COURSE_ID,
#             "title": "Mathematics Assessment Paper",
#             "description": "Basic maths, fractions & geometry",
#             "duration_minutes": 45,
#             "is_free": True,
#             "questions": [{"id": str(ObjectId()), **q} for q in math_questions],
#             "total_questions": len(math_questions),
#             "total_marks": len(math_questions),
#             "created_at": datetime.now(timezone.utc),
#         }
#         await db['admin_tests'].insert_one(math_doc)
#         print(f"Migrated Mathematics test: {len(math_questions)} questions")
#     else:
#         print("Mathematics test already exists")

#     # Reasoning test
#     existing_reasoning = await db['admin_tests'].find_one({'course_id': REASONING_COURSE_ID})
#     if not existing_reasoning:
#         reasoning_doc = {
#             "course_id": REASONING_COURSE_ID,
#             "title": "Reasoning Assessment Paper",
#             "description": "Numerical | Logical | Verbal Reasoning",
#             "duration_minutes": 45,
#             "is_free": True,
#             "questions": [{"id": str(ObjectId()), **q} for q in reasoning_questions],
#             "total_questions": len(reasoning_questions),
#             "total_marks": len(reasoning_questions),
#             "created_at": datetime.now(timezone.utc),
#         }
#         await db['admin_tests'].insert_one(reasoning_doc)
#         print(f"Migrated Reasoning test: {len(reasoning_questions)} questions")
#     else:
#         print("Reasoning test already exists")

#     print("Done!")
#     client.close()

# asyncio.run(migrate())