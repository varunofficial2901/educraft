from fastapi import APIRouter, HTTPException, Depends, Query, status
from bson import ObjectId
from datetime import datetime, timezone
from typing import List, Optional

from app.schemas.schemas import (
    ContactRequest, ContactPublic,
    NewsletterSubscribeRequest,
    FAQCreate, FAQPublic,
    UserPublic, UserUpdateRequest,
    MessageResponse,
)
from app.core.dependencies import get_current_user, get_current_admin
from app.db.database import get_database

router = APIRouter(tags=["General"])


# ─────────────────────────────────────────
# CONTACT FORM
# ─────────────────────────────────────────

@router.post("/contact", response_model=MessageResponse, status_code=201)
async def submit_contact(body: ContactRequest, db=Depends(get_database)):
    doc = {
        **body.model_dump(),
        "is_resolved": False,
        "created_at": datetime.now(timezone.utc),
    }
    await db["contacts"].insert_one(doc)
    # TODO: Send notification email to admin here
    return MessageResponse(message="Message sent successfully! We'll be in touch.")


@router.get("/admin/contacts", response_model=List[ContactPublic])
async def list_contacts(
    resolved: Optional[bool] = Query(None),
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    query = {}
    if resolved is not None:
        query["is_resolved"] = resolved
    contacts = await db["contacts"].find(query).sort("created_at", -1).to_list(200)
    return [
        ContactPublic(
            id=str(c["_id"]),
            first_name=c["first_name"],
            last_name=c["last_name"],
            email=c["email"],
            message=c["message"],
            is_resolved=c["is_resolved"],
            created_at=c["created_at"],
        )
        for c in contacts
    ]


@router.patch("/admin/contacts/{contact_id}/resolve", response_model=MessageResponse)
async def resolve_contact(
    contact_id: str,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(contact_id):
        raise HTTPException(status_code=400, detail="Invalid contact ID")
    await db["contacts"].update_one(
        {"_id": ObjectId(contact_id)},
        {"$set": {"is_resolved": True}},
    )
    return MessageResponse(message="Marked as resolved")


# ─────────────────────────────────────────
# NEWSLETTER
# ─────────────────────────────────────────

@router.post("/newsletter/subscribe", response_model=MessageResponse, status_code=201)
async def subscribe_newsletter(body: NewsletterSubscribeRequest, db=Depends(get_database)):
    existing = await db["newsletter"].find_one({"email": body.email})
    if existing:
        return MessageResponse(message="You're already subscribed!")

    await db["newsletter"].insert_one({
        "email": body.email,
        "subscribed_at": datetime.now(timezone.utc),
    })
    return MessageResponse(message="Subscribed successfully! You'll be notified of new tests.")


@router.get("/admin/newsletter", response_model=List[dict])
async def list_subscribers(admin=Depends(get_current_admin), db=Depends(get_database)):
    subs = await db["newsletter"].find().sort("subscribed_at", -1).to_list(1000)
    return [{"email": s["email"], "subscribed_at": s["subscribed_at"]} for s in subs]


# ─────────────────────────────────────────
# FAQ
# ─────────────────────────────────────────

@router.get("/faqs", response_model=List[FAQPublic])
async def list_faqs(
    category: Optional[str] = Query(None),
    db=Depends(get_database),
):
    query = {}
    if category and category != "All":
        query["category"] = category
    faqs = await db["faqs"].find(query).sort("created_at", 1).to_list(100)
    return [
        FAQPublic(
            id=str(f["_id"]),
            question=f["question"],
            answer=f["answer"],
            category=f["category"],
            created_at=f["created_at"],
        )
        for f in faqs
    ]


@router.post("/admin/faqs", response_model=FAQPublic, status_code=201)
async def create_faq(
    body: FAQCreate,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    doc = {**body.model_dump(), "created_at": datetime.now(timezone.utc)}
    result = await db["faqs"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return FAQPublic(
        id=str(doc["_id"]),
        question=doc["question"],
        answer=doc["answer"],
        category=doc["category"],
        created_at=doc["created_at"],
    )


@router.delete("/admin/faqs/{faq_id}", response_model=MessageResponse)
async def delete_faq(
    faq_id: str,
    admin=Depends(get_current_admin),
    db=Depends(get_database),
):
    if not ObjectId.is_valid(faq_id):
        raise HTTPException(status_code=400, detail="Invalid FAQ ID")
    await db["faqs"].delete_one({"_id": ObjectId(faq_id)})
    return MessageResponse(message="FAQ deleted")


# ─────────────────────────────────────────
# USER PROFILE
# ─────────────────────────────────────────

@router.patch("/users/me", response_model=UserPublic)
async def update_profile(
    body: UserUpdateRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)

    updated = await db["users"].find_one_and_update(
        {"_id": current_user["_id"]},
        {"$set": updates},
        return_document=True,
    )
    return UserPublic(
        id=str(updated["_id"]),
        first_name=updated["first_name"],
        last_name=updated["last_name"],
        email=updated["email"],
        role=updated["role"],
        avatar_url=updated.get("avatar_url"),
        is_verified=updated.get("is_verified", False),
        created_at=updated["created_at"],
    )


# ─────────────────────────────────────────
# ADMIN: Dashboard stats
# ─────────────────────────────────────────

@router.get("/admin/stats", response_model=dict)
async def admin_stats(admin=Depends(get_current_admin), db=Depends(get_database)):
    total_users = await db["users"].count_documents({"role": "student"})
    total_courses = await db["courses"].count_documents({})
    total_tests = await db["tests"].count_documents({})
    total_attempts = await db["test_attempts"].count_documents({})
    total_contacts = await db["contacts"].count_documents({"is_resolved": False})
    total_subscribers = await db["newsletter"].count_documents({})

    return {
        "total_students": total_users,
        "total_courses": total_courses,
        "total_tests": total_tests,
        "total_attempts": total_attempts,
        "pending_contacts": total_contacts,
        "newsletter_subscribers": total_subscribers,
    }
