
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



from enum import Enum
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

from sqlmodel import SQLModel, Field, Relationship


class UnitType(str, Enum):
    UNIT = "U"      # unité / pièce
    KG = "KG"
    LITER = "L"
    METER = "M"
    BOX = "BOX"
    BAG = "BAG"    # sac
    TON = "TON"    # tonne


class ProductUnitBase(SQLModel):
    label: UnitType = Field(nullable=False)
    conversion_to_base: Decimal = Field(default=Decimal("1"))
    is_default: bool = Field(default=False)



class ProductUnit(ProductUnitBase, table=True):
    __tablename__ = "product_unit"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    product_id: UUID = Field(foreign_key="product.id", nullable=False) 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", index=True)  # Dernier utilisateur à avoir modifié le produit 
    #Relations
    product: Optional[Product] = Relationship(back_populates="units")
