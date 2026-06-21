from datetime import datetime, date
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from typing import Optional, List, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .invoice import Invoice

class InvoiceItem(SQLModel, table=True):
    __tablename__ = "invoice_item"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    invoice_id: UUID = Field(foreign_key="invoices.id", index=True)
    product_id: UUID = Field(foreign_key="products.id", index=True)

    quantity: Decimal = Field(gt=0)

    unit_price: Decimal = Field(ge=0)

    vat_rate: Decimal = Field(default=20, ge=0)

    total_ht: Decimal = Field(default=0)
    total_vat: Decimal = Field(default=0)
    total_ttc: Decimal = Field(default=0)

    #Relations

    invoice : "Invoice" = Relationship(
        back_populates="invoice_items"
    )