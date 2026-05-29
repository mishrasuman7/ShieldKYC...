# main.py — ShieldKYC backend entry point

from fastapi import FastAPI, Depends                      # NEW: Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session                        # NEW

from database.db import engine, get_db                    # NEW
from database import models                               # NEW

# NEW: create every table defined in models.py if it doesn't already exist.
# Safe to run on every startup — it skips tables that are already there.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShieldKYC API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "ShieldKYC backend is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "shieldkyc-backend"}

# NEW: a temporary endpoint to confirm the database works.
# It opens a session (via get_db), counts the rows in the submissions table,
# and returns the count. If the table exists and is queryable, this succeeds.
# We'll delete this once real submissions are flowing.
@app.get("/api/db-check")
def db_check(db: Session = Depends(get_db)):
    count = db.query(models.Submission).count()
    return {"database": "connected", "submissions_stored": count}