from fastapi import APIRouter, HTTPException, Depends, Query, status
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, List

from app.schemas.schemas import (
    CourseCreate, CourseUpdate, CoursePublic, MessageResponse, EnrollRequest, EnrollmentPublic
)
from app.core.dependencies import get_current_user, get_current_admin
from app.db.database import get_database

router = APIRouter(prefix="/courses", tags=["Courses"])


def fmt_course(c: dict) -> CoursePublic:
    return CoursePublic(
        id=str(c["_id"]),
        title=c["title"],
        description=c["description"],
        category=c["category"],
        difficulty=c["difficulty"],
        is_free=c["is_free"],
        thumbnail_url=c.get("thumbnail_url"),
        total_tests=c.get("total_tests", 0),
        tags=c.get("tags", []),
        is_published=c.get("is_published", False),
        created_at=c["created_at"],
    )


# ─────────────────────────────────────────
# PUBLIC: List courses
# ─────────────────────────────────────────

@router.get("", response_model=List[CoursePublic])
async def list_courses(
    filter: Optional[str] = Query(None, description="FREE or category name"),
    category: Optional[str] = Query(None),
    db=Depends(get_database),
):
    query: dict = {"is_published": True}

    if filter == "FREE":
        query["is_free"] = True
    elif filter and filter != "ALL":
        query["category"] = filter

    if category:
        query["category"] = category

    courses = await db["courses"].find(query).sort("created_at", -1).to_list(100)
    return [fmt_course(c) for c in courses]


# ─────────────────────────────────────────
# PUBLIC: Get single course
# ─────────────────────────────────────────

@router.get("/{course_id}", response_model=CoursePublic)
async def get_course(course_id: str, db=Depends(get_database)):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    course = await db["courses"].find_one({"_id": ObjectId(course_id), "is_published": True})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return fmt_course(course)


# ─────────────────────────────────────────
# STUDENT: Enroll in a course
# ─────────────────────────────────────────

@router.post("/{course_id}/enroll", response_model=EnrollmentPublic, status_code=201)
async def enroll_course(
    course_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    course = await db["courses"].find_one({"_id": ObjectId(course_id), "is_published": True})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user_id = str(current_user["_id"])

    # Check already enrolled
    existing = await db["enrollments"].find_one({
        "user_id": user_id,
        "course_id": course_id,
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

    enrollment = {
        "user_id": user_id,
        "course_id": course_id,
        "enrolled_at": datetime.now(timezone.utc),
        "completed_tests": 0,
        "total_tests": course.get("total_tests", 0),
    }
    result = await db["enrollments"].insert_one(enrollment)
    enrollment["_id"] = result.inserted_id

    return EnrollmentPublic(
        id=str(enrollment["_id"]),
        user_id=enrollment["user_id"],
        course_id=enrollment["course_id"],
        enrolled_at=enrollment["enrolled_at"],
        completed_tests=enrollment["completed_tests"],
        total_tests=enrollment["total_tests"],
    )


# ─────────────────────────────────────────
# STUDENT: My enrollments
# ─────────────────────────────────────────

@router.get("/me/enrolled", response_model=List[EnrollmentPublic])
async def my_enrollments(current_user=Depends(get_current_user), db=Depends(get_database)):
    user_id = str(current_user["_id"])
    enrollments = await db["enrollments"].find({"user_id": user_id}).to_list(100)
    return [
        EnrollmentPublic(
            id=str(e["_id"]),
            user_id=e["user_id"],
            course_id=e["course_id"],
            enrolled_at=e["enrolled_at"],
            completed_tests=e["completed_tests"],
            total_tests=e["total_tests"],
        )
        for e in enrollments
    ]


# ─────────────────────────────────────────
# ADMIN: Create course
# ─────────────────────────────────────────

@router.post("", response_model=CoursePublic, status_code=201)
async def create_course(
    body: CourseCreate,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    doc = {
        **body.model_dump(),
        "is_published": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db["courses"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return fmt_course(doc)


# ─────────────────────────────────────────
# ADMIN: Update course
# ─────────────────────────────────────────

@router.patch("/{course_id}", response_model=CoursePublic)
async def update_course(
    course_id: str,
    body: CourseUpdate,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)

    result = await db["courses"].find_one_and_update(
        {"_id": ObjectId(course_id)},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")

    return fmt_course(result)


# ─────────────────────────────────────────
# ADMIN: Delete course
# ─────────────────────────────────────────

@router.delete("/{course_id}", response_model=MessageResponse)
async def delete_course(
    course_id: str,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")

    result = await db["courses"].delete_one({"_id": ObjectId(course_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")

    return MessageResponse(message="Course deleted successfully")
