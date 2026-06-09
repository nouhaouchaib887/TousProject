# Dans app/models/project.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
from enum import Enum


# Import des types pour le Type Checking (évite les imports circulaires)
if TYPE_CHECKING:
    from ..Client.client import Client
    from .assignment import ProjectAssignment
    from ..administration.user import User
    from ..Finance.project_payment import FinancialDetails
    from ...plugins.topography.topoMetaData import TopoMetadata
    from .attachment import Attachment
    from .project_type import ProjectType


class ProjectStatus(str, Enum):
    DRAFT = "Draft"              # En préparation (devis non signé)
    PENDING = "Pending"          # Dossier ouvert, en attente de démarrage
    FIELDWORK = "Fieldwork"      # Équipe sur le terrain (Levé en cours)
    OFFICE_WORK = "Office Work"  # Traitement au bureau (Dessin/Calcul)
    VALIDATION = "Validation"    # En cours de vérification par l'ingénieur
    COMPLETED = "Completed"      # Travail technique fini
    DELIVERED = "Delivered"      # Remis au client (et idéalement payé)
    ARCHIVED = "Archived"        # Dossier classé
    CANCELLED = "Cancelled"      # Projet annulé

class ProjectClientLink(SQLModel, table=True):
    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    client_id: uuid.UUID = Field(foreign_key="client.id", primary_key=True)
class Project(SQLModel, table=True):
    # --- Identifiants ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    project_type_id: uuid.UUID = Field(foreign_key="project_type.id", index=True)
    # --- Informations de Base (Shell) ---
    status: ProjectStatus = Field(default=ProjectStatus.DRAFT, index=True) # Draft, Ongoing, Fieldwork, Office, Delivered
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)  # Dernier utilisateur à avoir modifié le projet
    reference: str = Field(index=True, unique=True)
    # --- Dates de Gestion ---
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expected_delivery_date: Optional[datetime] = None  # Date de livraison prévue
    actual_delivery_date: Optional[datetime] = None    # Date de livraison réelle

    # --- Relations (Relationships) ---
    
    
    updated_by: Optional["User"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Project.updated_by_id]"
        }
    )
    # Lien vers le Client (Un projet appartient à un ou plusieurs clients)
    clients: List["Client"] = Relationship(
        back_populates="projects",
        link_model=ProjectClientLink
    )
    
    # Lien vers le Plugin Topographie (Détails métiers spécifiques)
    topo_metadata: "TopoMetadata" = Relationship(
        back_populates="project", 
        sa_relationship_kwargs={"uselist": False} # One-to-One
    )
    
    # Lien vers la Finance (Un projet a un dossier financier)
    financial_details: Optional["FinancialDetails"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"uselist": False} # One-to-One
    )
    
    # Lien vers les Agents (Many-to-Many via ProjectAssignment)
    assignments: List["ProjectAssignment"] = Relationship(back_populates="project")
    
    # Lien vers les Pièces Jointes (Un projet a plusieurs documents)
    attachments: List["Attachment"] = Relationship(back_populates="project")

    type_obj: "ProjectType" = Relationship(back_populates="projects")

    # --- Méthodes calculées ---

    #@property
    #def total_assigned_agents(self) -> int:
        #"""Retourne le nombre total d'agents assignés au projet."""
        #return len(self.assignments)
    
    
    def requires_control(self) -> bool:
        """Indique si une fiche de contrôle doit être remplie"""
        return self.status == ProjectStatus.VALIDATION
    
    @property
    def is_overdue(self) -> bool:
        """Indique si le projet est en  retard par rapport à la date de livraison prévue."""

        if self.expected_delivery_date is None:
            return False  # Si aucune date de livraison prévue, le projet n'est pas en retard
        
        return self.expected_delivery_date < datetime.utcnow()
    
    @property
    def is_completed(self) -> bool:
        return self.status == ProjectStatus.COMPLETED
    
    @property
    def has_unpaid_balance(self) -> bool:
        """Vérifie rapidement s'il reste un montant à payer"""
        if self.financial_details:
            return self.financial_details.balance_due > 0
        return False
