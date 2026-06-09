
from sqlmodel import Session

from uuid import uuid4
from datetime import datetime
from app.models.core.projects.attachment import Attachment, AttachmentType
from typing import List, Optional
import uuid
from app.services.storageService import IStorage
from fastapi import UploadFile
import os


async def save_attachment_action(
    db: Session, 
    file: UploadFile, 
    attachment_type: AttachmentType,
    user_id: uuid.UUID,
    storage_service: IStorage,
    project_id: Optional[uuid.UUID] = None,

    client_id: Optional[uuid.UUID] = None,
    transaction_id: Optional[uuid.UUID] = None,
    intervention_id: Optional[uuid.UUID] = None,
    office_work_id: Optional[uuid.UUID] = None,
):
    # 1. Upload physique vers GCP
    # On délègue au service sans savoir si c'est Local, S3 ou GCP
    
    file_extension = os.path.splitext(file.filename)[1]
    # 1. Générer le nom unique
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    # 2. Upload physique avec le nom unique
    # Maintenant, l'erreur Pylance disparaîtra car les signatures correspondent
    file_uri = await storage_service.upload(
        project_id=str(project_id) if project_id else None, 
        file=file, 
        unique_filename=unique_filename
    )

    # 2. Création de l'enregistrement en base de données
    new_attachment = Attachment(
        name=file.filename,
        file_path=file_uri,
        file_type=attachment_type,
        file_extension=  file_extension,
        file_size=file.size, # FastAPI fournit la taille
        project_id=project_id,
        client_id=client_id,
        transaction_id=transaction_id,
        intervention_id=intervention_id,
        office_work_id=office_work_id,
        uploaded_by_id=user_id
    )
    
    db.add(new_attachment)
    db.flush()
    return new_attachment
def add_attachment_project_action(
    db: Session,
    project_id: uuid.UUID,
    client_id: Optional[uuid.UUID],
    attachments: list[dict]
):
    """Ajoute une pièce jointe à un projet."""
    
    for att in attachments:
            f_type = att.get("file_type")
            
            # Logique intelligente : Si c'est une CIN, on lie au Client
            c_id = client_id if f_type == AttachmentType.NATIONAL_ID else None
            
            new_attachment = Attachment(
                **att,
                project_id=project_id,
                client_id=c_id
            )
            db.add(new_attachment)
    return db