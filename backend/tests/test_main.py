from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base
from main import app, get_db
import pytest

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_prompt():
    response = client.post(
        "/api/prompts",
        json={"title": "Test Prompt", "content": "Hello World", "model": "gpt-3.5-turbo"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Prompt"
    assert "id" in data

def test_read_prompts():
    # Ensure one prompt exists from previous test (if order preserved, but better to create one)
    client.post(
        "/api/prompts",
        json={"title": "Test Prompt 2", "content": "Hello World 2", "model": "gpt-4"},
    )
    response = client.get("/api/prompts")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_generate_text():
    response = client.post(
        "/api/generate",
        json={"prompt": "Translate this", "model": "gpt-3.5-turbo"}
    )
    assert response.status_code == 200
    assert "response" in response.json()
