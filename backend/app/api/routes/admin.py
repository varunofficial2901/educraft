from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File, Form
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, List
import httpx

from app.core.dependencies import get_current_user, get_current_admin
from app.db.database import get_database

router = APIRouter(tags=["Admin Panel"])


# ─────────────────────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────────────────────

def oid(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    return ObjectId(id)


# ═════════════════════════════════════════════════════════════
# DASHBOARD  —  GET /api/dashboard
# ═════════════════════════════════════════════════════════════

@router.get("/dashboard")
async def dashboard(admin=Depends(get_current_admin), db=Depends(get_database)):
    # ── core stats ──────────────────────────────────────────
    courses     = await db["admin_courses"].count_documents({})
    enrollments = await db["admin_enrollments"].count_documents({})
    papers      = await db["admin_papers"].count_documents({})
    messages    = await db["admin_messages"].count_documents({})
    unread      = await db["admin_messages"].count_documents({"read": False})

    # unique students by email
    unique_emails = await db["admin_enrollments"].distinct("email")
    students = len(unique_emails)

    # ── monthly trend (last 6 months) ───────────────────────
    pipeline_trend = [
        {"$group": {
            "_id": {
                "year":  {"$year":  "$created_at"},
                "month": {"$month": "$created_at"},
            },
            "count": {"$sum": 1},
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {"$limit": 6},
    ]
    monthly_trend = await db["admin_enrollments"].aggregate(pipeline_trend).to_list(6)

    # ── course distribution ──────────────────────────────────
    pipeline_dist = [
        {"$group": {"_id": "$course_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5},
    ]
    dist_raw = await db["admin_enrollments"].aggregate(pipeline_dist).to_list(5)
    course_stats = []
    for d in dist_raw:
        c = await db["admin_courses"].find_one({"_id": ObjectId(d["_id"])}) if d["_id"] else None
        course_stats.append({
            "_id": d["_id"],
            "count": d["count"],
            "course": {"title": c["title"] if c else "Unknown", "_id": d["_id"]},
        })

    # ── recent enrollments ───────────────────────────────────
    recent_enroll_raw = await db["admin_enrollments"].find().sort("created_at", -1).limit(6).to_list(6)
    recent_enrollments = []
    for e in recent_enroll_raw:
        c = await db["admin_courses"].find_one({"_id": ObjectId(e["course_id"])}) if e.get("course_id") else None
        recent_enrollments.append({
            "_id": str(e["_id"]),
            "studentName":   e.get("studentName", ""),
            "email":         e.get("email", ""),
            "paymentStatus": e.get("paymentStatus", "pending"),
            "course": {"title": c["title"] if c else "—", "color": c.get("color", "#4f6ef7") if c else "#4f6ef7"},
            "createdAt": e.get("created_at"),
        })

    # ── recent messages ──────────────────────────────────────
    recent_msgs_raw = await db["admin_messages"].find().sort("created_at", -1).limit(5).to_list(5)
    recent_messages = [
        {
            "_id":       str(m["_id"]),
            "name":      m.get("name", ""),
            "email":     m.get("email", ""),
            "message":   m.get("message", ""),
            "read":      m.get("read", False),
            "createdAt": m.get("created_at"),
        }
        for m in recent_msgs_raw
    ]

    return {
        "data": {
            "stats": {
                "courses": courses, "students": students,
                "enrollments": enrollments, "papers": papers,
                "messages": messages, "unreadMessages": unread,
            },
            "monthlyTrend":      monthly_trend,
            "courseStats":       course_stats,
            "recentEnrollments": recent_enrollments,
            "recentMessages":    recent_messages,
        }
    }


# ═════════════════════════════════════════════════════════════
# COURSES  —  /api/courses  (admin versions with price, color)
# ═════════════════════════════════════════════════════════════

@router.get("/courses")
async def admin_list_courses(admin=Depends(get_current_admin), db=Depends(get_database)):
    courses = await db["admin_courses"].find().sort("created_at", -1).to_list(100)
    result = []
    for c in courses:
        paper_count = await db["admin_papers"].count_documents({"course_id": str(c["_id"])})
        enroll_count = await db["admin_enrollments"].count_documents({"course_id": str(c["_id"])})
        result.append({
            "_id":             str(c["_id"]),
            "title":           c.get("title", ""),
            "description":     c.get("description", ""),
            "price":           c.get("price", 0),
            "status":          c.get("status", "active"),
            "color":           c.get("color", "#4f6ef7"),
            "thumbnail":       c.get("thumbnail"),
            "paperCount":      paper_count,
            "enrollmentCount": enroll_count,
            "createdAt":       c.get("created_at"),
        })
    return {"data": result}


@router.get("/courses/{course_id}")
async def admin_get_course(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    c = await db["admin_courses"].find_one({"_id": oid(course_id)})
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")

    papers_raw = await db["admin_papers"].find({"course_id": course_id}).sort("created_at", -1).to_list(100)
    enrolls_raw = await db["admin_enrollments"].find({"course_id": course_id}).sort("created_at", -1).to_list(100)

    papers = [
        {
            "_id": str(p["_id"]), "title": p.get("title", ""),
            "description": p.get("description", ""), "fileUrl": p.get("fileUrl"),
            "fileName": p.get("fileName"), "visible": p.get("visible", True),
            "type": p.get("type", "free"),
            "price": p.get("price", 0),           # ← add karo
            "points": p.get("points", []),   # ← yeh add karo
            "createdAt": p.get("created_at"),
        }
        for p in papers_raw
    ]
    enrollments = [
        {
            "_id": str(e["_id"]), "studentName": e.get("studentName", ""),
            "email": e.get("email", ""), "phone": e.get("phone", ""),
            "paymentStatus": e.get("paymentStatus", "pending"),
            "createdAt": e.get("created_at"),
        }
        for e in enrolls_raw
    ]

    return {
        "data": {
            "course": {
                "_id": str(c["_id"]), "title": c.get("title"), "description": c.get("description"),
                "price": c.get("price", 0), "status": c.get("status", "active"),
                "color": c.get("color", "#4f6ef7"), "thumbnail": c.get("thumbnail"),
            },
            "papers": papers,
            "enrollments": enrollments,
        }
    }

# @router.get("/courses/{course_id}")
# async def admin_get_course(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
#     c = await db["admin_courses"].find_one({"_id": oid(course_id)})
#     if not c:
#         raise HTTPException(status_code=404, detail="Course not found")

#     papers_raw = await db["admin_papers"].find({"course_id": course_id}).sort("created_at", -1).to_list(100)
#     enrolls_raw = await db["admin_enrollments"].find({"course_id": course_id}).sort("created_at", -1).to_list(100)

#     papers = [
#         {
#             "_id": str(p["_id"]), "title": p.get("title", ""),
#             "description": p.get("description", ""), "fileUrl": p.get("fileUrl"),
#             "fileName": p.get("fileName"), "visible": p.get("visible", True),
#             "createdAt": p.get("created_at"),
#         }
#         for p in papers_raw
#     ]
#     enrollments = [
#         {
#             "_id": str(e["_id"]), "studentName": e.get("studentName", ""),
#             "email": e.get("email", ""), "phone": e.get("phone", ""),
#             "paymentStatus": e.get("paymentStatus", "pending"),
#             "createdAt": e.get("created_at"),
#         }
#         for e in enrolls_raw
#     ]

#     return {
#         "data": {
#             "course": {
#                 "_id": str(c["_id"]), "title": c.get("title"), "description": c.get("description"),
#                 "price": c.get("price", 0), "status": c.get("status", "active"),
#                 "color": c.get("color", "#4f6ef7"), "thumbnail": c.get("thumbnail"),
#             },
#             "papers":      papers,
#             "enrollments": enrollments,
#         }
#     }


@router.post("/courses")
async def admin_create_course(
    title:       str  = Form(...),
    description: str  = Form(...),
    price:       float = Form(...),
    status:      str  = Form("active"),
    color:       str  = Form("#4f6ef7"),
    thumbnail:   Optional[UploadFile] = File(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    thumb_url = None
    if thumbnail and thumbnail.filename:
        # Save to Cloudinary or local — for now store as base64 URL or skip
        # TODO: integrate Cloudinary if needed
        thumb_url = None  # placeholder

    doc = {
        "title": title, "description": description,
        "price": price, "status": status, "color": color,
        "thumbnail": thumb_url,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db["admin_courses"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"data": {**doc, "_id": str(doc["_id"])}}


@router.put("/courses/{course_id}")
async def admin_update_course(
    course_id:   str,
    title:       Optional[str]   = Form(None),
    description: Optional[str]   = Form(None),
    price:       Optional[float] = Form(None),
    status:      Optional[str]   = Form(None),
    color:       Optional[str]   = Form(None),
    thumbnail:   Optional[UploadFile] = File(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    updates = {"updated_at": datetime.now(timezone.utc)}
    if title:       updates["title"]       = title
    if description: updates["description"] = description
    if price:       updates["price"]       = price
    if status:      updates["status"]      = status
    if color:       updates["color"]       = color

    result = await db["admin_courses"].find_one_and_update(
        {"_id": oid(course_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.patch("/courses/{course_id}/toggle-status")
async def admin_toggle_course(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    c = await db["admin_courses"].find_one({"_id": oid(course_id)})
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    new_status = "inactive" if c.get("status") == "active" else "active"
    await db["admin_courses"].update_one({"_id": oid(course_id)}, {"$set": {"status": new_status}})
    return {"data": {**c, "_id": str(c["_id"]), "status": new_status}}


@router.delete("/courses/{course_id}")
async def admin_delete_course(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["admin_papers"].delete_many({"course_id": course_id})
    await db["admin_enrollments"].delete_many({"course_id": course_id})
    result = await db["admin_courses"].delete_one({"_id": oid(course_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}


# ═════════════════════════════════════════════════════════════
# PAPERS  —  /api/papers
# ═════════════════════════════════════════════════════════════

@router.get("/papers")
async def admin_list_papers(
    course: Optional[str] = Query(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {}
    if course:
        query["course_id"] = course
    papers = await db["admin_papers"].find(query).sort("created_at", -1).to_list(200)
    result = []
    for p in papers:
        c = await db["admin_courses"].find_one({"_id": ObjectId(p["course_id"])}) if p.get("course_id") else None
        result.append({
            "_id":         str(p["_id"]),
            "title":       p.get("title", ""),
            "description": p.get("description", ""),
            "fileUrl":     p.get("fileUrl"),
            "fileName":    p.get("fileName"),
            "visible":     p.get("visible", True),
            "createdAt":   p.get("created_at"),
            "course": {
                "_id":   str(c["_id"]) if c else None,
                "title": c["title"]    if c else "—",
                "color": c.get("color", "#4f6ef7") if c else "#4f6ef7",
            },
        })
    return {"data": result}


@router.post("/papers")
async def admin_create_paper(
    title:       str  = Form(...),
    description: str  = Form(""),
    course:      str  = Form(...),
    visible:     str  = Form("true"),
    type:        str  = Form("free"),
    price:       float = Form(0),        # ← add karo
    points:      str  = Form(""),
    paper:       Optional[UploadFile] = File(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    file_url  = None
    file_name = None
    if paper and paper.filename:
        # TODO: Upload to Cloudinary for production
        # For now store filename only
        file_name = paper.filename
        file_url  = None  # Replace with Cloudinary URL after upload

    doc = {
        "title":       title,
        "description": description,
        "course_id":   course,
        "visible":     visible.lower() == "true",
        "type":        type,
        "fileUrl":     file_url,
        "fileName":    file_name,
        "created_at":  datetime.now(timezone.utc),
    }
    result = await db["admin_papers"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.put("/papers/{paper_id}")
async def admin_update_paper(
    paper_id:    str,
    title:       Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    visible:     Optional[str] = Form(None),
    price:       Optional[float] = Form(None),   # ← add karo
    points:      Optional[str] = Form(None),  
    paper:       Optional[UploadFile] = File(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    updates = {}
    if title:       updates["title"]       = title
    if description is not None: updates["description"] = description
    if visible is not None: updates["visible"] = visible.lower() == "true"
    if price is not None: updates["price"] = price          # ← add karo
    if points is not None:                                   # ← add karo
        updates["points"] = [p.strip() for p in points.split(",") if p.strip()]
    if paper and paper.filename:
        updates["fileName"] = paper.filename
        # TODO: upload to Cloudinary

    result = await db["admin_papers"].find_one_and_update(
        {"_id": oid(paper_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.patch("/papers/{paper_id}/toggle-visibility")
async def admin_toggle_paper(paper_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    p = await db["admin_papers"].find_one({"_id": oid(paper_id)})
    if not p:
        raise HTTPException(status_code=404, detail="Paper not found")
    await db["admin_papers"].update_one({"_id": oid(paper_id)}, {"$set": {"visible": not p.get("visible", True)}})
    return {"data": {**p, "_id": str(p["_id"]), "visible": not p.get("visible", True)}}


@router.delete("/papers/{paper_id}")
async def admin_delete_paper(paper_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["admin_papers"].delete_one({"_id": oid(paper_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"message": "Paper deleted successfully"}


# ═════════════════════════════════════════════════════════════
# ENROLLMENTS  —  /api/enrollments
# ═════════════════════════════════════════════════════════════

@router.get("/enrollments")
async def admin_list_enrollments(
    search:        Optional[str] = Query(None),
    course:        Optional[str] = Query(None),
    paymentStatus: Optional[str] = Query(None),
    page:          int = Query(1, ge=1),
    limit:         int = Query(15, ge=1, le=100),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {}
    if course:        query["course_id"]      = course
    if paymentStatus: query["paymentStatus"]  = paymentStatus
    if search:
        query["$or"] = [
            {"studentName": {"$regex": search, "$options": "i"}},
            {"email":       {"$regex": search, "$options": "i"}},
            {"phone":       {"$regex": search, "$options": "i"}},
        ]

    total = await db["admin_enrollments"].count_documents(query)
    pages = (total + limit - 1) // limit

    raw = await db["admin_enrollments"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

    result = []
    for e in raw:
        c = await db["admin_courses"].find_one({"_id": ObjectId(e["course_id"])}) if e.get("course_id") else None
        result.append({
            "_id":           str(e["_id"]),
            "studentName":   e.get("studentName", ""),
            "email":         e.get("email", ""),
            "phone":         e.get("phone", ""),
            "paymentStatus": e.get("paymentStatus", "pending"),
            "otpVerified":   e.get("otpVerified", False),
            "accessActive":  e.get("accessActive", False),
            "createdAt":     e.get("created_at"),
            "course": {
                "_id":   str(c["_id"]) if c else None,
                "title": c["title"]    if c else "—",
                "color": c.get("color", "#4f6ef7") if c else "#4f6ef7",
            },
        })

    return {"data": result, "pagination": {"total": total, "pages": pages, "page": page}}


@router.patch("/enrollments/{enrollment_id}/payment")
async def admin_update_payment(
    enrollment_id: str,
    body: dict,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    payment_status = body.get("paymentStatus")
    valid = ["paid", "pending", "failed", "refunded"]
    if payment_status not in valid:
        raise HTTPException(status_code=400, detail="Invalid payment status")

    updates = {
        "paymentStatus": payment_status,
        "accessActive":  payment_status == "paid",
    }
    result = await db["admin_enrollments"].find_one_and_update(
        {"_id": oid(enrollment_id)}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"data": {**result, "_id": str(result["_id"])}}


@router.delete("/enrollments/{enrollment_id}")
async def admin_delete_enrollment(enrollment_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["admin_enrollments"].delete_one({"_id": oid(enrollment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Enrollment deleted"}


# ═════════════════════════════════════════════════════════════
# STUDENTS  —  /api/students
# ═════════════════════════════════════════════════════════════

@router.get("/students")
async def admin_students_courses(admin=Depends(get_current_admin), db=Depends(get_database)):
    courses = await db["admin_courses"].find().sort("created_at", -1).to_list(100)
    result = []
    for c in courses:
        count = await db["admin_enrollments"].count_documents({"course_id": str(c["_id"])})
        result.append({
            "_id":          str(c["_id"]),
            "title":        c.get("title", ""),
            "status":       c.get("status", "active"),
            "color":        c.get("color", "#4f6ef7"),
            "studentCount": count,
        })
    return {"data": result}


@router.get("/students/course/{course_id}")
async def admin_students_by_course(
    course_id: str,
    search:    Optional[str] = Query(None),
    page:      int = Query(1, ge=1),
    limit:     int = Query(10, ge=1, le=100),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {"course_id": course_id}
    if search:
        query["$or"] = [
            {"studentName": {"$regex": search, "$options": "i"}},
            {"email":       {"$regex": search, "$options": "i"}},
            {"phone":       {"$regex": search, "$options": "i"}},
        ]

    total = await db["admin_enrollments"].count_documents(query)
    pages = (total + limit - 1) // limit
    raw   = await db["admin_enrollments"].find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit).to_list(limit)

    return {
        "data": [
            {
                "_id":           str(e["_id"]),
                "studentName":   e.get("studentName", ""),
                "email":         e.get("email", ""),
                "phone":         e.get("phone", ""),
                "paymentStatus": e.get("paymentStatus", "pending"),
                "otpVerified":   e.get("otpVerified", False),
                "accessActive":  e.get("accessActive", False),
                "createdAt":     e.get("created_at"),
            }
            for e in raw
        ],
        "pagination": {"total": total, "pages": pages, "page": page},
    }


# ═════════════════════════════════════════════════════════════
# MESSAGES  —  /api/messages
# ═════════════════════════════════════════════════════════════

@router.get("/messages")
async def admin_list_messages(
    search: Optional[str] = Query(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {}
    if search:
        query["$or"] = [
            {"name":    {"$regex": search, "$options": "i"}},
            {"email":   {"$regex": search, "$options": "i"}},
            {"message": {"$regex": search, "$options": "i"}},
        ]

    messages = await db["admin_messages"].find(query).sort("created_at", -1).to_list(200)
    unread   = await db["admin_messages"].count_documents({"read": False})

    return {
        "data": [
            {
                "_id":       str(m["_id"]),
                "name":      m.get("name", ""),
                "email":     m.get("email", ""),
                "phone":     m.get("phone", ""),
                "message":   m.get("message", ""),
                "read":      m.get("read", False),
                "createdAt": m.get("created_at"),
            }
            for m in messages
        ],
        "unreadCount": unread,
    }


@router.post("/messages")
async def public_create_message(body: dict, db=Depends(get_database)):
    """Public endpoint — website contact form submits here"""
    first = body.get("firstName", "")
    last  = body.get("lastName",  "")
    name  = body.get("name") or f"{first} {last}".strip()

    if not name or not body.get("email") or not body.get("message"):
        raise HTTPException(status_code=400, detail="Name, email and message are required")

    doc = {
        "name":       name,
        "email":      body["email"],
        "phone":      body.get("phone", ""),
        "message":    body["message"],
        "read":       False,
        "created_at": datetime.now(timezone.utc),
    }
    await db["admin_messages"].insert_one(doc)
    return {"message": "Message sent successfully! We'll be in touch."}


@router.patch("/messages/{msg_id}/read")
async def admin_mark_read(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["admin_messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.patch("/messages/{msg_id}/unread")
async def admin_mark_unread(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["admin_messages"].update_one({"_id": oid(msg_id)}, {"$set": {"read": False}})
    return {"message": "Marked as unread"}


@router.delete("/messages/{msg_id}")
async def admin_delete_message(msg_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["admin_messages"].delete_one({"_id": oid(msg_id)})
    return {"message": "Message deleted"}


# ═════════════════════════════════════════════════════════════
# AUTH — Admin login returning {token, admin} format
# ═════════════════════════════════════════════════════════════

@router.post("/login")
async def admin_login(body: dict, db=Depends(get_database)):
    """Admin panel login — returns {token, admin} format"""
    from passlib.context import CryptContext
    from app.core.security import create_access_token

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    email    = body.get("email")
    password = body.get("password")

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


@router.put("/auth/update-profile")
async def admin_update_profile(body: dict, current_user=Depends(get_current_user), db=Depends(get_database)):
    updates = {}
    if body.get("name"):
        parts = body["name"].split(" ", 1)
        updates["first_name"] = parts[0]
        updates["last_name"]  = parts[1] if len(parts) > 1 else ""
    if body.get("email"):
        updates["email"] = body["email"]

    updated = await db["users"].find_one_and_update(
        {"_id": current_user["_id"]}, {"$set": updates}, return_document=True
    )
    return {
        "admin": {
            "_id":   str(updated["_id"]),
            "name":  f"{updated.get('first_name','')} {updated.get('last_name','')}".strip(),
            "email": updated["email"],
            "role":  updated["role"],
        }
    }
# ═════════════════════════════════════════════════════════════
# TESTS  —  /api/admin/tests
# ═════════════════════════════════════════════════════════════

@router.get("/tests/course/{course_id}")
async def admin_list_tests(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    tests = await db["admin_tests"].find({"course_id": course_id}).sort("created_at", -1).to_list(50)
    return {
        "data": [
            {
                "_id": str(t["_id"]),
                "title": t.get("title", ""),
                "description": t.get("description", ""),
                "duration_minutes": t.get("duration_minutes", 45),
                "is_free": t.get("is_free", True),
                "total_questions": len(t.get("questions", [])),
                "createdAt": t.get("created_at"),
            }
            for t in tests
        ]
    }


@router.post("/tests")
async def admin_create_test(body: dict, admin=Depends(get_current_admin), db=Depends(get_database)):
    course_id = body.get("course_id")
    if not course_id or not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    questions = []
    for q in body.get("questions", []):
        questions.append({
            "id": str(ObjectId()),
            "text": q.get("text", ""),
            "topic": q.get("topic", "General"),
            "difficulty": q.get("difficulty", "easy"),
            "options": q.get("options", []),
            "correctAnswer": q.get("correctAnswer", ""),
        })

    doc = {
        "course_id": course_id,
        "title": body.get("title", ""),
        "description": body.get("description", ""),
        "duration_minutes": body.get("duration_minutes", 45),
        "is_free": body.get("is_free", True),
        "questions": questions,
        "total_questions": len(questions),
        "total_marks": len(questions),
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["admin_tests"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.get("/tests/{test_id}")
async def admin_get_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    t = await db["admin_tests"].find_one({"_id": oid(test_id)})
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    return {
        "data": {
            "_id": str(t["_id"]),
            "title": t.get("title", ""),
            "description": t.get("description", ""),
            "duration_minutes": t.get("duration_minutes", 45),
            "is_free": t.get("is_free", True),
            "questions": t.get("questions", []),
            "total_questions": len(t.get("questions", [])),
        }
    }


@router.delete("/tests/{test_id}")
async def admin_delete_test(test_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["admin_tests"].delete_one({"_id": oid(test_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Test not found")
    return {"message": "Test deleted"}


@router.get("/tests/public/{test_id}")
async def public_get_test(test_id: str, db=Depends(get_database)):
    t = await db["admin_tests"].find_one({"_id": oid(test_id)})
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    return {
        "data": {
            "_id": str(t["_id"]),
            "title": t.get("title", ""),
            "description": t.get("description", ""),
            "duration_minutes": t.get("duration_minutes", 45),
            "total_questions": len(t.get("questions", [])),
            "total_marks": t.get("total_marks", len(t.get("questions", []))),
            "questions": t.get("questions", []),
        }
    }
# ═════════════════════════════════════════════════════════════
# BUNDLES  —  /api/admin/bundles
# ═════════════════════════════════════════════════════════════

@router.get("/bundles/course/{course_id}")
async def admin_list_bundles(course_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    bundles = await db["admin_bundles"].find({"course_id": course_id}).sort("created_at", -1).to_list(50)
    return {
        "data": [
            {
                "_id": str(b["_id"]),
                "title": b.get("title", ""),
                "description": b.get("description", ""),
                "price": b.get("price", 0),
                "points": b.get("points", []),
                "visible": b.get("visible", True),
                "testPaperCount": len(b.get("test_papers", [])),
                "createdAt": b.get("created_at"),
            }
            for b in bundles
        ]
    }


@router.post("/bundles")
async def admin_create_bundle(
    title:       str   = Form(...),
    description: str   = Form(""),
    course_id:   str   = Form(...),
    price:       float = Form(0),
    points:      str   = Form(""),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    doc = {
        "title": title,
        "description": description,
        "course_id": course_id,
        "price": price,
        "points": [p.strip() for p in points.split(",") if p.strip()],
        "visible": True,
        "test_papers": [],
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["admin_bundles"].insert_one(doc)
    return {"data": {**doc, "_id": str(result.inserted_id)}}


@router.get("/bundles/{bundle_id}")
async def admin_get_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    b = await db["admin_bundles"].find_one({"_id": oid(bundle_id)})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {
        "data": {
            "_id": str(b["_id"]),
            "title": b.get("title", ""),
            "description": b.get("description", ""),
            "price": b.get("price", 0),
            "points": b.get("points", []),
            "visible": b.get("visible", True),
            "course_id": b.get("course_id", ""),
            "test_papers": b.get("test_papers", []),
        }
    }


@router.delete("/bundles/{bundle_id}")
async def admin_delete_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    result = await db["admin_bundles"].delete_one({"_id": oid(bundle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"message": "Bundle deleted"}


@router.post("/bundles/{bundle_id}/papers/upload-csv")
async def bundle_upload_csv(
    bundle_id: str,
    title:     str = Form(...),
    file:      UploadFile = File(...),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    import csv, io
    b = await db["admin_bundles"].find_one({"_id": oid(bundle_id)})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")

    content = await file.read()
    text = content.decode('utf-8-sig')
    reader = csv.DictReader(io.StringIO(text))

    questions = []
    for row in reader:
        questions.append({
            "id": str(ObjectId()),
            "text": row.get("question", "").strip(),
            "topic": row.get("topic", "General").strip(),
            "difficulty": row.get("difficulty", "easy").strip(),
            "options": [
                {"id": "A", "text": row.get("option_a", "").strip()},
                {"id": "B", "text": row.get("option_b", "").strip()},
                {"id": "C", "text": row.get("option_c", "").strip()},
                {"id": "D", "text": row.get("option_d", "").strip()},
            ],
            "correctAnswer": row.get("correct_answer", "A").strip().upper(),
        })

    if not questions:
        raise HTTPException(status_code=400, detail="No questions found in CSV")

    paper = {
        "id": str(ObjectId()),
        "title": title,
        "total_questions": len(questions),
        "questions": questions,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await db["admin_bundles"].update_one(
        {"_id": oid(bundle_id)},
        {"$push": {"test_papers": paper}}
    )

    return {"data": paper, "message": f"Test paper added with {len(questions)} questions"}


@router.delete("/bundles/{bundle_id}/papers/{paper_id}")
async def bundle_delete_paper(bundle_id: str, paper_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    await db["admin_bundles"].update_one(
        {"_id": oid(bundle_id)},
        {"$pull": {"test_papers": {"id": paper_id}}}
    )
    return {"message": "Paper deleted"}