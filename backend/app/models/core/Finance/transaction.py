# backend/app/models/core/finance.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime
from enum import Enum
from typing import List
if TYPE_CHECKING:
    from .project_payment import FinancialDetails
    from ..projects.attachment import Attachment

class PaymentMode(str, Enum):
    CASH = "Espèce"
    CHECK = "Chèque"
    TRANSFER = "Virement"
    DEPOSIT = "Versement" # Versement espèce en banque
    TPE = "Carte"             # Paiement par TPE

class PaymentTransaction(SQLModel, table=True):
    # --- Identifiants ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    
    # --- Lien financier ---
    financial_details_id: uuid.UUID = Field(foreign_key="financialdetails.id", index=True)
    client_id: Optional[uuid.UUID] = Field(default=None, foreign_key="client.id", index=True) # Pour les paiements directs sans projet (ex: Acompte pour un futur projet)
    #Date de création et mise à jour
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    # --- Détails du Paiement ---
    amount: float = Field(default=0.0, gt=0) # gt=0 garantit que le montant est positif
    payment_mode: PaymentMode = Field(default=PaymentMode.CASH)
    payment_date: datetime = Field(default_factory=datetime.utcnow)
    is_confirmed: bool = Field(default=True) # Indique si le paiement a été confirmé 
    # --- Traçabilité & Preuves ---
    reference_number: Optional[str] = Field(default=None, index=True) # N° de chèque ou virement
    bank_name: Optional[str] = None # Banque émettrice (ex: BCP, Attijari)
    notes: Optional[str] = None # Ex: "Payé par le frère du client"
    
    # --- Relation ---
    financial_details: "FinancialDetails" = Relationship(back_populates="transactions")
    attachment: "Attachment"= Relationship(back_populates="transaction")

    # --- Méthodes calculées ---
    def validate_amount(self) -> bool:
        """Valide que le montant du paiement ne dépasse pas le solde dû."""
        if self.financial_details:
            return self.amount <= self.financial_details.balance_due
        return True
    
    
    
    def is_large_payment(self):
        """Indique si le paiement est supérieur à 10 000 DH."""
        return self.amount > 10000
           
        