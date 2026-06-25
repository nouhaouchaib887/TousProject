# backend/app/models/client.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
from enum import Enum

from uuid import UUID, uuid4


    
    

class LegalType(str, Enum):
    PHYSICAL = "Physique"
    MORAL = "Morale"



class PartnerBase(SQLModel):
    code: str = Field(unique = True,index=True)
    legal_type: LegalType = Field(default=LegalType.PHYSICAL)
    # Informations Personne Physique (ou Gérant de l'entreprise)
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    cin: Optional[str] = Field(default=None, unique=True, index=True) 
    
    # Informations Personne Morale (Entreprise/Administration)
    company_name: Optional[str] = Field(default=None, index=True)
    ice: Optional[str] = Field(default=None, unique=True, index=True) # Identifiant Commun de l'Entreprise
    rc: Optional[str] = Field(default=None) # Registre de Commerce
    # Contact commun
    phone_number: str
    email: Optional[str] = None
    address: Optional[str] = None
    
    # Infos supplémentaires
    city: Optional[str] = Field(
        default=None,
        max_length=100
    )
    country: Optional[str] = Field(
        default="Maroc",
        max_length=100
    )
    tax_id: Optional[str] = Field(
        default=None,
        max_length=100,
        description="ICE, IF, TVA..."
    )
    credit_limit: Optional[float] = Field(
        default=0
    ) # somme maximale de crédit autorisée
    notes: Optional[str] = None
    is_active: bool = Field(default=True)

    is_customer: bool = False
    is_supplier: bool = False


class Partner(PartnerBase, table=True):
    __tablename__ = "partner"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow
    )


    @property
    def full_name(self) -> str:
        """Retourne le nom complet pour l'affichage (Personne ou Entreprise)"""
        if self.client_type == LegalType.MORAL:
            return self.company_name or f"{self.first_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    @property
    def identifier(self) -> str:
        """Retourne l'identifiant légal prioritaire (ICE ou CIN)"""
        return self.ice if self.client_type == LegalType.MORAL else self.cin
