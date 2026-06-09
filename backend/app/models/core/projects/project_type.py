from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional, List
import uuid

if TYPE_CHECKING:
    
    from .project import Project
    from ...core.administration.user import User

class ProjectType(SQLModel, table=True):
    __tablename__ = "project_type"
    
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True, index=True) # Ex: "Lotissement", "Bornage"
    code: Optional[str] = Field(None, unique=True) # Ex: "LOT", "BOR" (Utile pour la numérotation)
    color: Optional[str] = Field(None)
    description: Optional[str] = None
    is_active: bool = Field(default=True)
    is_by_default: bool = Field(default=False)
    created_at: Optional[str] = Field(default=None)
    created_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)


    # Relation vers les projets
    projects: Optional[List["Project"]] = Relationship(back_populates="type_obj")
    created_by: Optional["User"] = Relationship()