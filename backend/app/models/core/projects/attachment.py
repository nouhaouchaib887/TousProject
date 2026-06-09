# backend/app/models/core/attachment.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .project import Project
    from ..administration.user import User
    from ..Finance.transaction import PaymentTransaction   
    from ..Client.client import Client
    from ...plugins.topography.field_intervention import FieldIntervention
    from ...plugins.topography.officework import OfficeWork

class AttachmentType(str, Enum):

    # Types de fichiers courants pour les projets fonciers
    TITLE_DEED = "Titre Foncier"        # Titre Foncier / Certificat de propriété
    SURVEY_DATA = "Données de Levé"      # Fichier de points (CSV, TXT)
    CAD_DRAWING = "Plan AutoCAD"     # Plan AutoCAD (DWG, DXF)
    SITE_PHOTO = "Photo du Terrain"       # Photo du terrain
    OFFICIAL_REPORT = "PV de Bornage" # PV de bornage / Rapport technique
    # Types personnels
    NATIONAL_ID = "CIN Client"          # CIN du client
    # Types financiers
    CHEQUE = "Chèque"                  # Preuve de paiement par chèque
    BANK_TRANSFER = "Virement Bancaire" # Preuve de virement bancaire
    INVOICE = "Facture PDF"           # Facture PDF
    OTHER = "Autre"                    # Autre type de document

class Attachment(SQLModel, table=True):
    # --- Identifiants ---
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: Optional[uuid.UUID] = Field(default=None, foreign_key="project.id", index=True)
    # ... OU à une transaction spécifique (Preuve de paiement)
    transaction_id: Optional[uuid.UUID] = Field(default=None, foreign_key="paymenttransaction.id", index=True)
    client_id: Optional[uuid.UUID] = Field(default=None, foreign_key="client.id", index=True) # Facultatif : lié au client
    intervention_id: Optional[uuid.UUID] = Field(default=None, foreign_key="fieldintervention.id", index=True) # Facultatif : lié à une intervention de terrain
    office_work_id: Optional[uuid.UUID] = Field(default=None, foreign_key="officework.id", index=True) # Facultatif : lié à un travail de bureau
    
    # --- Métadonnées du Fichier ---
    name: str = Field(index=True)           # Nom affiché (ex: "Plan_Topographique_V1")
    file_type: AttachmentType = Field(default=AttachmentType.OTHER)
    file_extension: str                     # .pdf, .dwg, .jpg (pour l'icône dans l'UI)
    file_size: int                          # Taille en octets (pour limiter les abus)
    
    # --- Stockage (Le "Chemin") ---
    # On ne stocke jamais le fichier lui-même dans la base (trop lourd).
    # On stocke l'URL ou le chemin relatif sur le serveur/S3.
    file_path: str 
    
    # --- Audit ---
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    # staff_id de celui qui a téléchargé le fichier (Optionnel)
    uploaded_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    # --- Relations ---
    project: Optional["Project"] = Relationship(back_populates="attachments")
    transaction: Optional["PaymentTransaction"] = Relationship(back_populates="attachment")
    client : Optional["Client"] = Relationship(back_populates="attachment")
    field_intervention: Optional["FieldIntervention"] = Relationship(back_populates="field_attachments")
    office_work: Optional["OfficeWork"] = Relationship(back_populates="attachments")