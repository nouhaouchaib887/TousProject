from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from .role import RolePermission

# On utilise TYPE_CHECKING pour éviter les imports circulaires avec Project
if TYPE_CHECKING:
    from .role import Role

class Permission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(default="",unique=True, index=True)
    description: Optional[str]=None
    #Relations
    roles: List["Role"] = Relationship(
        back_populates="permissions", 
        link_model=RolePermission # Doit être identique au link_model du Role
    )

    def getCodeAction(self)-> str:
        return self.name.split("_")[0]
    
    def updateDescription(self, new_description: str)-> None:
        self.description = new_description

    def updateName(self,new_name:str) -> None:
        self.name= new_name
    
