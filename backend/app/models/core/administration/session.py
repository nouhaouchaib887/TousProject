# backend/app/models/user.py
import uuid
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timedelta

# On utilise TYPE_CHECKING pour éviter les imports circulaires avec Project
if TYPE_CHECKING:
    from .user import User


class UserSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_token: str = Field(unique=True, index =True)
    ip_address:str = Field(index = True)
    user_agent: str =Field()
    created_at:datetime = Field(default = datetime.utcnow())
    closed_at: datetime = Field(default=None, nullable=True)
    last_active_at: datetime = Field(default = datetime.utcnow())
    is_active: bool = Field(default = True)
    user_id: uuid.UUID = Field(foreign_key="users.id")



    def is_valid(self, timeout_minutes:int =30)-> bool:
        if not self.is_active:
            return False
        
        expiration_time = self.last_active_at + timedelta(minutes=timeout_minutes)
        if datetime.utcnow() > expiration_time:
            self.invalidate()
            return False
        return True

    def invalidate(self):
        self.is_active = False

    def refresh_activity(self) -> None:
        """Met à jour l'horodatage à chaque requête de l'utilisateur."""
        self.last_activity_at = datetime.now()

    def get_duration(self) -> timedelta:
        """
            Calcule la durée totale de la session depuis sa création.
            Retourne un objet timedelta (jours, secondes, microsecondes).
        """
        if self.is_active:
            # Si la session est en cours, on calcule par rapport à "maintenant"
            return datetime.now() - self.created_at
        else:
            # Si elle est invalidée, on calcule la durée jusqu'à la dernière activité
            return self.last_activity_at - self.created_at