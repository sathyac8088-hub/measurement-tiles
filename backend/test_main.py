from fastapi.testclient import TestClient
from main import app, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_read_books_empty():
    response = client.get("/books")
    assert response.status_code == 200
    assert response.json() == []

def test_create_book():
    response = client.post(
        "/books",
        json={"title": "Moby Dick", "author": "Herman Melville", "publication_year": 1851, "isbn": "978-1503280786", "genre": "Adventure"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Moby Dick"
    assert "id" in data

def test_read_books_after_create():
    client.post(
        "/books",
        json={"title": "Moby Dick", "author": "Herman Melville", "publication_year": 1851, "isbn": "978-1503280786", "genre": "Adventure"}
    )
    response = client.get("/books")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Moby Dick"
