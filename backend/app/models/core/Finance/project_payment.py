# backend/app/models/core/finance.py
from enum import Enum

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
import uuid
from datetime import datetime
from pydantic import computed_field

if TYPE_CHECKING:
    from ..projects.project import Project
    from .transaction import PaymentTransaction


class TvaRateEnum(float, Enum):
    standard = 20.0
    reduced = 10.0
    super_reduced = 5.5
    zero = 0.0

class FinancialDetails(SQLModel, table=True):
    # --- Identifiants ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(foreign_key="project.id", unique=True, index=True)

    #Date de création et mise à jour
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    # --- Montants HT / TTC ---
    amount_ht: float = Field(default=0.0) # Montant Hors Taxe
    amount_ttc: float = Field(default=0.0) # Montant Toutes Taxes Comprises (calculé)
    vat_rate: TvaRateEnum = Field(default=TvaRateEnum.standard)  # Taux TVA (Standard 20% au Maroc)
    
    # --- Statut Fiscal ---
    is_tax_exempt: bool = Field(default=False) # Exonéré (ex: Projets étatiques spécifiques)
    is_pro_bono: bool = Field(default=False)   # Projet gratuit (Relations publiques/Amis)

    # --- Suivi des Paiements ---
    # Ces champs sont souvent mis à jour via des méthodes calculées
    # --- Relations ---
    project: "Project" = Relationship(back_populates="financial_details")
    
    # Une liste de toutes les transactions (acomptes, règlements)
    transactions: List["PaymentTransaction"] = Relationship(back_populates="financial_details")

    # --- Méthodes calculées ---
    @computed_field
    @property
    def total_paid(self) -> float:
        """Calcule le total déjà payé en sommant les transactions confirmées."""
        return sum(t.amount for t in self.transactions if t.is_confirmed)
    @property
    def amount_ttc(self) -> float:
        """Calcule le montant TTC en fonction du HT et du taux de TVA."""
        if self.is_tax_exempt or self.is_pro_bono:
            return self.amount_ht
        return self.amount_ht * (1 + self.vat_rate / 100)
    @property
    def amount_ht(self) -> float:
        """Calcule le montant HT à partir du TTC et du taux de TVA."""
        if self.is_tax_exempt or self.is_pro_bono:
            return self.amount_ttc
        return self.amount_ttc / (1 + self.vat_rate / 100)
    @computed_field
    @property
    def balance(self) -> float:
        """Calcule le solde restant à payer."""
        return max(0.0, self.amount_ttc - self.total_paid)
    @computed_field
    @property
    def payment_status(self) -> str:
        """Retourne le statut de paiement du projet."""
        if self.is_pro_bono:
            return "gratuit"
        if self.total_paid >= self.amount_ttc:
            return "Payé"
        if self.total_paid > 0:
            return "Partiel"
        return "Impayé"