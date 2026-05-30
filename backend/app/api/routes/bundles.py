from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel

from app.core.dependencies import get_current_admin
from app.db.database import get_database

router = APIRouter(tags=["Bundles"])


# ─── Schemas ─────────────────────────────────────────────────────────────────

class BundleCreate(BaseModel):
    title: str
    description: str
    price: float
    points: List[str] = []  # Feature points e.g. ["20 tests/subject", "4 subjects"]
    is_free: bool = False
    is_published: bool = True


class BundleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    points: Optional[List[str]] = None
    is_free: Optional[bool] = None
    is_published: Optional[bool] = None


def fmt_bundle(b: dict) -> dict:
    return {
        "_id":          str(b["_id"]),
        "title":        b.get("title", ""),
        "description":  b.get("description", ""),
        "price":        b.get("price", 0),
        "points":       b.get("points", []),
        "is_free":      b.get("is_free", False),
        "is_published": b.get("is_published", True),
        "test_count":   b.get("test_count", 0),
        "created_at":   b.get("created_at"),
    }


# ═════════════════════════════════════════════════════════════════════════════
# PUBLIC ROUTES
# ═════════════════════════════════════════════════════════════════════════════

# ── GET /api/v1/bundles — list all published bundles ─────────────────────────
@router.get("/bundles")
async def list_bundles(db=Depends(get_database)):
    bundles = await db["bundles"].find({"is_published": True}).sort("created_at", 1).to_list(20)
    return {"data": [fmt_bundle(b) for b in bundles]}


# ── GET /api/v1/bundles/{bundle_id} — single bundle ──────────────────────────
@router.get("/bundles/{bundle_id}")
async def get_bundle(bundle_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(bundle_id):
        raise HTTPException(status_code=400, detail="Invalid bundle ID")
    b = await db["bundles"].find_one({"_id": ObjectId(bundle_id), "is_published": True})
    if not b:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"data": fmt_bundle(b)}


# ── GET /api/v1/courses/public/all — courses with free + paid bundles ─────────
@router.get("/courses/public/all")
async def public_courses_all(db=Depends(get_database)):
    """Returns courses list — used by website frontend"""
    courses = await db["courses"].find({"is_published": True}).sort("created_at", 1).to_list(20)
    result = []
    for c in courses:
        result.append({
            "_id":         str(c["_id"]),
            "title":       c.get("title", ""),
            "description": c.get("description", ""),
            "category":    c.get("category", ""),
            "is_free":     c.get("is_free", False),
        })
    return {"data": result}


# ── GET /api/v1/courses/public/{course_id}/tests ──────────────────────────────
@router.get("/courses/public/{course_id}/tests")
async def public_course_tests(course_id: str, db=Depends(get_database)):
    """Returns free tests + paid bundles for a course"""
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    # Free tests for this course
    free_tests = await db["tests"].find({
        "course_id": course_id,
        "is_free": True,
    }).to_list(50)

    # Paid bundles (global — not per course, bundles contain all subjects)
    paid_bundles = await db["bundles"].find({
        "is_free": False,
        "is_published": True,
    }).sort("created_at", 1).to_list(10)

    return {
        "data": {
            "freeTests": [
                {
                    "_id":   str(t["_id"]),
                    "title": t.get("title", ""),
                    "duration_minutes": t.get("duration_minutes", 30),
                    "total_questions":  t.get("total_questions", 0),
                }
                for t in free_tests
            ],
            "paidTests": [fmt_bundle(b) for b in paid_bundles],
        }
    }


# ═════════════════════════════════════════════════════════════════════════════
# ADMIN ROUTES
# ═════════════════════════════════════════════════════════════════════════════

# ── GET /api/v1/admin/bundles — all bundles ───────────────────────────────────
@router.get("/admin/bundles")
async def admin_list_bundles(admin=Depends(get_current_admin), db=Depends(get_database)):
    bundles = await db["bundles"].find().sort("created_at", 1).to_list(20)
    return {"data": [fmt_bundle(b) for b in bundles]}


# ── POST /api/v1/admin/bundles — create bundle ────────────────────────────────
@router.post("/admin/bundles", status_code=201)
async def admin_create_bundle(body: BundleCreate, admin=Depends(get_current_admin), db=Depends(get_database)):
    doc = {
        **body.model_dump(),
        "test_count": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db["bundles"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"data": fmt_bundle(doc)}


# ── PUT /api/v1/admin/bundles/{bundle_id} — update bundle ─────────────────────
@router.put("/admin/bundles/{bundle_id}")
async def admin_update_bundle(bundle_id: str, body: BundleUpdate, admin=Depends(get_current_admin), db=Depends(get_database)):
    if not ObjectId.is_valid(bundle_id):
        raise HTTPException(status_code=400, detail="Invalid bundle ID")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)

    result = await db["bundles"].find_one_and_update(
        {"_id": ObjectId(bundle_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"data": fmt_bundle(result)}


# ── DELETE /api/v1/admin/bundles/{bundle_id} ──────────────────────────────────
@router.delete("/admin/bundles/{bundle_id}")
async def admin_delete_bundle(bundle_id: str, admin=Depends(get_current_admin), db=Depends(get_database)):
    if not ObjectId.is_valid(bundle_id):
        raise HTTPException(status_code=400, detail="Invalid bundle ID")

    result = await db["bundles"].delete_one({"_id": ObjectId(bundle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return {"message": "Bundle deleted successfully"}
