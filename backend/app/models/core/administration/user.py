# backend/app/models/user.py
import uuid
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from app.core.security import verify_password, get_password_hash
from app.models.core.administration.passwordResetToken import PasswordResetToken
from pydantic import computed_field


# On utilise TYPE_CHECKING pour éviter les imports circulaires avec Project
if TYPE_CHECKING:
    from .role import Role
# 1. Définir l'énumération en anglais
class UserStatus(str, Enum):
    ACTIVE = "active"
    DISABLED = "disabled"
    PENDING = "pending"  # Utile pour les comptes créés mais non encore activés
    ARCHIVED ="archived"

class User(SQLModel, table=True):

    __tablename__ = "user"
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )
    username: str = Field(unique=True, index=True)
    lastname: str = Field(unique=False)
    firstname: str = Field(unique=False, index=True)
    email: str = Field(unique=True)
    hashed_password: str
    must_change_password: bool = Field(default=True)
    last_login: datetime = Field(default=None,nullable=True)
    User_status: UserStatus = Field(default=UserStatus.PENDING)
    role_id: int = Field(foreign_key="role.id")
    role: "Role" = Relationship(back_populates="users")
    password_reset_tokens: List["PasswordResetToken"] = Relationship(back_populates="user")

    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.firstname} {self.lastname}"
    
    def authenticate_user(self, password: str) -> bool:
        """
        Vérifie si le mot de passe fourni correspond à cet utilisateur.
        Utilisée pour une double validation avant une action critique.
        """
        return verify_password(password, self.hashed_password)
    

    
    def change_password(self,old_plain_password: str, new_plain_password: str) -> bool:
        if not verify_password(old_plain_password, self.hashed_password) or old_plain_password == new_plain_password:
            return False
        
        new_hashed_password = get_password_hash(new_plain_password)
        self.hashed_password = new_hashed_password
        return True
    
    def reset_password(self, old_plain_password, new_plain_password:str) -> bool:
        if self.change_password(old_plain_password, new_plain_password):
            self.must_change_password = False
            return True
        return False


