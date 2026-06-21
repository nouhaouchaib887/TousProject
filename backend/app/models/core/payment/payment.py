from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4
from typing import Optional, List, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from ..invoice.invoice import Invoice


class PaymentMethod(str, Enum):
    CASH = "ESPECES"
    CHECK = "CHEQUE"
    BANK_TRANSFER = "VIREMENT"
    CARD = "CARTE"
    OTHER = "OTHER"

class Payment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    
    reference: str = Field(unique= True, index = True)

    invoice_id: UUID = Field(foreign_key="invoice.id", index=True)

    amount: Decimal = Field(gt=0)
    payment_method: PaymentMethod
    payment_date: date = Field(default_factory=date.today)

    notes: Optional[str] | None = None

    #Relations
    invoice :"Invoice" = Relationship(back_populates="transactions"
    )
