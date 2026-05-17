from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime, timezone
from typing import List

from app.schemas.schemas import (
    TestCreate, TestPublic, TestWithQuestions, TestSubmitRequest,
    TestResult, QuestionResult, MessageResponse
)
from app.core.dependencies import get_current_user, get_current_admin
from app.db.database import get_database

router = APIRouter(prefix="/tests", tags=["Tests"])


def fmt_test_public(t: dict) -> TestPublic:
    return TestPublic(
        id=str(t["_id"]),
        course_id=t["course_id"],
        title=t["title"],
        description=t.get("description"),
        duration_minutes=t["duration_minutes"],
        is_free=t.get("is_free", False),
        total_questions=t.get("total_questions", 0),
        total_marks=t.get("total_marks", 0),
        created_at=t["created_at"],
    )


# ─────────────────────────────────────────
# PUBLIC: List tests for a course
# ─────────────────────────────────────────

@router.get("/course/{course_id}", response_model=List[TestPublic])
async def list_tests_for_course(course_id: str, db=Depends(get_database)):
    tests = await db["tests"].find({"course_id": course_id}).sort("created_at", 1).to_list(50)
    return [fmt_test_public(t) for t in tests]


# ─────────────────────────────────────────
# STUDENT: Start a test — returns questions WITHOUT answers
# ─────────────────────────────────────────

@router.get("/{test_id}/start", response_model=TestWithQuestions)
async def start_test(
    test_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")

    test = await db["tests"].find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Check if user is enrolled in the course (skip for free tests)
    if not test.get("is_free"):
        enrollment = await db["enrollments"].find_one({
            "user_id": str(current_user["_id"]),
            "course_id": test["course_id"],
        })
        if not enrollment:
            raise HTTPException(status_code=403, detail="You must enroll in this course to take the test")

    # Return questions WITHOUT correct_option_id
    safe_questions = []
    for q in test.get("questions", []):
        safe_questions.append({
            "id": str(q["_id"]) if "_id" in q else q["id"],
            "text": q["text"],
            "options": q["options"],
            "difficulty": q["difficulty"],
            "marks": q.get("marks", 1),
        })

    return TestWithQuestions(
        **fmt_test_public(test).model_dump(),
        questions=safe_questions,
    )


# ─────────────────────────────────────────
# STUDENT: Submit test and get result
# ─────────────────────────────────────────

@router.post("/{test_id}/submit", response_model=TestResult)
async def submit_test(
    test_id: str,
    body: TestSubmitRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")

    test = await db["tests"].find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    user_id = str(current_user["_id"])

    # Check for duplicate submission
    existing_attempt = await db["test_attempts"].find_one({
        "user_id": user_id,
        "test_id": test_id,
    })
    if existing_attempt:
        raise HTTPException(status_code=400, detail="You have already submitted this test")

    # Build answer map from submission
    answer_map = {a.question_id: a.selected_option_id for a in body.answers}

    # Grade the test
    question_results = []
    score = 0
    correct_count = 0
    wrong_count = 0
    unattempted_count = 0

    for q in test.get("questions", []):
        q_id = str(q.get("_id", q.get("id", "")))
        selected = answer_map.get(q_id)
        correct = q["correct_option_id"]
        marks = q.get("marks", 1)

        if selected is None:
            unattempted_count += 1
            awarded = 0
            is_correct = False
        elif selected == correct:
            correct_count += 1
            awarded = marks
            score += marks
            is_correct = True
        else:
            wrong_count += 1
            awarded = 0
            is_correct = False

        question_results.append(QuestionResult(
            question_id=q_id,
            question_text=q["text"],
            selected_option_id=selected,
            correct_option_id=correct,
            is_correct=is_correct,
            marks_awarded=awarded,
            explanation=q.get("explanation"),
        ))

    total_marks = test.get("total_marks", len(test.get("questions", [])))
    percentage = round((score / total_marks * 100), 2) if total_marks > 0 else 0

    # Save attempt to DB
    attempt_doc = {
        "user_id": user_id,
        "test_id": test_id,
        "course_id": test["course_id"],
        "score": score,
        "total_marks": total_marks,
        "percentage": percentage,
        "correct_count": correct_count,
        "wrong_count": wrong_count,
        "unattempted_count": unattempted_count,
        "time_taken_seconds": body.time_taken_seconds,
        "submitted_at": datetime.now(timezone.utc),
    }
    result = await db["test_attempts"].insert_one(attempt_doc)

    # Update enrollment completed_tests count
    await db["enrollments"].update_one(
        {"user_id": user_id, "course_id": test["course_id"]},
        {"$inc": {"completed_tests": 1}},
    )

    return TestResult(
        attempt_id=str(result.inserted_id),
        test_id=test_id,
        test_title=test["title"],
        score=score,
        total_marks=total_marks,
        percentage=percentage,
        correct_count=correct_count,
        wrong_count=wrong_count,
        unattempted_count=unattempted_count,
        time_taken_seconds=body.time_taken_seconds,
        question_results=question_results,
        submitted_at=attempt_doc["submitted_at"],
    )


# ─────────────────────────────────────────
# STUDENT: My attempt history
# ─────────────────────────────────────────

@router.get("/attempts/me", response_model=list)
async def my_attempts(current_user=Depends(get_current_user), db=Depends(get_database)):
    attempts = await db["test_attempts"].find(
        {"user_id": str(current_user["_id"])}
    ).sort("submitted_at", -1).to_list(100)

    return [
        {
            "attempt_id": str(a["_id"]),
            "test_id": a["test_id"],
            "course_id": a["course_id"],
            "score": a["score"],
            "total_marks": a["total_marks"],
            "percentage": a["percentage"],
            "submitted_at": a["submitted_at"],
        }
        for a in attempts
    ]


# ─────────────────────────────────────────
# ADMIN: Create test with questions
# ─────────────────────────────────────────

@router.post("", response_model=TestPublic, status_code=201)
async def create_test(
    body: TestCreate,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    # Validate course exists
    if not ObjectId.is_valid(body.course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
    course = await db["courses"].find_one({"_id": ObjectId(body.course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Prepare questions with generated IDs
    questions = []
    total_marks = 0
    for q in body.questions:
        q_dict = q.model_dump()
        q_dict["id"] = str(ObjectId())  # unique ID for each question
        questions.append(q_dict)
        total_marks += q.marks

    test_doc = {
        "course_id": body.course_id,
        "title": body.title,
        "description": body.description,
        "duration_minutes": body.duration_minutes,
        "is_free": body.is_free,
        "questions": questions,
        "total_questions": len(questions),
        "total_marks": total_marks,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = await db["tests"].insert_one(test_doc)
    test_doc["_id"] = result.inserted_id

    # Update total_tests count on course
    await db["courses"].update_one(
        {"_id": ObjectId(body.course_id)},
        {"$inc": {"total_tests": 1}},
    )

    return fmt_test_public(test_doc)


# ─────────────────────────────────────────
# ADMIN: Delete test
# ─────────────────────────────────────────

@router.delete("/{test_id}", response_model=MessageResponse)
async def delete_test(
    test_id: str,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")

    test = await db["tests"].find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    await db["tests"].delete_one({"_id": ObjectId(test_id)})
    await db["courses"].update_one(
        {"_id": ObjectId(test["course_id"])},
        {"$inc": {"total_tests": -1}},
    )
    return MessageResponse(message="Test deleted successfully")
