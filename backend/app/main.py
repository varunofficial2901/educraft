from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import connect_db, close_db
from app.api.routes import auth, courses, tests, general, admin
from app.api.routes import public  


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="EduCraft API",
    description="Backend for EduCraft — Online Test & Course Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",  # ← yeh add karo  # ← add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTES ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/v1")
app.include_router(courses.router,  prefix="/api/v1")
app.include_router(tests.router,    prefix="/api/v1")
app.include_router(general.router,  prefix="/api/v1")
app.include_router(admin.router,    prefix="/api/admin")
app.include_router(public.router, prefix="/api/public")

@app.get("/")
async def root():
    return {"message": "EduCraft API is running 🚀", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
