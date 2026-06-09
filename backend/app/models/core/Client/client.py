# backend/app/models/client.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
from enum import Enum
from ..projects.project import ProjectClientLink
if TYPE_CHECKING:
    from ..projects.project import Project, ProjectClientLink
    from ..projects.attachment import Attachment
    from .quality import Quality

    

class ClientType(str, Enum):
    PHYSICAL = "Physique"
    MORAL = "Morale"

class Client(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    client_type: ClientType = Field(default=ClientType.PHYSICAL)
    # Informations Personne Physique (ou Gérant de l'entreprise)
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    cin: Optional[str] = Field(default=None, unique=True, index=True) 
    
    # Informations Personne Morale (Entreprise/Administration)
    company_name: Optional[str] = Field(default=None, index=True)
    ice: Optional[str] = Field(default=None, unique=True, index=True) # Identifiant Commun de l'Entreprise
    rc: Optional[str] = Field(default=None) # Registre de Commerce
    quality_id: Optional[uuid.UUID]= Field(foreign_key="quality.id", index=True)
    # Contact commun
    phone_number: str
    email: Optional[str] = None
    address: Optional[str] = None

    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    projects: List["Project"] = Relationship(
        back_populates="clients",
        link_model=ProjectClientLink
    )
    attachment: Optional["Attachment"]= Relationship(
        back_populates="client"
    )
    quality: Optional["Quality"] = Relationship(back_populates="clients")


    @property
    def full_name(self) -> str:
        """Retourne le nom complet pour l'affichage (Personne ou Entreprise)"""
        if self.client_type == ClientType.MORAL:
            return self.company_name or f"{self.first_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    @property
    def identifier(self) -> str:
        """Retourne l'identifiant légal prioritaire (ICE ou CIN)"""
        return self.ice if self.client_type == ClientType.MORAL else self.cin
