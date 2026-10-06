from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
from .database import engine, Base, get_db
from .models import User, Student, Company, Job, PlacementDrive, Application

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Placement Tracker AI API",
    description="Intelligent campus placement management platform connecting students, colleges, and enterprise recruiters.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "Placement Tracker AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "connected"}

# Run with: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
