from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.db.database import get_database
from fastapi import Depends
from datetime import datetime, timezone

router = APIRouter(tags=["Public"])


@router.get("/bundles")
async def public_list_bundles(db=Depends(get_database)):
    """Frontend ke liye — sirf published bundles"""
    bundles = await db["bundles"].find({"is_published": True}).sort("created_at", 1).to_list(100)
    result = []
    for b in bundles:
        test_count = await db["tests"].count_documents({"bundle_id": str(b["_id"])})
        result.append({
            "_id":         str(b["_id"]),
            "title":       b.get("title", ""),
            "description": b.get("description", ""),
            "price":       b.get("price", 0),
            "is_free":     b.get("is_free", False),
            "points":      b.get("points", []),
            "test_count":  test_count,
        })
    return {"data": result}


@router.get("/subjects/{subject_id}/tests")
async def public_subject_tests(subject_id: str, db=Depends(get_database)):
    """Subject ke tests — frontend ke liye"""
    tests = await db["tests"].find({"subject_id": subject_id}).sort("created_at", 1).to_list(100)
    return {
        "data": [
            {
                "_id":            str(t["_id"]),
                "title":          t.get("title", ""),
                "duration":       t.get("duration_minutes", 40),
                "is_free":        t.get("is_free", False),
                "question_count": len(t.get("questions", [])),
                "type":           t.get("type", "mcq"),  # ← writing ya mcq
            }
            for t in tests
        ]
    }


@router.get("/bundles/{bundle_id}")
async def public_get_bundle(bundle_id: str, db=Depends(get_database)):
    """Single bundle detail — frontend bundle detail page ke liye"""
    if not ObjectId.is_valid(bundle_id):
        raise HTTPException(status_code=400, detail="Invalid bundle ID")

    b = await db["bundles"].find_one({"_id": ObjectId(bundle_id), "is_published": True})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")

    tests = await db["tests"].find({"bundle_id": bundle_id}).to_list(100)

    return {
        "data": {
            "_id":         str(b["_id"]),
            "title":       b.get("title", ""),
            "description": b.get("description", ""),
            "price":       b.get("price", 0),
            "is_free":     b.get("is_free", False),
            "points":      b.get("points", []),
            "tests": [
                {
                    "_id":            str(t["_id"]),
                    "title":          t.get("title", ""),
                    "subject":        t.get("subject", ""),
                    "duration":       t.get("duration_minutes", 40),
                    "is_free":        t.get("is_free", False),
                    "question_count": len(t.get("questions", [])),
                    "type":           t.get("type", "mcq"),  # ← writing ya mcq
                }
                for t in tests
            ],
        }
    }


@router.get("/tests/{test_id}")
async def public_get_test(test_id: str, db=Depends(get_database)):
    """Quiz ke liye test fetch karo — no auth required"""
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")

    t = await db["tests"].find_one({"_id": ObjectId(test_id)})
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")

    return {
        "data": {
            "_id":            str(t["_id"]),
            "title":          t.get("title", ""),
            "bundle_id":      t.get("bundle_id", ""),
            "subject_id":     t.get("subject_id", ""),
            "duration":       t.get("duration_minutes", 40),
            "is_free":        t.get("is_free", False),
            "type":           t.get("type", "mcq"),  # ← writing ya mcq
            "question_count": len(t.get("questions", [])),
            "questions":      t.get("questions", []),
        }
    }


@router.get("/bundles/{bundle_id}/subjects")
async def public_list_subjects(bundle_id: str, db=Depends(get_database)):
    subjects = await db["subjects"].find({"bundle_id": bundle_id}).sort("order", 1).to_list(20)
    result = []
    for s in subjects:
        test_count = await db["tests"].count_documents({"subject_id": str(s["_id"])})
        result.append({
            "_id":        str(s["_id"]),
            "name":       s.get("name", ""),
            "color":      s.get("color", "#6366F1"),
            "icon":       s.get("icon", "BookOpen"),
            "test_count": test_count,
        })
    return {"data": result}


@router.post("/quiz/results")
async def save_quiz_result(body: dict, db=Depends(get_database)):
    """Quiz result save karo — frontend se call hoga"""
    from datetime import datetime, timezone

    doc = {
        "test_id":     body.get("test_id", ""),
        "test_title":  body.get("test_title", ""),
        "bundle":      body.get("bundle", ""),
        "score":       body.get("score", 0),
        "total_marks": body.get("total_marks", 0),
        "correct":     body.get("correct", 0),
        "incorrect":   body.get("incorrect", 0),
        "skipped":     body.get("skipped", 0),
        "accuracy":    body.get("accuracy", 0),
        "time_spent":  body.get("time_spent", 0),
        "type":        body.get("type", "mcq"),
        "created_at":  datetime.now(timezone.utc),
    }
    await db["quiz_results"].insert_one(doc)
    return {"message": "Result saved"}

@router.post("/coupons/validate")
async def validate_coupon(body: dict, db=Depends(get_database)):
    code = body.get("code", "").strip().upper()
    if not code:
        raise HTTPException(status_code=400, detail="Coupon code required")

    c = await db["coupons"].find_one({"code": code})
    if not c:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    if not c.get("is_active", True):
        raise HTTPException(status_code=400, detail="Coupon is no longer active")

    # Check expiry
    if c.get("expiry_date"):
        from datetime import datetime
        expiry = c["expiry_date"]
        if isinstance(expiry, str):
            expiry = datetime.fromisoformat(expiry)
        if datetime.now(timezone.utc) > expiry:
            raise HTTPException(status_code=400, detail="Coupon has expired")

    # Check max uses
    max_uses = c.get("max_uses", 0)
    if max_uses > 0 and c.get("used_count", 0) >= max_uses:
        raise HTTPException(status_code=400, detail="Coupon usage limit reached")

    return {
        "data": {
            "code":           c["code"],
            "discount_type":  c.get("discount_type", "percent"),
            "discount_value": c.get("discount_value", 0),
        }
    }











# # ═════════════════════════════════════════════════════════════════════════════
# # PUBLIC ROUTES — No auth required, website frontend use karega
# # app/api/routes/public.py mein yeh add karo
# # ═════════════════════════════════════════════════════════════════════════════

# from fastapi import APIRouter, HTTPException
# from bson import ObjectId
# from app.db.database import get_database
# from fastapi import Depends

# router = APIRouter(tags=["Public"])


# @router.get("/bundles")
# async def public_list_bundles(db=Depends(get_database)):
#     """Frontend ke liye — sirf published bundles"""
#     bundles = await db["bundles"].find({"is_published": True}).sort("created_at", 1).to_list(100)
#     result = []
#     for b in bundles:
#         test_count = await db["tests"].count_documents({"bundle_id": str(b["_id"])})
#         result.append({
#             "_id":         str(b["_id"]),
#             "title":       b.get("title", ""),
#             "description": b.get("description", ""),
#             "price":       b.get("price", 0),
#             "is_free":     b.get("is_free", False),
#             "points":      b.get("points", []),
#             "test_count":  test_count,
#         })
#     return {"data": result}

# @router.get("/subjects/{subject_id}/tests")
# async def public_subject_tests(subject_id: str, db=Depends(get_database)):
#     """Subject ke tests — frontend ke liye"""
#     tests = await db["tests"].find({"subject_id": subject_id}).sort("created_at", 1).to_list(100)
#     return {
#         "data": [
#             {
#                 "_id":            str(t["_id"]),
#                 "title":          t.get("title", ""),
#                 "duration":       t.get("duration_minutes", 40),
#                 "is_free":        t.get("is_free", False),
#                 "question_count": len(t.get("questions", [])),
#             }
#             for t in tests
#         ]
#     }


# @router.get("/bundles/{bundle_id}")
# async def public_get_bundle(bundle_id: str, db=Depends(get_database)):
#     """Single bundle detail — frontend bundle detail page ke liye"""
#     if not ObjectId.is_valid(bundle_id):
#         raise HTTPException(status_code=400, detail="Invalid bundle ID")
    
#     b = await db["bundles"].find_one({"_id": ObjectId(bundle_id), "is_published": True})
#     if not b:
#         raise HTTPException(status_code=404, detail="Bundle not found")
    
#     tests = await db["tests"].find({"bundle_id": bundle_id}).to_list(100)
    
#     return {
#         "data": {
#             "_id":         str(b["_id"]),
#             "title":       b.get("title", ""),
#             "description": b.get("description", ""),
#             "price":       b.get("price", 0),
#             "is_free":     b.get("is_free", False),
#             "points":      b.get("points", []),
#             "tests": [
#                 {
#                     "_id":      str(t["_id"]),
#                     "title":    t.get("title", ""),
#                     "subject":  t.get("subject", ""),
#                     "duration": t.get("duration_minutes", 40),
#                     "is_free":  t.get("is_free", False),
#                     "question_count": len(t.get("questions", [])),
#                 }
#                 for t in tests
#             ],
#         }
#     }
# # public.py mein add karo — test fetch for quiz
# # Existing routes ke saath

# @router.get("/tests/{test_id}")
# async def public_get_test(test_id: str, db=Depends(get_database)):
#     """Quiz ke liye test fetch karo — no auth required"""
#     from bson import ObjectId
#     if not ObjectId.is_valid(test_id):
#         raise HTTPException(status_code=400, detail="Invalid test ID")
    
#     t = await db["tests"].find_one({"_id": ObjectId(test_id)})
#     if not t:
#         raise HTTPException(status_code=404, detail="Test not found")
    
#     return {
#         "data": {
#             "_id":            str(t["_id"]),
#             "title":          t.get("title", ""),
#             "bundle_id":      t.get("bundle_id", ""),
#             "subject_id":     t.get("subject_id", ""),
#             "duration":       t.get("duration_minutes", 40),
#             "is_free":        t.get("is_free", False),
#             "question_count": len(t.get("questions", [])),
#             "questions":      t.get("questions", []),
#         }
#     }

# @router.get("/bundles/{bundle_id}/subjects")
# async def public_list_subjects(bundle_id: str, db=Depends(get_database)):
#     subjects = await db["subjects"].find({"bundle_id": bundle_id}).sort("order", 1).to_list(20)
#     result = []
#     for s in subjects:
#         test_count = await db["tests"].count_documents({"subject_id": str(s["_id"])})
#         result.append({
#             "_id": str(s["_id"]),
#             "name": s.get("name", ""),
#             "color": s.get("color", "#6366F1"),
#             "icon": s.get("icon", "BookOpen"),
#             "test_count": test_count,
#         })
#     return {"data": result}

# # public.py ke end mein add karo

# @router.post("/quiz/results")
# async def save_quiz_result(body: dict, db=Depends(get_database)):
#     """Quiz result save karo — frontend se call hoga"""
#     from datetime import datetime, timezone
    
#     doc = {
#         "test_id":       body.get("test_id", ""),
#         "test_title":    body.get("test_title", ""),
#         "bundle":        body.get("bundle", ""),
#         "score":         body.get("score", 0),
#         "total_marks":   body.get("total_marks", 0),
#         "correct":       body.get("correct", 0),
#         "incorrect":     body.get("incorrect", 0),
#         "skipped":       body.get("skipped", 0),
#         "accuracy":      body.get("accuracy", 0),
#         "time_spent":    body.get("time_spent", 0),
#         "type":          body.get("type", "mcq"),
#         "created_at":    datetime.now(timezone.utc),
#     }
#     await db["quiz_results"].insert_one(doc)
#     return {"message": "Result saved"}



