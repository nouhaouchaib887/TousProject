from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime

# On utilise TYPE_CHECKING pour éviter les imports circulaires avec Project
if TYPE_CHECKING:
    from .user import User
    from .permission import Permission
# 1. Définir l'énumération en anglais
class RoleLabel(str, Enum):
    ADMIN = "admin"
    DIRECTEUR = "directeur"
    AGENT = "agent"


class RolePermission(SQLModel, table=True):
    role_id: Optional[int] = Field(
        default=None, foreign_key="role.id", primary_key=True
    )
    permission_id: Optional[int] = Field(
        default=None, foreign_key="permission.id", primary_key=True
    )
    
class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    label: RoleLabel = Field(default= RoleLabel.AGENT, nullable=False)
    description: Optional[str]=None
    #Relations
    users: List["User"] = Relationship(back_populates="role")
    permissions: List["Permission"] = Relationship(
        back_populates="roles", 
        link_model=RolePermission
    )

    def has_permission(self,permission_name: str) -> bool:
        for permission in self.permissions:
            if permission.name == permission_name:
                return True
        return False
    
    def add_permission(self,permission: "Permission") -> None:

        if not self.has_permission(permission.name):
            self.permissions.append(permission)

    def remove_permission(self,permission_name: str) -> None:
        self.permissions = [perm for perm in self.permissions if perm.name != permission_name]

    def list_permissions(self) -> List[str]:
        return [permission.name for permission in self.permissions]
    
    def update_label(self, new_label: RoleLabel) -> None:
        self.label = new_label