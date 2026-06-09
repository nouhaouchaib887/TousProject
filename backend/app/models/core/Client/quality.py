# backend/app/models/client.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
if TYPE_CHECKING:


    from .client import Client

class Quality(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    desc: Optional[str] = Field(default=None, unique=True, index=True) 

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at:datetime = Field(default_factory=datetime.utcnow)

    clients: Optional[List["Client"]] = Relationship(back_populates="quality")


   