# backend/app/models/core/location.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from ...plugins.topography.topoMetaData import TopoMetadata

class Region(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(unique=True, index=True)
    provinces: List["Province"] = Relationship(back_populates="region")
    topo_metadatas: List["TopoMetadata"] = Relationship(back_populates="region")

class Province(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    region_id: uuid.UUID = Field(foreign_key="region.id")
    region: "Region" = Relationship(back_populates="provinces")
    communes: List["Commune"] = Relationship(back_populates="province")
    topo_metadatas: List["TopoMetadata"] = Relationship(back_populates="province")

class Commune(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    province_id: uuid.UUID = Field(foreign_key="province.id")
    province: "Province" = Relationship(back_populates="communes")
    topo_metadatas: List["TopoMetadata"] = Relationship(back_populates="commune")
    lieu_dits: List["LieuDit"] = Relationship(back_populates="commune")

class LieuDit(SQLModel, table=True):
    __tablename__: str = "lieu_dit"
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    commune_id: Optional[uuid.UUID] = Field(default=None, foreign_key="commune.id", index=True)
    commune: Optional["Commune"] = Relationship(back_populates="lieu_dits")
    topo_metadatas: List["TopoMetadata"] = Relationship(back_populates="lieu_dit")