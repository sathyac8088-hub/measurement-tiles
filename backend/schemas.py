from pydantic import BaseModel
from typing import Optional

class PromptBase(BaseModel):
    title: str
    content: str
    model: str

class PromptCreate(PromptBase):
    pass

class Prompt(PromptBase):
    id: int

    class Config:
        from_attributes = True

class GenerateRequest(BaseModel):
    prompt: str
    model: str
