from sqlalchemy import Column, Integer, String, Text
from database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    model = Column(String)  # e.g., "gpt-3.5-turbo", "gpt-4"
