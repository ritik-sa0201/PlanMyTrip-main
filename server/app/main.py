from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.test import router as test_router
from app.api.rag import router as rag_router
from app.api.trip import router as trip_router
from app.api.auth import router as auth_router
from app.database import users
from app.config.settings import settings
import os

# Set up LangSmith environment variables
os.environ["LANGCHAIN_TRACING_V2"] = str(settings.LANGCHAIN_TRACING_V2).lower()
os.environ["LANGCHAIN_ENDPOINT"] = settings.LANGCHAIN_ENDPOINT
os.environ["LANGCHAIN_PROJECT"] = settings.LANGCHAIN_PROJECT
if hasattr(settings, 'LANGCHAIN_API_KEY') and settings.LANGCHAIN_API_KEY:
    os.environ["LANGCHAIN_API_KEY"] = settings.LANGCHAIN_API_KEY

app = FastAPI(
    title="Trip Planner API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    rag_router
)

app.include_router(test_router)
app.include_router(trip_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Trip Planner API Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }