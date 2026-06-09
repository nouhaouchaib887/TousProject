# backend/app/models/core/staff.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
import uuid
from datetime import datetime
from pydantic import computed_field


if TYPE_CHECKING:
    from ..administration.user import User
    from ..projects.assignment import ProjectAssignment
    from ...plugins.topography.field_intervention import FieldInterventionStaffLink
    from ...plugins.topography.officework import OfficeWorkStaffLink
    

class Staff(SQLModel, table=True):
    # --- Identifiants ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    
    # --- Lien optionnel avec le compte de connexion ---
    # Un collaborateur peut exister sans avoir de compte User (ex: aide-terrain)
    user_id: Optional[uuid.UUID] = Field(foreign_key="users.id", unique=True, index=True)

    # --- Identité (Source de vérité) ---
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    phone_number: Optional[str] = None
    email: Optional[str] = Field(default=None, unique=True)
    
    # --- Données Professionnelles ---
    employee_id: Optional[str] = Field(default=None,unique=True, index=True) # Matricule (Ex: STAFF-2024-001)
    job_title: str # Ex: Ingénieur Géomètre Topographe, Dessinateur, Chauffeur
    speciality: Optional[str] = None # Ex: Copropriété, VVR, Levé par Drone
    hiring_date: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # --- Coûts et Performance (Pour le Chef d'Orchestre) ---
    hourly_rate: float = Field(default=0.0) # Utile pour calculer la rentabilité réelle d'un projet
    is_active: bool = Field(default=True)   # Pour gérer les départs sans supprimer les données

    # --- Relations ---
    user: Optional["User"] = Relationship(back_populates="staff_profile")
    field_intervention_links: List["FieldInterventionStaffLink"] = Relationship(
    back_populates="staff"
)

    office_work_links: List["OfficeWorkStaffLink"] = Relationship(
    back_populates="staff"
    )
    assignments: Optional[List["ProjectAssignment"]] = Relationship(back_populates="staff")
    
    # --- Méthodes calculées ---
    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    

    @property
    def total_interventions(self) -> int:
        """Retourne le nombre total d'interventions (terrain + bureau) auxquelles ce collaborateur a participé."""
        field_count = len(self.field_interventions) if self.field_interventions else 0
        office_count = len(self.office_works) if self.office_works else 0
        return field_count + office_count
    @property
    def total_assigned_projects(self) -> int:
        """Retourne le nombre total de projets assignés à ce collaborateur."""
        return len(self.assignments)
    
