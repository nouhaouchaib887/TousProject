from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4
from typing import Optional, List, TYPE_CHECKING
from ..payment.payment import PaymentMethod

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    
    from .invoice_item import InvoiceItem
    from ..payment.payment import Payment
class InvoiceType(str, Enum):
    SALE = "VENTE"          # facture client
    PURCHASE = "ACHAT"  # facture fournisseur


class InvoiceStatus(str, Enum):
    DRAFT = "DRAFT"
    VALIDATED = "VALIDATED"
    PAID = "PAID"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    CANCELLED = "CANCELLED"


class Invoice(SQLModel, table=True):
    __tablename__ = "invoice"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    reference: str = Field(index=True, unique=True)

    invoice_type: InvoiceType = Field(index=True)

    partner_id: UUID = Field(foreign_key="partner.id", index=True)

    invoice_date: date = Field(default_factory=date.today)
    due_date: date | None = None

    status: InvoiceStatus = Field(default=InvoiceStatus.DRAFT)

    total_ht: Decimal = Field(default=0)
    total_vat: Decimal = Field(default=0)
    total_ttc: Decimal = Field(default=0)
    expected_payment_method: PaymentMethod | None = None
    payment_reference: Optional[str] = None

    notes: str | None = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    #Relations
    invoice_items: List["InvoiceItem"] = Relationship(
        back_populates="invoice"
    )
    transactions : List["Payment"] = Relationship(
        back_populates="invoice"
    )