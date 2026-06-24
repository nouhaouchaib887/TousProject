from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field


class FinancialAccountType(str, Enum):
    CASH = "ESPECE"              # Caisse
    BANK = "BANQUE"              # Compte bancaire
    MOBILE_MONEY = "MOBILE_MONEY"  # Optionnel


class FinancialAccount(SQLModel, table=True):
    __tablename__ = "financial_account"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True
    )

    name: str = Field(
        max_length=255,
        index=True
    )

    account_type: FinancialAccountType

    account_number: str | None = Field(
        default=None,
        max_length=100
    )

    bank_name: str | None = Field(
        default=None,
        max_length=255
    )

    description: str | None = None

    is_active: bool = Field(default=True)

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow
    )