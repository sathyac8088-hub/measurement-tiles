from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import httpx
from dotenv import load_dotenv

import models
import schemas
from database import SessionLocal, engine

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.post("/api/generate")
async def generate_text(request: schemas.GenerateRequest):
    """
    Simulates a call to an external LLM API (e.g., OpenAI).
    Ideally, you would use the `openai` python package or `httpx` to call the real API.
    For this demo, we will mock it if no key is present, or call OpenAI if key exists.
    """
    if not OPENAI_API_KEY:
        # Mock response for testing/demo purposes without costing money
        return {
            "response": f"[MOCK RESPONSE] Processed prompt: '{request.prompt}' using model: '{request.model}'"
        }

    # Example of a real call (commented out to avoid errors if no key provided in this env)
    # headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    # async with httpx.AsyncClient() as client:
    #     resp = await client.post("https://api.openai.com/v1/chat/completions", json={...}, headers=headers)
    #     return resp.json()

    return {
         "response": f"[MOCK API CALL] (API Key Present) Processed prompt: '{request.prompt}' using model: '{request.model}'"
    }


@app.post("/api/prompts", response_model=schemas.Prompt)
def create_prompt(prompt: schemas.PromptCreate, db: Session = Depends(get_db)):
    db_prompt = models.Prompt(title=prompt.title, content=prompt.content, model=prompt.model)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

@app.get("/api/prompts", response_model=List[schemas.Prompt])
def read_prompts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prompts = db.query(models.Prompt).offset(skip).limit(limit).all()
    return prompts

@app.get("/api/prompts/{prompt_id}", response_model=schemas.Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt

@app.delete("/api/prompts/{prompt_id}")
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")

    db.delete(db_prompt)
    db.commit()
    return {"ok": True}
