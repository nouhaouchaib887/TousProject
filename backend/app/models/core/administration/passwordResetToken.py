
# backend/app/models/user.py
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timedelta
import uuid

# On utilise TYPE_CHECKING pour éviter les imports circulaires avec Project
if TYPE_CHECKING:
    from .user import User

import secrets # Pour générer un token aléatoire sécurisé

class PasswordResetToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Le jeton unique envoyé dans le lien 
    token: str = Field(unique=True, index=True, default_factory=lambda: secrets.token_urlsafe(32))
    
    # Dates de validité
    created_at: datetime = Field(default_factory=datetime.now)
    expires_at: datetime = Field(default_factory=lambda: datetime.now() + timedelta(minutes=30))
    
    # Sécurité supplémentaire
    is_used: bool = Field(default=False)
    ip_address: Optional[str] = None # IP qui a fait la demande
    
    # Relation avec l'utilisateur
    user_id: uuid.UUID = Field(foreign_key="user.id")

    user: "User" = Relationship(back_populates="password_reset_tokens")

    # --- OPERATIONS ---

    def is_valid(self) -> bool:
        """Vérifie si le token est encore utilisable (temps + non utilisé)."""
        return not self.is_used and datetime.now() < self.expires_at

    def mark_as_used(self) -> None:
        """Invalide le token après un changement de mot de passe réussi."""
        self.is_used = True

    def get_remaining_time(self) -> int:
        """Retourne le temps restant en minutes avant expiration."""
        if not self.is_valid():
            return 0
        delta = self.expires_at - datetime.now()
        return int(delta.total_seconds() / 60)
    