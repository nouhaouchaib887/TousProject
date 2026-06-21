from __future__ import annotations

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



class UnitType(str, Enum):
    UNIT = "U"          # unité / pièce
    KG = "KG"
    LITER = "L"
    METER = "M"
    BOX = "BOX"


class ProductCategoryBase(SQLModel):

    reference: str = Field(
        index=True,
        unique=True,
        max_length=100,
        description="Référence interne du catégorie de produit"
    )

    lable: Optional[str] = None

    description: Optional[str] = None



class ProductCategory(ProductCategoryBase, table=True):
    __tablename__ = "product_category"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", index=True)  # Dernier utilisateur à avoir modifié le produit 
    #Relations
    products: List["Product"] = Relationship(back_populates="product_category"
    )
