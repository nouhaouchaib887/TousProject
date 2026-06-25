
from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4
import uuid
from pydantic import computed_field
from typing import Optional, List, TYPE_CHECKING


from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .product_category import ProductCategory
    from .product_unit import ProductUnit
    from .product_purchase_price_history import  ProductPurchasePriceHistory

class UnitType(str, Enum):
    UNIT = "U"          # unité / pièce
    KG = "KG"
    LITER = "L"
    METER = "M"
    BOX = "BOX"


class ProductBase(SQLModel):
    label: str = Field(index=True, max_length=255)

    reference: str = Field(
        index=True,
        unique=True,
        max_length=100,
        description="Référence interne du produit"
    )

    unit: UnitType = Field(default=UnitType.UNIT)

    median_purchase_price: Optional[float] = Field(default=0, ge=0)
    margin_rate: Decimal = Field(default=Decimal("20"))
    vat_rate: Decimal = Field(default=20, ge=0)

    min_stock_level: Decimal = Field(default=0, ge=0)

    is_purchasable: bool = True
    is_sellable: bool = True


class Product(ProductBase, table=True):
    __tablename__ = "product"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    product_category_id : UUID = Field(foreign_key="product_category.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    updated_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", index=True)  # Dernier utilisateur à avoir modifié le produit 
    #Relations
    product_category : "ProductCategory" = Relationship(back_populates="products"
    )
    units: List["ProductUnit"]  = Relationship(back_populates="product")
    purchase_prices: List["ProductPurchasePriceHistory"] = Relationship(back_populates="product")

    @computed_field
    @property
    def recommended_selling_price(self) -> float:
        return round(
            self.median_purchase_price * (1 + self.margin_rate / 100),
        2
    )
    