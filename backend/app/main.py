from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import connect_db, close_db
from app.api.routes import auth, courses, tests, general, admin, bundles


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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTES ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/v1")
app.include_router(courses.router,  prefix="/api/v1")
app.include_router(tests.router,    prefix="/api/v1")
app.include_router(general.router,  prefix="/api/v1")
app.include_router(bundles.router,  prefix="/api/v1")
app.include_router(admin.router,    prefix="/api/admin")


@app.get("/")
async def root():
    return {"message": "EduCraft API is running 🚀", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}






# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from contextlib import asynccontextmanager

# from app.core.config import settings
# from app.db.database import connect_db, close_db
# from app.api.routes import auth, courses, tests, general, admin


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await connect_db()
#     yield
#     await close_db()


# app = FastAPI(
#     title="EduCraft API",
#     description="Backend for EduCraft — Online Test & Course Platform",
#     version="1.0.0",
#     lifespan=lifespan,
# )

# # ─── CORS ─────────────────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:3001",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ─── ROUTES ───────────────────────────────────────────────────────────────────
# app.include_router(auth.router,     prefix="/api/v1")
# app.include_router(courses.router,  prefix="/api/v1")
# app.include_router(tests.router,    prefix="/api/v1")
# app.include_router(general.router,  prefix="/api/v1")
# app.include_router(admin.router,    prefix="/api/admin")

# @app.get("/")
# async def root():
#     return {"message": "EduCraft API is running 🚀", "docs": "/docs"}


# @app.get("/health")
# async def health():
#     return {"status": "ok"}
