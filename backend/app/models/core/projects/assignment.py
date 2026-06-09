# backend/app/models/core/assignment.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .project import Project
    from ..HR.staff import Staff

class StaffRole(str, Enum):
    FIELD_AGENT  = "Agent Terrain"      # Agent de terrain
    OFFICE_AGENT = "Agent Bureau"       # Agent de bureau
    MANAGER ="Manager"
 
class ProjectAssignment(SQLModel, table=True):
    # --- Identifiants de liaison ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    
    project_id: uuid.UUID = Field(foreign_key="project.id", index=True)
    staff_id: uuid.UUID = Field(foreign_key="staff.id", index=True)


    # Dates de création et mise à jour & Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    # --- Détails de la mission ---
    role: StaffRole = Field(default=StaffRole.FIELD_AGENT)
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Informations optionnelles pour le planning
    notes: Optional[str] = None # Ex: "Uniquement pour le levé de façade"

    # --- Relations ---
    project: "Project" = Relationship(back_populates="assignments")
    staff: "Staff" = Relationship(back_populates="assignments")

    