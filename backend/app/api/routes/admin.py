from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File, Form
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional
import csv, io

from app.core.dependencies import get_current_admin, get_current_user
from app.core.security import create_access_token
from app.db.database import get_database
from passlib.context import CryptContext

router = APIRouter(tags=["Admin"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Helper ───────────────────────────────────────────────────────────────────
def oid(id: str) -> ObjectId:
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    return ObjectId(id)


# ═════════════════════════════════════════════════════════════════════════════
# AUTH  —  POST /api/admin/login
# ═════════════════════════════════════════════════════════════════════════════

@router.post("/login")
async def admin_login(body: dict, db=Depends(get_database)):
    email    = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = await db["users"].find_one({"email": email, "role": "admin"})
    if not user or not pwd_context.verify(password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"]), "role": "admin"})

    return {
        "token": token,
        "admin": {
            "_id":   str(user["_id"]),
            "name":  f"{user.get('first_name','')} {user.get('last_name','')}".strip(),
            "email": user["email"],
            "role":  "admin",
        }
    }


# ═════════════════════════════════════════════════════════════════════════════
# DASHBOARD  —  GET /api/admin/dashboard
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/dashboard")
async def dashboard(admin=Depends(get_current_admin), db=Depends(get_database)):
    total_students    = await db["users"].count_documents({"role": "student"})
    total_bundles     = await db["bundles"].count_documents({})
    total_tests       = await db["tests"].count_documents({})
    total_enrollments = await db["enrollments"].count_documents({})
    paid_enrollments  = await db["enrollments"].count_documents({"payment_status": "paid"})
    unread_messages   = await db["messages"].count_documents({"read": False})

    pipeline_rev = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    rev_result    = await db["enrollments"].aggregate(pipeline_rev).to_list(1)
    total_revenue = rev_result[0]["total"] if rev_result else 0

    pipeline_trend = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {
            "_id": {"year": {"$year": "$created_at"}, "month": {"$month": "$created_at"}},
            "revenue":     {"$sum": "$amount"},
            "enrollments": {"$sum": 1},
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {"$limit": 6},
    ]
    trend_raw = await db["enrollments"].aggregate(pipeline_trend).to_list(6)
    import calendar
    monthly_trend = [
        {
            "month":       f"{calendar.month_abbr[t['_id']['month']]} {t['_id']['year']}",
            "revenue":     t["revenue"],
            "enrollments": t["enrollments"],
        }
        for t in trend_raw
    ]

    recent_raw = await db["enrollments"].find().sort("created_at", -1).limit(5).to_list(5)
    recent_enrollments = []
    for e in recent_raw:
        b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
        recent_enrollments.append({
            "_id":            str(e["_id"]),
            "student_name":   e.get("student_name", ""),
            "email":          e.get("email", ""),
            "payment_status": e.get("payment_status", "pending"),
            "amount":         e.get("amount", 0),
            "bundle_title":   b["title"] if b else "—",
            "created_at":     e.get("created_at"),
        })

    pipeline_bundle = [
        {"$group": {"_id": "$bundle_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    bundle_stats_raw = await db["enrollments"].aggregate(pipeline_bundle).to_list(5)
    bundle_stats = []
    for b in bundle_stats_raw:
        bundle = await db["bundles"].find_one({"_id": ObjectId(b["_id"])}) if b["_id"] else None
        bundle_stats.append({
            "bundle_id":    b["_id"],
            "bundle_title": bundle["title"] if bundle else "—",
            "count":        b["count"],
        })

    return {
        "stats": {
            "total_students":    total_students,
            "total_bundles":     total_bundles,
            "total_tests":       total_tests,
            "total_enrollments": total_enrollments,
            "paid_enrollments":  paid_enrollments,
            "total_revenue":     total_revenue,
            "unread_messages":   unread_messages,
        },
        "monthly_trend":      monthly_trend,
        "bundle_stats":       bundle_stats,
        "recent_enrollments": recent_enrollments,
    }


# ═════════════════════════════════════════════════════════════════════════════
# BUNDLES  —  /api/admin/bundles
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/bundles")
async def list_bundles(admin=Depends(get_current_admin), db=Depends(get_database)):
    bundles = await db["bundles"].find().sort("created_at", -1).to_list(100)
    result = []
    for b in bundles:
        test_count   = await db["tests"].count_documents({"bundle_id": str(b["_id"])})
        enroll_count = await db["enrollments"].count_documents({"bundle_id": str(b["_id"])})
        result.append({
            "_id":          str(b["_id"]),
            "title":        b.get("title", ""),
            "description":  b.get("description", ""),
            "price":        b.get("price", 0),
            "is_free":      b.get("is_free", False),
            "is_published": b.get("is_published", True),
            "points":       b.get("points", []),
            "test_count":   test_count,
            "enroll_count": enroll_count,
            "created_at":   b.get("created_at"),
        })
    return {"data": result}


@router.post("/bundles")
async def create_bundle(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    doc = {
        "title":        body.get("title", "").strip(),
        "description":  body.get("description", "").strip(),
        "price":        float(body.get("price", 0)),
        "is_free":      bool(body.get("is_free", False)),
        "is_published": bool(body.get("is_published", True)),
        "points":       body.get("points", []),
        "created_at":   datetime.now(timezone.utc),
        "updated_at":   datetime.now(timezone.utc),
    }
    result = await db["bundles"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.put("/bundles/{bundle_id}")
async def update_bundle(bundle_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    updates = {"updated_at": datetime.now(timezone.utc)}
    for field in ["title", "description", "price", "is_free", "is_published", "points"]:
        if field in body:
            updates[field] = body[field]

    result = await db["bundles"].find_one_and_update(
        {"_id": oid(bundle_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.patch("/bundles/{bundle_id}/toggle")
async def toggle_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    b = await db["bundles"].find_one({"_id": oid(bundle_id)})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")
    new_val = not b.get("is_published", True)
    await db["bundles"].update_one({"_id": oid(bundle_id)}, {"$set": {"is_published": new_val}})
    return {"data": {**b, "_id": str(b["_id"]), "is_published": new_val}}


@router.delete("/bundles/{bundle_id}")
async def delete_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["tests"].delete_many({"bundle_id": bundle_id})
    result = await db["bundles"].delete_one({"_id": oid(bundle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"message": "Bundle and its tests deleted"}


# ═════════════════════════════════════════════════════════════════════════════
# TESTS  —  /api/admin/tests
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/tests")
async def list_tests(
    bundle_id: Optional[str] = Query(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {}
    if bundle_id:
        query["bundle_id"] = bundle_id
    tests = await db["tests"].find(query).sort("created_at", -1).to_list(200)
    result = []
    for t in tests:
        b = await db["bundles"].find_one({"_id": ObjectId(t["bundle_id"])}) if t.get("bundle_id") else None
        result.append({
            "_id":            str(t["_id"]),
            "title":          t.get("title", ""),
            "subject":        t.get("subject", ""),
            "duration":       t.get("duration_minutes", 40),
            "is_free":        t.get("is_free", False),
            "question_count": len(t.get("questions", [])),
            "bundle_id":      t.get("bundle_id", ""),
            "bundle_title":   b["title"] if b else "—",
            "created_at":     t.get("created_at"),
        })
    return {"data": result}


@router.post("/tests")
async def create_test(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    bundle_id = body.get("bundle_id", "")
    if bundle_id and not ObjectId.is_valid(bundle_id):
        raise HTTPException(status_code=400, detail="Invalid bundle ID")

    questions = []
    for q in body.get("questions", []):
        questions.append({
            "id":          str(ObjectId()),
            "text":        q.get("text", ""),
            "options":     q.get("options", []),
            "correct":     q.get("correct", "0"),
            "subject":     q.get("subject", body.get("subject", "")),
            "explanation": q.get("explanation", ""),
        })

    doc = {
        "title":            body.get("title", "").strip(),
        "subject":          body.get("subject", "").strip(),
        "duration_minutes": int(body.get("duration", 40)),
        "is_free":          bool(body.get("is_free", False)),
        "bundle_id":        bundle_id,
        "questions":        questions,
        "created_at":       datetime.now(timezone.utc),
        "updated_at":       datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.get("/tests/{test_id}")
async def get_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    t = await db["tests"].find_one({"_id": oid(test_id)})
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    return {
        "data": {
            "_id":            str(t["_id"]),
            "title":          t.get("title", ""),
            "subject":        t.get("subject", ""),
            "duration":       t.get("duration_minutes", 40),
            "is_free":        t.get("is_free", False),
            "bundle_id":      t.get("bundle_id", ""),
            "questions":      t.get("questions", []),
            "question_count": len(t.get("questions", [])),
        }
    }


@router.put("/tests/{test_id}")
async def update_test(test_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    updates = {"updated_at": datetime.now(timezone.utc)}
    for field in ["title", "subject", "is_free", "bundle_id"]:
        if field in body:
            updates[field] = body[field]
    if "duration" in body:
        updates["duration_minutes"] = int(body["duration"])
    if "questions" in body:
        updates["questions"] = body["questions"]

    result = await db["tests"].find_one_and_update(
        {"_id": oid(test_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.delete("/tests/{test_id}")
async def delete_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["tests"].delete_one({"_id": oid(test_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted"}


@router.post("/tests/{test_id}/questions/upload-csv")
async def upload_questions_csv(
    test_id: str,
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    t = await db["tests"].find_one({"_id": oid(test_id)})
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")

    content = await file.read()
    text    = content.decode("utf-8-sig")
    reader  = csv.DictReader(io.StringIO(text))

    letter_map = {"A": "0", "B": "1", "C": "2", "D": "3",
                  "a": "0", "b": "1", "c": "2", "d": "3"}
    questions = []
    errors    = []

    for i, row in enumerate(reader, start=2):
        q_text      = row.get("question", "").strip()
        a           = row.get("optionA", row.get("option_a", "")).strip()
        b           = row.get("optionB", row.get("option_b", "")).strip()
        c           = row.get("optionC", row.get("option_c", "")).strip()
        d           = row.get("optionD", row.get("option_d", "")).strip()
        correct_raw = row.get("correct", "").strip()

        if not all([q_text, a, b, c, d]):
            errors.append(f"Row {i}: missing fields")
            continue
        if correct_raw not in letter_map:
            errors.append(f"Row {i}: correct must be A/B/C/D")
            continue

        questions.append({
            "id":          str(ObjectId()),
            "text":        q_text,
            "options":     [a, b, c, d],
            "correct":     letter_map[correct_raw],
            "explanation": row.get("explanation", "").strip(),
        })

    if not questions:
        raise HTTPException(status_code=400, detail=f"No valid questions. Errors: {errors[:3]}")

    await db["tests"].update_one(
        {"_id": oid(test_id)},
        {"$push": {"questions": {"$each": questions}}}
    )
    return {"data": {"uploaded": len(questions), "errors": errors}}


# ═════════════════════════════════════════════════════════════════════════════
# STUDENTS  —  /api/admin/students
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/students")
async def list_students(
    search: Optional[str] = Query(None),
    page:   int = Query(1, ge=1),
    limit:  int = Query(20, ge=1, le=100),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query: dict = {"role": "student"}
    if search:
        query["$or"] = [
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name":  {"$regex": search, "$options": "i"}},
            {"email":      {"$regex": search, "$options": "i"}},
        ]

    total  = await db["users"].count_documents(query)
    pages  = (total + limit - 1) // limit
    raw    = await db["users"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

    result = []
    for u in raw:
        enrollments   = await db["enrollments"].find({"user_id": str(u["_id"])}).to_list(50)
        bundle_titles = []
        for e in enrollments:
            b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
            if b:
                bundle_titles.append(b["title"])

        result.append({
            "_id":        str(u["_id"]),
            "name":       f"{u.get('first_name','')} {u.get('last_name','')}".strip(),
            "email":      u.get("email", ""),
            "is_active":  u.get("is_active", True),
            "bundles":    bundle_titles,
            "joined":     u.get("created_at"),
            "last_login": u.get("last_login"),
            "provider":   u.get("provider", "email"),
        })

    return {"data": result, "pagination": {"total": total, "pages": pages, "page": page}}


@router.patch("/students/{student_id}/toggle")
async def toggle_student(student_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    u = await db["users"].find_one({"_id": oid(student_id)})
    if not u:
        raise HTTPException(status_code=404, detail="Student not found")
    new_val = not u.get("is_active", True)
    await db["users"].update_one({"_id": oid(student_id)}, {"$set": {"is_active": new_val}})
    return {"data": {"is_active": new_val}}


@router.delete("/students/{student_id}")
async def delete_student(student_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["users"].delete_one({"_id": oid(student_id), "role": "student"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    await db["enrollments"].delete_many({"user_id": student_id})
    return {"message": "Student deleted"}


# ═════════════════════════════════════════════════════════════════════════════
# ENROLLMENTS  —  /api/admin/enrollments
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/enrollments")
async def list_enrollments(
    search:         Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    page:           int = Query(1, ge=1),
    limit:          int = Query(20, ge=1, le=100),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query: dict = {}
    if payment_status and payment_status != "All":
        query["payment_status"] = payment_status
    if search:
        query["$or"] = [
            {"student_name": {"$regex": search, "$options": "i"}},
            {"email":        {"$regex": search, "$options": "i"}},
        ]

    total = await db["enrollments"].count_documents(query)
    pages = (total + limit - 1) // limit
    raw   = await db["enrollments"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

    result = []
    for e in raw:
        b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
        result.append({
            "_id":            str(e["_id"]),
            "student_name":   e.get("student_name", ""),
            "email":          e.get("email", ""),
            "bundle_id":      e.get("bundle_id", ""),
            "bundle_title":   b["title"] if b else "—",
            "amount":         e.get("amount", 0),
            "payment_status": e.get("payment_status", "pending"),
            "access_active":  e.get("access_active", False),
            "created_at":     e.get("created_at"),
        })

    return {"data": result, "pagination": {"total": total, "pages": pages, "page": page}}


@router.patch("/enrollments/{enrollment_id}/status")
async def update_enrollment_status(
    enrollment_id: str,
    body: dict,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    status_val = body.get("payment_status")
    if status_val not in ["paid", "pending", "failed", "refunded"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    updates = {
        "payment_status": status_val,
        "access_active":  status_val == "paid",
    }
    result = await db["enrollments"].find_one_and_update(
        {"_id": oid(enrollment_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.patch("/enrollments/{enrollment_id}/access")
async def toggle_enrollment_access(
    enrollment_id: str,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    e = await db["enrollments"].find_one({"_id": oid(enrollment_id)})
    if not e:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    new_val = not e.get("access_active", False)
    await db["enrollments"].update_one({"_id": oid(enrollment_id)}, {"$set": {"access_active": new_val}})
    return {"data": {"access_active": new_val}}


@router.delete("/enrollments/{enrollment_id}")
async def delete_enrollment(enrollment_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["enrollments"].delete_one({"_id": oid(enrollment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Enrollment deleted"}


# ═════════════════════════════════════════════════════════════════════════════
# MESSAGES  —  /api/admin/messages
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/messages")
async def list_messages(
    search:  Optional[str] = Query(None),
    is_read: Optional[bool] = Query(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query: dict = {}
    if is_read is not None:
        query["read"] = is_read
    if search:
        query["$or"] = [
            {"name":    {"$regex": search, "$options": "i"}},
            {"email":   {"$regex": search, "$options": "i"}},
            {"message": {"$regex": search, "$options": "i"}},
        ]

    messages = await db["messages"].find(query).sort("created_at", -1).to_list(200)
    unread   = await db["messages"].count_documents({"read": False})

    return {
        "data": [
            {
                "_id":        str(m["_id"]),
                "name":       m.get("name", ""),
                "email":      m.get("email", ""),
                "message":    m.get("message", ""),
                "type":       m.get("type", "General"),
                "read":       m.get("read", False),
                "created_at": m.get("created_at"),
            }
            for m in messages
        ],
        "unread_count": unread,
    }


@router.patch("/messages/{msg_id}/read")
async def mark_read(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.patch("/messages/{msg_id}/unread")
async def mark_unread(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": False}})
    return {"message": "Marked as unread"}


@router.delete("/messages/{msg_id}")
async def delete_message(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["messages"].delete_one({"_id": oid(msg_id)})
    return {"message": "Message deleted"}


# ═════════════════════════════════════════════════════════════════════════════
# ANALYTICS  —  /api/admin/analytics
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/analytics")
async def analytics(admin=Depends(get_current_admin), db=Depends(get_database)):
    bundles          = await db["bundles"].find().to_list(100)
    bundle_analytics = []
    for b in bundles:
        bid          = str(b["_id"])
        total_enroll = await db["enrollments"].count_documents({"bundle_id": bid})
        paid_enroll  = await db["enrollments"].count_documents({"bundle_id": bid, "payment_status": "paid"})
        rev_pipeline = [
            {"$match": {"bundle_id": bid, "payment_status": "paid"}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        rev_res = await db["enrollments"].aggregate(rev_pipeline).to_list(1)
        revenue = rev_res[0]["total"] if rev_res else 0

        bundle_analytics.append({
            "bundle_id":           bid,
            "bundle_title":        b.get("title", ""),
            "total_enrollments":   total_enroll,
            "paid_enrollments":    paid_enroll,
            "revenue":             revenue,
        })

    tests      = await db["tests"].find().to_list(200)
    test_stats = [
        {
            "_id":            str(t["_id"]),
            "title":          t.get("title", ""),
            "subject":        t.get("subject", ""),
            "question_count": len(t.get("questions", [])),
            "is_free":        t.get("is_free", False),
        }
        for t in tests
    ]

    return {
        "bundle_analytics": bundle_analytics,
        "test_stats":       test_stats,
    }


# ═════════════════════════════════════════════════════════════════════════════
# SETTINGS  —  /api/admin/settings
# ═════════════════════════════════════════════════════════════════════════════

@router.put("/settings/profile")
async def update_profile(
    body: dict,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if body.get("name"):
        parts = body["name"].strip().split(" ", 1)
        updates["first_name"] = parts[0]
        updates["last_name"]  = parts[1] if len(parts) > 1 else ""
    if body.get("email"):
        updates["email"] = body["email"].strip().lower()

    updated = await db["users"].find_one_and_update(
        {"_id": current_user["_id"]}, {"$set": updates}, return_document=True
    )
    return {
        "admin": {
            "_id":   str(updated["_id"]),
            "name":  f"{updated.get('first_name','')} {updated.get('last_name','')}".strip(),
            "email": updated["email"],
        }
    }


@router.put("/settings/password")
async def update_password(
    body: dict,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    if not pwd_context.verify(body.get("current_password", ""), current_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    new_pwd = body.get("new_password", "")
    if len(new_pwd) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    await db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password_hash": pwd_context.hash(new_pwd), "updated_at": datetime.now(timezone.utc)}}
    )
    return {"message": "Password updated successfully"}


# ═════════════════════════════════════════════════════════════════════════════
# PUBLIC ROUTES
# ═════════════════════════════════════════════════════════════════════════════

@router.post("/messages/public")
async def public_create_message(body: dict, db=Depends(get_database)):
    name    = body.get("name", "").strip()
    email   = body.get("email", "").strip()
    message = body.get("message", "").strip()
    if not name or not email or not message:
        raise HTTPException(status_code=400, detail="Name, email and message required")

    await db["messages"].insert_one({
        "name":       name,
        "email":      email,
        "message":    message,
        "type":       body.get("type", "General"),
        "read":       False,
        "created_at": datetime.now(timezone.utc),
    })
    return {"message": "Message sent successfully!"}


# ═════════════════════════════════════════════════════════════════════════════
# SUBJECTS  —  /api/admin/bundles/{bundle_id}/subjects
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/bundles/{bundle_id}/subjects")
async def list_subjects(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    subjects = await db["subjects"].find({"bundle_id": bundle_id}).sort("order", 1).to_list(20)
    result = []
    for s in subjects:
        test_count = await db["tests"].count_documents({"subject_id": str(s["_id"])})
        result.append({
            "_id":        str(s["_id"]),
            "name":       s.get("name", ""),
            "icon":       s.get("icon", "BookOpen"),
            "color":      s.get("color", "#6366F1"),
            "bundle_id":  s.get("bundle_id", ""),
            "order":      s.get("order", 0),
            "test_count": test_count,
        })
    return {"data": result}


@router.post("/bundles/{bundle_id}/subjects")
async def create_subject(bundle_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    b = await db["bundles"].find_one({"_id": oid(bundle_id)})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")

    last  = await db["subjects"].find_one({"bundle_id": bundle_id}, sort=[("order", -1)])
    order = (last.get("order", 0) + 1) if last else 1

    doc = {
        "name":       body.get("name", "").strip(),
        "icon":       body.get("icon", "BookOpen"),
        "color":      body.get("color", "#6366F1"),
        "bundle_id":  bundle_id,
        "order":      order,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["subjects"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.put("/bundles/{bundle_id}/subjects/{subject_id}")
async def update_subject(bundle_id: str, subject_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    updates = {}
    for field in ["name", "icon", "color", "order"]:
        if field in body:
            updates[field] = body[field]

    result = await db["subjects"].find_one_and_update(
        {"_id": oid(subject_id), "bundle_id": bundle_id},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.delete("/bundles/{bundle_id}/subjects/{subject_id}")
async def delete_subject(bundle_id: str, subject_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["tests"].delete_many({"subject_id": subject_id})
    result = await db["subjects"].delete_one({"_id": oid(subject_id), "bundle_id": bundle_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"message": "Subject and its tests deleted"}


# ═════════════════════════════════════════════════════════════════════════════
# TESTS by SUBJECT  —  /api/admin/subjects/{subject_id}/tests
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/subjects/{subject_id}/tests")
async def list_subject_tests(subject_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    tests = await db["tests"].find({"subject_id": subject_id}).sort("created_at", 1).to_list(100)
    return {
        "data": [
            {
                "_id":            str(t["_id"]),
                "title":          t.get("title", ""),
                "subject_id":     t.get("subject_id", ""),
                "bundle_id":      t.get("bundle_id", ""),
                "duration":       t.get("duration_minutes", 40),
                "is_free":        t.get("is_free", False),
                "type":           t.get("type", "mcq"),   # ← include type
                "question_count": len(t.get("questions", [])),
                "created_at":     t.get("created_at"),
            }
            for t in tests
        ]
    }

# ═════════════════════════════════════════════════════════════════════════════
# TESTS by SUBJECT  —  /api/admin/subjects/{subject_id}/tests
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/subjects/{subject_id}/tests")
async def list_subject_tests(subject_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    tests = await db["tests"].find({"subject_id": subject_id}).sort("created_at", 1).to_list(100)
    return {
        "data": [
            {
                "_id":            str(t["_id"]),
                "title":          t.get("title", ""),
                "subject_id":     t.get("subject_id", ""),
                "bundle_id":      t.get("bundle_id", ""),
                "duration":       t.get("duration_minutes", 40),
                "is_free":        t.get("is_free", False),
                "type":           t.get("type", "mcq"),   # ← include type
                "question_count": len(t.get("questions", [])),
                "created_at":     t.get("created_at"),
            }
            for t in tests
        ]
    }


@router.post("/subjects/{subject_id}/tests")
async def create_subject_test(subject_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    """Subject ke andar test create karo — MCQ ya Writing"""
    s = await db["subjects"].find_one({"_id": oid(subject_id)})
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")

    test_type = body.get("type", "mcq")  # "mcq" or "writing"

    questions = []
    if test_type == "writing":
        # Writing test — single prompt stored as one question
        questions.append({
            "id":   str(ObjectId()),
            "text": body.get("prompt", "").strip(),
        })
    else:
        # MCQ test — normal questions with options
        for q in body.get("questions", []):
            questions.append({
                "id":          str(ObjectId()),
                "text":        q.get("text", ""),
                "options":     q.get("options", []),
                "correct":     q.get("correct", "0"),
                "explanation": q.get("explanation", ""),
            })

    doc = {
        "title":            body.get("title", "").strip(),
        "type":             test_type,            # ← save type to MongoDB
        "subject_id":       subject_id,
        "bundle_id":        s.get("bundle_id", ""),
        "duration_minutes": int(body.get("duration", 40)),
        "is_free":          bool(body.get("is_free", False)),
        "questions":        questions,
        "created_at":       datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.post("/subjects/{subject_id}/tests/upload-csv")
async def upload_subject_test_csv(
    subject_id: str,
    title:    str = Form(...),
    duration: int = Form(40),
    is_free:  str = Form("false"),
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    s = await db["subjects"].find_one({"_id": oid(subject_id)})
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")

    content = await file.read()
    text    = content.decode("utf-8-sig")
    reader  = csv.DictReader(io.StringIO(text))

    letter_map = {"A": "0", "B": "1", "C": "2", "D": "3",
                  "a": "0", "b": "1", "c": "2", "d": "3"}
    questions = []
    errors    = []

    for i, row in enumerate(reader, start=2):
        q_text      = row.get("question", "").strip()
        a           = row.get("optionA", row.get("option_a", "")).strip()
        b           = row.get("optionB", row.get("option_b", "")).strip()
        c           = row.get("optionC", row.get("option_c", "")).strip()
        d           = row.get("optionD", row.get("option_d", "")).strip()
        correct_raw = row.get("correct", "").strip()

        if not all([q_text, a, b, c, d]):
            errors.append(f"Row {i}: missing fields")
            continue
        if correct_raw not in letter_map:
            errors.append(f"Row {i}: correct must be A/B/C/D")
            continue

        questions.append({
            "id":          str(ObjectId()),
            "text":        q_text,
            "options":     [a, b, c, d],
            "correct":     letter_map[correct_raw],
            "explanation": row.get("explanation", "").strip(),
        })

    if not questions:
        raise HTTPException(status_code=400, detail=f"No valid questions. Errors: {errors[:3]}")

    doc = {
        "title":            title.strip(),
        "type":             "mcq",               # CSV upload is always MCQ
        "subject_id":       subject_id,
        "bundle_id":        s.get("bundle_id", ""),
        "duration_minutes": duration,
        "is_free":          is_free.lower() == "true",
        "questions":        questions,
        "created_at":       datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id), "question_count": len(questions)}}

@router.post("/subjects/{subject_id}/tests/writing")
async def create_writing_test(
    subject_id: str,
    body: dict,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    """Writing skill test create karo — single prompt, no MCQ options"""
    s = await db["subjects"].find_one({"_id": oid(subject_id)})
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")

    prompt = body.get("prompt", "").strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Writing prompt required")

    doc = {
        "title":            body.get("title", "").strip(),
        "type":             "writing",
        "subject_id":       subject_id,
        "bundle_id":        s.get("bundle_id", ""),
        "duration_minutes": int(body.get("duration", 30)),
        "is_free":          bool(body.get("is_free", False)),
        "questions": [
            {
                "id":      str(ObjectId()),
                "text":    prompt,
                "options": [],
                "correct": "",
            }
        ],
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id), "question_count": 1}}


@router.delete("/subjects/{subject_id}/tests/{test_id}")
async def delete_subject_test(subject_id: str, test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["tests"].delete_one({"_id": oid(test_id), "subject_id": subject_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted"}



@router.post("/subjects/{subject_id}/tests")
async def create_subject_test(subject_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    """Subject ke andar test create karo — MCQ ya Writing"""
    s = await db["subjects"].find_one({"_id": oid(subject_id)})
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")

    test_type = body.get("type", "mcq")  # "mcq" or "writing"

    questions = []
    if test_type == "writing":
        # Writing test — single prompt stored as one question
        questions.append({
            "id":   str(ObjectId()),
            "text": body.get("prompt", "").strip(),
        })
    else:
        # MCQ test — normal questions with options
        for q in body.get("questions", []):
            questions.append({
                "id":          str(ObjectId()),
                "text":        q.get("text", ""),
                "options":     q.get("options", []),
                "correct":     q.get("correct", "0"),
                "explanation": q.get("explanation", ""),
            })

    doc = {
        "title":            body.get("title", "").strip(),
        "type":             test_type,            # ← save type to MongoDB
        "subject_id":       subject_id,
        "bundle_id":        s.get("bundle_id", ""),
        "duration_minutes": int(body.get("duration", 40)),
        "is_free":          bool(body.get("is_free", False)),
        "questions":        questions,
        "created_at":       datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.post("/subjects/{subject_id}/tests/upload-csv")
async def upload_subject_test_csv(
    subject_id: str,
    title:    str = Form(...),
    duration: int = Form(40),
    is_free:  str = Form("false"),
    file: UploadFile = File(...),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    s = await db["subjects"].find_one({"_id": oid(subject_id)})
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")

    content = await file.read()
    text    = content.decode("utf-8-sig")
    reader  = csv.DictReader(io.StringIO(text))

    letter_map = {"A": "0", "B": "1", "C": "2", "D": "3",
                  "a": "0", "b": "1", "c": "2", "d": "3"}
    questions = []
    errors    = []

    for i, row in enumerate(reader, start=2):
        q_text      = row.get("question", "").strip()
        a           = row.get("optionA", row.get("option_a", "")).strip()
        b           = row.get("optionB", row.get("option_b", "")).strip()
        c           = row.get("optionC", row.get("option_c", "")).strip()
        d           = row.get("optionD", row.get("option_d", "")).strip()
        correct_raw = row.get("correct", "").strip()

        if not all([q_text, a, b, c, d]):
            errors.append(f"Row {i}: missing fields")
            continue
        if correct_raw not in letter_map:
            errors.append(f"Row {i}: correct must be A/B/C/D")
            continue

        questions.append({
            "id":          str(ObjectId()),
            "text":        q_text,
            "options":     [a, b, c, d],
            "correct":     letter_map[correct_raw],
            "explanation": row.get("explanation", "").strip(),
        })

    if not questions:
        raise HTTPException(status_code=400, detail=f"No valid questions. Errors: {errors[:3]}")

    doc = {
        "title":            title.strip(),
        "type":             "mcq",               # CSV upload is always MCQ
        "subject_id":       subject_id,
        "bundle_id":        s.get("bundle_id", ""),
        "duration_minutes": duration,
        "is_free":          is_free.lower() == "true",
        "questions":        questions,
        "created_at":       datetime.now(timezone.utc),
    }
    result = await db["tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id), "question_count": len(questions)}}




@router.delete("/subjects/{subject_id}/tests/{test_id}")
async def delete_subject_test(subject_id: str, test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["tests"].delete_one({"_id": oid(test_id), "subject_id": subject_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted"}

# ═════════════════════════════════════════════════════════════════════════════
# COUPONS — /api/admin/coupons
# ═════════════════════════════════════════════════════════════════════════════

@router.get("/coupons")
async def list_coupons(admin=Depends(get_current_admin), db=Depends(get_database)):
    coupons = await db["coupons"].find().sort("created_at", -1).to_list(100)
    return {
        "data": [
            {
                "_id":              str(c["_id"]),
                "code":             c.get("code", ""),
                "discount_type":    c.get("discount_type", "percent"),
                "discount_value":   c.get("discount_value", 0),
                "is_active":        c.get("is_active", True),
                "max_uses":         c.get("max_uses", 0),
                "used_count":       c.get("used_count", 0),
                "expiry_date":      c.get("expiry_date"),
                "created_at":       c.get("created_at"),
            }
            for c in coupons
        ]
    }


@router.post("/coupons")
async def create_coupon(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    print(f"[DEBUG] Create coupon called with: {body}")  # ← ADD THIS
    code = body.get("code", "").strip().upper()
    if not code:
        raise HTTPException(status_code=400, detail="Coupon code required")

    existing = await db["coupons"].find_one({"code": code})
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    doc = {
        "code":           code,
        "discount_type":  body.get("discount_type", "percent"),  # "percent" or "flat"
        "discount_value": float(body.get("discount_value", 0)),
        "is_active":      bool(body.get("is_active", True)),
        "max_uses":       int(body.get("max_uses", 0)),  # 0 = unlimited
        "used_count":     0,
        "expiry_date":    body.get("expiry_date"),
        "created_at":     datetime.now(timezone.utc),
    }
    result = await db["coupons"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.patch("/coupons/{coupon_id}/toggle")
async def toggle_coupon(coupon_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    c = await db["coupons"].find_one({"_id": oid(coupon_id)})
    if not c:
        raise HTTPException(status_code=404, detail="Coupon not found")
    new_val = not c.get("is_active", True)
    await db["coupons"].update_one({"_id": oid(coupon_id)}, {"$set": {"is_active": new_val}})
    return {"data": {"is_active": new_val}}


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(coupon_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["coupons"].delete_one({"_id": oid(coupon_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return {"message": "Coupon deleted"}













# from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File, Form
# from bson import ObjectId
# from datetime import datetime, timezone
# from typing import Optional
# import csv, io

# from app.core.dependencies import get_current_admin, get_current_user
# from app.core.security import create_access_token
# from app.db.database import get_database
# from passlib.context import CryptContext

# router = APIRouter(tags=["Admin"])
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# # ─── Helper ───────────────────────────────────────────────────────────────────
# def oid(id: str) -> ObjectId:
#     if not ObjectId.is_valid(id):
#         raise HTTPException(status_code=400, detail="Invalid ID")
#     return ObjectId(id)


# # ═════════════════════════════════════════════════════════════════════════════
# # AUTH  —  POST /api/admin/login
# # ═════════════════════════════════════════════════════════════════════════════

# @router.post("/login")
# async def admin_login(body: dict, db=Depends(get_database)):
#     email    = body.get("email", "").strip().lower()
#     password = body.get("password", "")

#     if not email or not password:
#         raise HTTPException(status_code=400, detail="Email and password required")

#     user = await db["users"].find_one({"email": email, "role": "admin"})
#     if not user or not pwd_context.verify(password, user.get("password_hash", "")):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_access_token({"sub": str(user["_id"]), "role": "admin"})

#     return {
#         "token": token,
#         "admin": {
#             "_id":   str(user["_id"]),
#             "name":  f"{user.get('first_name','')} {user.get('last_name','')}".strip(),
#             "email": user["email"],
#             "role":  "admin",
#         }
#     }


# # ═════════════════════════════════════════════════════════════════════════════
# # DASHBOARD  —  GET /api/admin/dashboard
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/dashboard")
# async def dashboard(admin=Depends(get_current_admin), db=Depends(get_database)):
#     total_students   = await db["users"].count_documents({"role": "student"})
#     total_bundles    = await db["bundles"].count_documents({})
#     total_tests      = await db["tests"].count_documents({})
#     total_enrollments = await db["enrollments"].count_documents({})
#     paid_enrollments = await db["enrollments"].count_documents({"payment_status": "paid"})
#     unread_messages  = await db["messages"].count_documents({"read": False})

#     # Revenue
#     pipeline_rev = [
#         {"$match": {"payment_status": "paid"}},
#         {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
#     ]
#     rev_result = await db["enrollments"].aggregate(pipeline_rev).to_list(1)
#     total_revenue = rev_result[0]["total"] if rev_result else 0

#     # Monthly revenue trend (last 6 months)
#     pipeline_trend = [
#         {"$match": {"payment_status": "paid"}},
#         {"$group": {
#             "_id": {"year": {"$year": "$created_at"}, "month": {"$month": "$created_at"}},
#             "revenue": {"$sum": "$amount"},
#             "enrollments": {"$sum": 1},
#         }},
#         {"$sort": {"_id.year": 1, "_id.month": 1}},
#         {"$limit": 6},
#     ]
#     trend_raw = await db["enrollments"].aggregate(pipeline_trend).to_list(6)
#     import calendar
#     monthly_trend = [
#         {
#             "month": f"{calendar.month_abbr[t['_id']['month']]} {t['_id']['year']}",
#             "revenue": t["revenue"],
#             "enrollments": t["enrollments"],
#         }
#         for t in trend_raw
#     ]

#     # Recent enrollments
#     recent_raw = await db["enrollments"].find().sort("created_at", -1).limit(5).to_list(5)
#     recent_enrollments = []
#     for e in recent_raw:
#         b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
#         recent_enrollments.append({
#             "_id":            str(e["_id"]),
#             "student_name":   e.get("student_name", ""),
#             "email":          e.get("email", ""),
#             "payment_status": e.get("payment_status", "pending"),
#             "amount":         e.get("amount", 0),
#             "bundle_title":   b["title"] if b else "—",
#             "created_at":     e.get("created_at"),
#         })

#     # Bundle enrollment counts
#     pipeline_bundle = [
#         {"$group": {"_id": "$bundle_id", "count": {"$sum": 1}}},
#         {"$sort": {"count": -1}},
#         {"$limit": 5},
#     ]
#     bundle_stats_raw = await db["enrollments"].aggregate(pipeline_bundle).to_list(5)
#     bundle_stats = []
#     for b in bundle_stats_raw:
#         bundle = await db["bundles"].find_one({"_id": ObjectId(b["_id"])}) if b["_id"] else None
#         bundle_stats.append({
#             "bundle_id":    b["_id"],
#             "bundle_title": bundle["title"] if bundle else "—",
#             "count":        b["count"],
#         })

#     return {
#         "stats": {
#             "total_students":    total_students,
#             "total_bundles":     total_bundles,
#             "total_tests":       total_tests,
#             "total_enrollments": total_enrollments,
#             "paid_enrollments":  paid_enrollments,
#             "total_revenue":     total_revenue,
#             "unread_messages":   unread_messages,
#         },
#         "monthly_trend":      monthly_trend,
#         "bundle_stats":       bundle_stats,
#         "recent_enrollments": recent_enrollments,
#     }


# # ═════════════════════════════════════════════════════════════════════════════
# # BUNDLES  —  /api/admin/bundles
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/bundles")
# async def list_bundles(admin=Depends(get_current_admin), db=Depends(get_database)):
#     bundles = await db["bundles"].find().sort("created_at", -1).to_list(100)
#     result = []
#     for b in bundles:
#         test_count = await db["tests"].count_documents({"bundle_id": str(b["_id"])})
#         enroll_count = await db["enrollments"].count_documents({"bundle_id": str(b["_id"])})
#         result.append({
#             "_id":          str(b["_id"]),
#             "title":        b.get("title", ""),
#             "description":  b.get("description", ""),
#             "price":        b.get("price", 0),
#             "is_free":      b.get("is_free", False),
#             "is_published": b.get("is_published", True),
#             "points":       b.get("points", []),
#             "test_count":   test_count,
#             "enroll_count": enroll_count,
#             "created_at":   b.get("created_at"),
#         })
#     return {"data": result}


# @router.post("/bundles")
# async def create_bundle(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     doc = {
#         "title":        body.get("title", "").strip(),
#         "description":  body.get("description", "").strip(),
#         "price":        float(body.get("price", 0)),
#         "is_free":      bool(body.get("is_free", False)),
#         "is_published": bool(body.get("is_published", True)),
#         "points":       body.get("points", []),
#         "created_at":   datetime.now(timezone.utc),
#         "updated_at":   datetime.now(timezone.utc),
#     }
#     result = await db["bundles"].insert_one(doc)
#     return {"data": {**doc, "_id": str(result.inserted_id)}}


# @router.put("/bundles/{bundle_id}")
# async def update_bundle(bundle_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     updates = {"updated_at": datetime.now(timezone.utc)}
#     for field in ["title", "description", "price", "is_free", "is_published", "points"]:
#         if field in body:
#             updates[field] = body[field]

#     result = await db["bundles"].find_one_and_update(
#         {"_id": oid(bundle_id)}, {"$set": updates}, return_document=True
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Bundle not found")
#     return {"data": {**result, "_id": str(result["_id"])}}


# @router.patch("/bundles/{bundle_id}/toggle")
# async def toggle_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     b = await db["bundles"].find_one({"_id": oid(bundle_id)})
#     if not b:
#         raise HTTPException(status_code=404, detail="Bundle not found")
#     new_val = not b.get("is_published", True)
#     await db["bundles"].update_one({"_id": oid(bundle_id)}, {"$set": {"is_published": new_val}})
#     return {"data": {**b, "_id": str(b["_id"]), "is_published": new_val}}


# @router.delete("/bundles/{bundle_id}")
# async def delete_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     # Also delete all tests in this bundle
#     await db["tests"].delete_many({"bundle_id": bundle_id})
#     result = await db["bundles"].delete_one({"_id": oid(bundle_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Bundle not found")
#     return {"message": "Bundle and its tests deleted"}


# # ═════════════════════════════════════════════════════════════════════════════
# # TESTS  —  /api/admin/tests
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/tests")
# async def list_tests(
#     bundle_id: Optional[str] = Query(None),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     query = {}
#     if bundle_id:
#         query["bundle_id"] = bundle_id
#     tests = await db["tests"].find(query).sort("created_at", -1).to_list(200)
#     result = []
#     for t in tests:
#         b = await db["bundles"].find_one({"_id": ObjectId(t["bundle_id"])}) if t.get("bundle_id") else None
#         result.append({
#             "_id":             str(t["_id"]),
#             "title":           t.get("title", ""),
#             "subject":         t.get("subject", ""),
#             "duration":        t.get("duration_minutes", 40),
#             "is_free":         t.get("is_free", False),
#             "question_count":  len(t.get("questions", [])),
#             "bundle_id":       t.get("bundle_id", ""),
#             "bundle_title":    b["title"] if b else "—",
#             "created_at":      t.get("created_at"),
#         })
#     return {"data": result}


# @router.post("/tests")
# async def create_test(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     bundle_id = body.get("bundle_id", "")
#     if bundle_id and not ObjectId.is_valid(bundle_id):
#         raise HTTPException(status_code=400, detail="Invalid bundle ID")

#     questions = []
#     for q in body.get("questions", []):
#         questions.append({
#             "id":       str(ObjectId()),
#             "text":     q.get("text", ""),
#             "options":  q.get("options", []),
#             "correct":  q.get("correct", "0"),
#             "subject":  q.get("subject", body.get("subject", "")),
#             "explanation": q.get("explanation", ""),
#         })

#     doc = {
#         "title":            body.get("title", "").strip(),
#         "subject":          body.get("subject", "").strip(),
#         "duration_minutes": int(body.get("duration", 40)),
#         "is_free":          bool(body.get("is_free", False)),
#         "bundle_id":        bundle_id,
#         "questions":        questions,
#         "created_at":       datetime.now(timezone.utc),
#         "updated_at":       datetime.now(timezone.utc),
#     }
#     result = await db["tests"].insert_one(doc)
#     return {"data": {**doc, "_id": str(result.inserted_id)}}


# @router.get("/tests/{test_id}")
# async def get_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     t = await db["tests"].find_one({"_id": oid(test_id)})
#     if not t:
#         raise HTTPException(status_code=404, detail="Test not found")
#     return {
#         "data": {
#             "_id":            str(t["_id"]),
#             "title":          t.get("title", ""),
#             "subject":        t.get("subject", ""),
#             "duration":       t.get("duration_minutes", 40),
#             "is_free":        t.get("is_free", False),
#             "bundle_id":      t.get("bundle_id", ""),
#             "questions":      t.get("questions", []),
#             "question_count": len(t.get("questions", [])),
#         }
#     }


# @router.put("/tests/{test_id}")
# async def update_test(test_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     updates = {"updated_at": datetime.now(timezone.utc)}
#     for field in ["title", "subject", "is_free", "bundle_id"]:
#         if field in body:
#             updates[field] = body[field]
#     if "duration" in body:
#         updates["duration_minutes"] = int(body["duration"])
#     if "questions" in body:
#         updates["questions"] = body["questions"]

#     result = await db["tests"].find_one_and_update(
#         {"_id": oid(test_id)}, {"$set": updates}, return_document=True
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Test not found")
#     return {"data": {**result, "_id": str(result["_id"])}}


# @router.delete("/tests/{test_id}")
# async def delete_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     result = await db["tests"].delete_one({"_id": oid(test_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Test not found")
#     return {"message": "Test deleted"}


# # CSV upload for a test
# @router.post("/tests/{test_id}/questions/upload-csv")
# async def upload_questions_csv(
#     test_id: str,
#     file: UploadFile = File(...),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     t = await db["tests"].find_one({"_id": oid(test_id)})
#     if not t:
#         raise HTTPException(status_code=404, detail="Test not found")

#     content = await file.read()
#     text    = content.decode("utf-8-sig")
#     reader  = csv.DictReader(io.StringIO(text))

#     letter_map = {"A": "0", "B": "1", "C": "2", "D": "3",
#                   "a": "0", "b": "1", "c": "2", "d": "3"}
#     questions = []
#     errors    = []

#     for i, row in enumerate(reader, start=2):
#         q_text = row.get("question", "").strip()
#         a = row.get("optionA", row.get("option_a", "")).strip()
#         b = row.get("optionB", row.get("option_b", "")).strip()
#         c = row.get("optionC", row.get("option_c", "")).strip()
#         d = row.get("optionD", row.get("option_d", "")).strip()
#         correct_raw = row.get("correct", "").strip()

#         if not all([q_text, a, b, c, d]):
#             errors.append(f"Row {i}: missing fields")
#             continue
#         if correct_raw not in letter_map:
#             errors.append(f"Row {i}: correct must be A/B/C/D")
#             continue

#         questions.append({
#             "id":          str(ObjectId()),
#             "text":        q_text,
#             "options":     [a, b, c, d],
#             "correct":     letter_map[correct_raw],
#             "explanation": row.get("explanation", "").strip(),
#         })

#     if not questions:
#         raise HTTPException(status_code=400, detail=f"No valid questions. Errors: {errors[:3]}")

#     await db["tests"].update_one(
#         {"_id": oid(test_id)},
#         {"$push": {"questions": {"$each": questions}}}
#     )
#     return {"data": {"uploaded": len(questions), "errors": errors}}


# # ═════════════════════════════════════════════════════════════════════════════
# # STUDENTS  —  /api/admin/students
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/students")
# async def list_students(
#     search: Optional[str] = Query(None),
#     page:   int = Query(1, ge=1),
#     limit:  int = Query(20, ge=1, le=100),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     query: dict = {"role": "student"}
#     if search:
#         query["$or"] = [
#             {"first_name": {"$regex": search, "$options": "i"}},
#             {"last_name":  {"$regex": search, "$options": "i"}},
#             {"email":      {"$regex": search, "$options": "i"}},
#         ]

#     total  = await db["users"].count_documents(query)
#     pages  = (total + limit - 1) // limit
#     raw    = await db["users"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

#     result = []
#     for u in raw:
#         enrollments = await db["enrollments"].find({"user_id": str(u["_id"])}).to_list(50)
#         bundle_titles = []
#         for e in enrollments:
#             b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
#             if b:
#                 bundle_titles.append(b["title"])

#         result.append({
#             "_id":        str(u["_id"]),
#             "name":       f"{u.get('first_name','')} {u.get('last_name','')}".strip(),
#             "email":      u.get("email", ""),
#             "is_active":  u.get("is_active", True),
#             "bundles":    bundle_titles,
#             "joined":     u.get("created_at"),
#             "last_login": u.get("last_login"),
#             "provider":   u.get("provider", "email"),
#         })

#     return {"data": result, "pagination": {"total": total, "pages": pages, "page": page}}


# @router.patch("/students/{student_id}/toggle")
# async def toggle_student(student_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     u = await db["users"].find_one({"_id": oid(student_id)})
#     if not u:
#         raise HTTPException(status_code=404, detail="Student not found")
#     new_val = not u.get("is_active", True)
#     await db["users"].update_one({"_id": oid(student_id)}, {"$set": {"is_active": new_val}})
#     return {"data": {"is_active": new_val}}


# @router.delete("/students/{student_id}")
# async def delete_student(student_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     result = await db["users"].delete_one({"_id": oid(student_id), "role": "student"})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Student not found")
#     await db["enrollments"].delete_many({"user_id": student_id})
#     return {"message": "Student deleted"}


# # ═════════════════════════════════════════════════════════════════════════════
# # ENROLLMENTS  —  /api/admin/enrollments
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/enrollments")
# async def list_enrollments(
#     search:         Optional[str] = Query(None),
#     payment_status: Optional[str] = Query(None),
#     page:           int = Query(1, ge=1),
#     limit:          int = Query(20, ge=1, le=100),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     query: dict = {}
#     if payment_status and payment_status != "All":
#         query["payment_status"] = payment_status
#     if search:
#         query["$or"] = [
#             {"student_name": {"$regex": search, "$options": "i"}},
#             {"email":        {"$regex": search, "$options": "i"}},
#         ]

#     total = await db["enrollments"].count_documents(query)
#     pages = (total + limit - 1) // limit
#     raw   = await db["enrollments"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

#     result = []
#     for e in raw:
#         b = await db["bundles"].find_one({"_id": ObjectId(e["bundle_id"])}) if e.get("bundle_id") else None
#         result.append({
#             "_id":            str(e["_id"]),
#             "student_name":   e.get("student_name", ""),
#             "email":          e.get("email", ""),
#             "bundle_id":      e.get("bundle_id", ""),
#             "bundle_title":   b["title"] if b else "—",
#             "amount":         e.get("amount", 0),
#             "payment_status": e.get("payment_status", "pending"),
#             "access_active":  e.get("access_active", False),
#             "created_at":     e.get("created_at"),
#         })

#     return {"data": result, "pagination": {"total": total, "pages": pages, "page": page}}


# @router.patch("/enrollments/{enrollment_id}/status")
# async def update_enrollment_status(
#     enrollment_id: str,
#     body: dict,
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     status_val = body.get("payment_status")
#     if status_val not in ["paid", "pending", "failed", "refunded"]:
#         raise HTTPException(status_code=400, detail="Invalid status")

#     updates = {
#         "payment_status": status_val,
#         "access_active":  status_val == "paid",
#     }
#     result = await db["enrollments"].find_one_and_update(
#         {"_id": oid(enrollment_id)}, {"$set": updates}, return_document=True
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     return {"data": {**result, "_id": str(result["_id"])}}


# @router.patch("/enrollments/{enrollment_id}/access")
# async def toggle_enrollment_access(
#     enrollment_id: str,
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     e = await db["enrollments"].find_one({"_id": oid(enrollment_id)})
#     if not e:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     new_val = not e.get("access_active", False)
#     await db["enrollments"].update_one({"_id": oid(enrollment_id)}, {"$set": {"access_active": new_val}})
#     return {"data": {"access_active": new_val}}


# @router.delete("/enrollments/{enrollment_id}")
# async def delete_enrollment(enrollment_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     result = await db["enrollments"].delete_one({"_id": oid(enrollment_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Enrollment not found")
#     return {"message": "Enrollment deleted"}


# # ═════════════════════════════════════════════════════════════════════════════
# # MESSAGES  —  /api/admin/messages
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/messages")
# async def list_messages(
#     search:  Optional[str] = Query(None),
#     is_read: Optional[bool] = Query(None),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     query: dict = {}
#     if is_read is not None:
#         query["read"] = is_read
#     if search:
#         query["$or"] = [
#             {"name":    {"$regex": search, "$options": "i"}},
#             {"email":   {"$regex": search, "$options": "i"}},
#             {"message": {"$regex": search, "$options": "i"}},
#         ]

#     messages = await db["messages"].find(query).sort("created_at", -1).to_list(200)
#     unread   = await db["messages"].count_documents({"read": False})

#     return {
#         "data": [
#             {
#                 "_id":        str(m["_id"]),
#                 "name":       m.get("name", ""),
#                 "email":      m.get("email", ""),
#                 "message":    m.get("message", ""),
#                 "type":       m.get("type", "General"),
#                 "read":       m.get("read", False),
#                 "created_at": m.get("created_at"),
#             }
#             for m in messages
#         ],
#         "unread_count": unread,
#     }


# @router.patch("/messages/{msg_id}/read")
# async def mark_read(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     await db["messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": True}})
#     return {"message": "Marked as read"}


# @router.patch("/messages/{msg_id}/unread")
# async def mark_unread(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     await db["messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": False}})
#     return {"message": "Marked as unread"}


# @router.delete("/messages/{msg_id}")
# async def delete_message(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     await db["messages"].delete_one({"_id": oid(msg_id)})
#     return {"message": "Message deleted"}


# # ═════════════════════════════════════════════════════════════════════════════
# # ANALYTICS  —  /api/admin/analytics
# # ═════════════════════════════════════════════════════════════════════════════

# @router.get("/analytics")
# async def analytics(admin=Depends(get_current_admin), db=Depends(get_database)):
#     # Bundle-wise revenue + enrollment counts
#     bundles = await db["bundles"].find().to_list(100)
#     bundle_analytics = []
#     for b in bundles:
#         bid = str(b["_id"])
#         total_enroll = await db["enrollments"].count_documents({"bundle_id": bid})
#         paid_enroll  = await db["enrollments"].count_documents({"bundle_id": bid, "payment_status": "paid"})
#         rev_pipeline = [
#             {"$match": {"bundle_id": bid, "payment_status": "paid"}},
#             {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
#         ]
#         rev_res = await db["enrollments"].aggregate(rev_pipeline).to_list(1)
#         revenue = rev_res[0]["total"] if rev_res else 0

#         bundle_analytics.append({
#             "bundle_id":       bid,
#             "bundle_title":    b.get("title", ""),
#             "total_enrollments": total_enroll,
#             "paid_enrollments":  paid_enroll,
#             "revenue":           revenue,
#         })

#     # Test stats
#     tests = await db["tests"].find().to_list(200)
#     test_stats = [
#         {
#             "_id":            str(t["_id"]),
#             "title":          t.get("title", ""),
#             "subject":        t.get("subject", ""),
#             "question_count": len(t.get("questions", [])),
#             "is_free":        t.get("is_free", False),
#         }
#         for t in tests
#     ]

#     return {
#         "bundle_analytics": bundle_analytics,
#         "test_stats":       test_stats,
#     }


# # ═════════════════════════════════════════════════════════════════════════════
# # SETTINGS  —  /api/admin/settings
# # ═════════════════════════════════════════════════════════════════════════════

# @router.put("/settings/profile")
# async def update_profile(
#     body: dict,
#     current_user=Depends(get_current_user),
#     db=Depends(get_database),
# ):
#     updates: dict = {"updated_at": datetime.now(timezone.utc)}
#     if body.get("name"):
#         parts = body["name"].strip().split(" ", 1)
#         updates["first_name"] = parts[0]
#         updates["last_name"]  = parts[1] if len(parts) > 1 else ""
#     if body.get("email"):
#         updates["email"] = body["email"].strip().lower()

#     updated = await db["users"].find_one_and_update(
#         {"_id": current_user["_id"]}, {"$set": updates}, return_document=True
#     )
#     return {
#         "admin": {
#             "_id":   str(updated["_id"]),
#             "name":  f"{updated.get('first_name','')} {updated.get('last_name','')}".strip(),
#             "email": updated["email"],
#         }
#     }


# @router.put("/settings/password")
# async def update_password(
#     body: dict,
#     current_user=Depends(get_current_user),
#     db=Depends(get_database),
# ):
#     if not pwd_context.verify(body.get("current_password", ""), current_user.get("password_hash", "")):
#         raise HTTPException(status_code=400, detail="Current password is incorrect")

#     new_pwd = body.get("new_password", "")
#     if len(new_pwd) < 8:
#         raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

#     await db["users"].update_one(
#         {"_id": current_user["_id"]},
#         {"$set": {"password_hash": pwd_context.hash(new_pwd), "updated_at": datetime.now(timezone.utc)}}
#     )
#     return {"message": "Password updated successfully"}


# # ═════════════════════════════════════════════════════════════════════════════
# # PUBLIC ROUTES (website frontend use karega)
# # ═════════════════════════════════════════════════════════════════════════════

# @router.post("/messages/public")
# async def public_create_message(body: dict, db=Depends(get_database)):
#     """Website contact form → yahan submit hoga"""
#     name    = body.get("name", "").strip()
#     email   = body.get("email", "").strip()
#     message = body.get("message", "").strip()
#     if not name or not email or not message:
#         raise HTTPException(status_code=400, detail="Name, email and message required")

#     await db["messages"].insert_one({
#         "name":       name,
#         "email":      email,
#         "message":    message,
#         "type":       body.get("type", "General"),
#         "read":       False,
#         "created_at": datetime.now(timezone.utc),
#     })
#     return {"message": "Message sent successfully!"}
# # ═══════════════════════════════════════════════════════════
# # SUBJECTS — /api/admin/bundles/{bundle_id}/subjects
# # Yeh admin.py ke end mein add karo
# # ═══════════════════════════════════════════════════════════

# @router.get("/bundles/{bundle_id}/subjects")
# async def list_subjects(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     """Bundle ke andar subjects list karo"""
#     subjects = await db["subjects"].find({"bundle_id": bundle_id}).sort("order", 1).to_list(20)
#     result = []
#     for s in subjects:
#         test_count = await db["tests"].count_documents({"subject_id": str(s["_id"])})
#         result.append({
#             "_id":        str(s["_id"]),
#             "name":       s.get("name", ""),
#             "icon":       s.get("icon", "BookOpen"),
#             "color":      s.get("color", "#6366F1"),
#             "bundle_id":  s.get("bundle_id", ""),
#             "order":      s.get("order", 0),
#             "test_count": test_count,
#         })
#     return {"data": result}


# @router.post("/bundles/{bundle_id}/subjects")
# async def create_subject(bundle_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     """Bundle mein naya subject add karo"""
#     # Bundle exist karta hai?
#     b = await db["bundles"].find_one({"_id": oid(bundle_id)})
#     if not b:
#         raise HTTPException(status_code=404, detail="Bundle not found")

#     # Order — last subject ke baad
#     last = await db["subjects"].find_one({"bundle_id": bundle_id}, sort=[("order", -1)])
#     order = (last.get("order", 0) + 1) if last else 1

#     doc = {
#         "name":       body.get("name", "").strip(),
#         "icon":       body.get("icon", "BookOpen"),
#         "color":      body.get("color", "#6366F1"),
#         "bundle_id":  bundle_id,
#         "order":      order,
#         "created_at": datetime.now(timezone.utc),
#     }
#     result = await db["subjects"].insert_one(doc)
#     return {"data": {**doc, "_id": str(result.inserted_id)}}


# @router.put("/bundles/{bundle_id}/subjects/{subject_id}")
# async def update_subject(bundle_id: str, subject_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     updates = {}
#     for field in ["name", "icon", "color", "order"]:
#         if field in body:
#             updates[field] = body[field]

#     result = await db["subjects"].find_one_and_update(
#         {"_id": oid(subject_id), "bundle_id": bundle_id},
#         {"$set": updates},
#         return_document=True
#     )
#     if not result:
#         raise HTTPException(status_code=404, detail="Subject not found")
#     return {"data": {**result, "_id": str(result["_id"])}}


# @router.delete("/bundles/{bundle_id}/subjects/{subject_id}")
# async def delete_subject(bundle_id: str, subject_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     """Subject aur uske saare tests delete karo"""
#     await db["tests"].delete_many({"subject_id": subject_id})
#     result = await db["subjects"].delete_one({"_id": oid(subject_id), "bundle_id": bundle_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Subject not found")
#     return {"message": "Subject and its tests deleted"}


# # ═══════════════════════════════════════════════════════════
# # TESTS by SUBJECT — /api/admin/subjects/{subject_id}/tests
# # ═══════════════════════════════════════════════════════════

# @router.get("/subjects/{subject_id}/tests")
# async def list_subject_tests(subject_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     tests = await db["tests"].find({"subject_id": subject_id}).sort("created_at", 1).to_list(100)
#     return {
#         "data": [
#             {
#                 "_id":            str(t["_id"]),
#                 "title":          t.get("title", ""),
#                 "subject_id":     t.get("subject_id", ""),
#                 "bundle_id":      t.get("bundle_id", ""),
#                 "duration":       t.get("duration_minutes", 40),
#                 "is_free":        t.get("is_free", False),
#                 "question_count": len(t.get("questions", [])),
#                 "created_at":     t.get("created_at"),
#             }
#             for t in tests
#         ]
#     }


# @router.post("/subjects/{subject_id}/tests")
# async def create_subject_test(subject_id: str, body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
#     """Subject ke andar test create karo"""
#     s = await db["subjects"].find_one({"_id": oid(subject_id)})
#     if not s:
#         raise HTTPException(status_code=404, detail="Subject not found")

#     questions = []
#     for q in body.get("questions", []):
#         questions.append({
#             "id":          str(ObjectId()),
#             "text":        q.get("text", ""),
#             "options":     q.get("options", []),
#             "correct":     q.get("correct", "0"),
#             "explanation": q.get("explanation", ""),
#         })

#     doc = {
#         "title":            body.get("title", "").strip(),
#         "subject_id":       subject_id,
#         "bundle_id":        s.get("bundle_id", ""),
#         "duration_minutes": int(body.get("duration", 40)),
#         "is_free":          bool(body.get("is_free", False)),
#         "questions":        questions,
#         "created_at":       datetime.now(timezone.utc),
#     }
#     result = await db["tests"].insert_one(doc)
#     return {"data": {**doc, "_id": str(result.inserted_id)}}


# @router.post("/subjects/{subject_id}/tests/upload-csv")
# async def upload_subject_test_csv(
#     subject_id: str,
#     title: str = Form(...),
#     duration: int = Form(40),
#     is_free: str = Form("false"),
#     file: UploadFile = File(...),
#     admin=Depends(get_current_admin),
#     db=Depends(get_database),
# ):
#     s = await db["subjects"].find_one({"_id": oid(subject_id)})
#     if not s:
#         raise HTTPException(status_code=404, detail="Subject not found")

#     content = await file.read()
#     text    = content.decode("utf-8-sig")
#     reader  = csv.DictReader(io.StringIO(text))

#     letter_map = {"A": "0", "B": "1", "C": "2", "D": "3",
#                   "a": "0", "b": "1", "c": "2", "d": "3"}
#     questions = []
#     errors    = []

#     for i, row in enumerate(reader, start=2):
#         q_text = row.get("question", "").strip()
#         a = row.get("optionA", row.get("option_a", "")).strip()
#         b = row.get("optionB", row.get("option_b", "")).strip()
#         c = row.get("optionC", row.get("option_c", "")).strip()
#         d = row.get("optionD", row.get("option_d", "")).strip()
#         correct_raw = row.get("correct", "").strip()

#         if not all([q_text, a, b, c, d]):
#             errors.append(f"Row {i}: missing fields")
#             continue
#         if correct_raw not in letter_map:
#             errors.append(f"Row {i}: correct must be A/B/C/D")
#             continue

#         questions.append({
#             "id":          str(ObjectId()),
#             "text":        q_text,
#             "options":     [a, b, c, d],
#             "correct":     letter_map[correct_raw],
#             "explanation": row.get("explanation", "").strip(),
#         })

#     if not questions:
#         raise HTTPException(status_code=400, detail=f"No valid questions. Errors: {errors[:3]}")

#     doc = {
#         "title":            title.strip(),
#         "subject_id":       subject_id,
#         "bundle_id":        s.get("bundle_id", ""),
#         "duration_minutes": duration,
#         "is_free":          is_free.lower() == "true",
#         "questions":        questions,
#         "created_at":       datetime.now(timezone.utc),
#     }
#     result = await db["tests"].insert_one(doc)
#     return {"data": {**doc, "_id": str(result.inserted_id), "question_count": len(questions)}}


# @router.delete("/subjects/{subject_id}/tests/{test_id}")
# async def delete_subject_test(subject_id: str, test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     result = await db["tests"].delete_one({"_id": oid(test_id), "subject_id": subject_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Test not found")
#     return {"message": "Test deleted"}


