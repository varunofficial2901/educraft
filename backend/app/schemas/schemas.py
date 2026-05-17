from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum


# ─────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────

class UserRole(str, Enum):
    student = "student"
    admin = "admin"

class AuthProvider(str, Enum):
    email = "email"
    google = "google"

class CourseCategory(str, Enum):
    mathematics = "Mathematics"
    reading = "Reading Skills"
    reasoning = "Reasoning"

class DifficultyLevel(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class FAQCategory(str, Enum):
    general = "General"
    courses = "Courses"
    billing = "Billing"
    technical = "Technical"


# ─────────────────────────────────────────
# AUTH SCHEMAS
# ─────────────────────────────────────────

class SignUpRequest(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    id_token: str  # Google ID token from frontend

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserPublic"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# ─────────────────────────────────────────
# USER SCHEMAS
# ─────────────────────────────────────────

class UserPublic(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: UserRole
    avatar_url: Optional[str] = None
    is_verified: bool
    created_at: datetime

class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2)
    last_name: Optional[str] = Field(None, min_length=2)
    avatar_url: Optional[str] = None


# ─────────────────────────────────────────
# COURSE SCHEMAS
# ─────────────────────────────────────────

class CourseCreate(BaseModel):
    title: str
    description: str
    category: CourseCategory
    difficulty: DifficultyLevel
    is_free: bool = False
    thumbnail_url: Optional[str] = None
    total_tests: int = 0
    tags: List[str] = []

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[CourseCategory] = None
    difficulty: Optional[DifficultyLevel] = None
    is_free: Optional[bool] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None

class CoursePublic(BaseModel):
    id: str
    title: str
    description: str
    category: CourseCategory
    difficulty: DifficultyLevel
    is_free: bool
    thumbnail_url: Optional[str]
    total_tests: int
    tags: List[str]
    is_published: bool
    created_at: datetime


# ─────────────────────────────────────────
# TEST/QUIZ SCHEMAS
# ─────────────────────────────────────────

class QuestionOption(BaseModel):
    id: str          # "a", "b", "c", "d"
    text: str

class QuestionCreate(BaseModel):
    text: str
    options: List[QuestionOption] = Field(..., min_length=2, max_length=6)
    correct_option_id: str
    explanation: Optional[str] = None
    difficulty: DifficultyLevel = DifficultyLevel.medium
    marks: int = 1

class QuestionPublic(BaseModel):
    id: str
    text: str
    options: List[QuestionOption]
    difficulty: DifficultyLevel
    marks: int
    # NOTE: correct_option_id is NOT included — never send answer to frontend during test

class QuestionWithAnswer(QuestionPublic):
    correct_option_id: str
    explanation: Optional[str]

class TestCreate(BaseModel):
    course_id: str
    title: str
    description: Optional[str] = None
    duration_minutes: int = 30
    is_free: bool = False
    questions: List[QuestionCreate]

class TestPublic(BaseModel):
    id: str
    course_id: str
    title: str
    description: Optional[str]
    duration_minutes: int
    is_free: bool
    total_questions: int
    total_marks: int
    created_at: datetime

class TestWithQuestions(TestPublic):
    questions: List[QuestionPublic]  # No answers


# ─────────────────────────────────────────
# TEST ATTEMPT SCHEMAS
# ─────────────────────────────────────────

class AnswerSubmit(BaseModel):
    question_id: str
    selected_option_id: str

class TestSubmitRequest(BaseModel):
    test_id: str
    answers: List[AnswerSubmit]
    time_taken_seconds: int

class QuestionResult(BaseModel):
    question_id: str
    question_text: str
    selected_option_id: Optional[str]
    correct_option_id: str
    is_correct: bool
    marks_awarded: int
    explanation: Optional[str]

class TestResult(BaseModel):
    attempt_id: str
    test_id: str
    test_title: str
    score: int
    total_marks: int
    percentage: float
    correct_count: int
    wrong_count: int
    unattempted_count: int
    time_taken_seconds: int
    question_results: List[QuestionResult]
    submitted_at: datetime


# ─────────────────────────────────────────
# ENROLLMENT SCHEMAS
# ─────────────────────────────────────────

class EnrollRequest(BaseModel):
    course_id: str

class EnrollmentPublic(BaseModel):
    id: str
    user_id: str
    course_id: str
    enrolled_at: datetime
    completed_tests: int
    total_tests: int


# ─────────────────────────────────────────
# CONTACT SCHEMAS
# ─────────────────────────────────────────

class ContactRequest(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr
    message: str = Field(..., min_length=10)

class ContactPublic(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    message: str
    is_resolved: bool
    created_at: datetime


# ─────────────────────────────────────────
# NEWSLETTER SCHEMAS
# ─────────────────────────────────────────

class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr


# ─────────────────────────────────────────
# FAQ SCHEMAS
# ─────────────────────────────────────────

class FAQCreate(BaseModel):
    question: str
    answer: str
    category: FAQCategory

class FAQPublic(BaseModel):
    id: str
    question: str
    answer: str
    category: FAQCategory
    created_at: datetime


# ─────────────────────────────────────────
# GENERIC RESPONSES
# ─────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str

class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


# Forward ref update
TokenResponse.model_rebuild()
