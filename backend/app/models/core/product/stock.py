from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field


class StockMovementType(str, Enum):
    IN = "IN"              # entrée
    OUT = "OUT"            # sortie
    ADJUSTMENT = "ADJUSTMENT"  # correction inventaire


class StockMovementReason(str, Enum):
    PURCHASE = "PURCHASE"          # achat fournisseur
    SALE = "SALE"                  # vente client
    RETURN_CUSTOMER = "RETURN_CUSTOMER"
    RETURN_SUPPLIER = "RETURN_SUPPLIER"
    INVENTORY_ADJUSTMENT = "INVENTORY_ADJUSTMENT"
    INITIAL_STOCK = "INITIAL_STOCK"
    
class StockMovement(SQLModel, table=True):
    __tablename__ = "stock_movement"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    product_id: UUID = Field(foreign_key="product.id", index=True)

    movement_type: StockMovementType
    reason: StockMovementReason

    quantity: Decimal = Field(gt=0)

    movement_date: datetime = Field(default_factory=datetime.utcnow)

    reference: str | None = None
    notes: str | None = None

    created_at: datetime = Field(default_factory=datetime.utcnow)