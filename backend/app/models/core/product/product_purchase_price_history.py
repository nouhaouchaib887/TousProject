
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

import uuid
from typing import Optional, List, TYPE_CHECKING

from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .product import Product

class ProductPurchasePriceHistory(SQLModel, table=True):
    __tablename__ = "product_purchase_price_history"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    product_id: UUID = Field(foreign_key="product.id", nullable=False)

    purchase_price: Decimal = Field(default=Decimal("0"))

    source_invoice_id: Optional[UUID] = Field(default=None, foreign_key="invoice.id")
    source_invoice_item_id: Optional[UUID] = Field(default=None, foreign_key="invoice_item.id")

    changed_at: datetime = Field(default_factory=datetime.utcnow)
    product: Optional["Product"] = Relationship(back_populates="purchase_prices")