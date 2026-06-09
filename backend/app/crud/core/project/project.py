from app.models.core.location.location import Commune, LieuDit
from app.models.core.administration.user import User
from app.models.plugins.topography.office_task_category import OfficeTaskCategory
from sqlmodel import Session, select
from uuid import uuid4
from datetime import datetime
from app.models.core.projects.project import Project, ProjectClientLink
import uuid
from typing import List, Optional
from app.models.core.projects.project import Project, ProjectClientLink
from app.models.core.projects.project_type import ProjectType
from app.models.core.Client.client import Client
from app.models.core.Client.quality import Quality
from app.models.core.Finance.project_payment import FinancialDetails
from app.models.core.Finance.transaction import PaymentTransaction
from app.models.plugins.topography.topoMetaData import TopoMetadata
from app.models.plugins.topography.coordinates import Coordinates
from app.models.plugins.topography.field_intervention import FieldIntervention, FieldInterventionStaffLink
from app.models.plugins.topography.officework import OfficeWork, OfficeWorkStaffLink
from app.models.plugins.topography.reference_system import ReferenceSystem
from app.models.core.HR.staff import Staff
from app.models.plugins.topography.intervention_role import InterventionStaffRole
from app.crud.plugins.topography.topo_metadata import  add_topo_metadata_action
from app.crud.core.Finance.project_payment import add_financial_details_action
from fastapi import APIRouter, Depends, HTTPException


def add_project_action(
    db: Session,
    current_user_id: uuid.UUID,
    project_data: dict,
    client_id: uuid.UUID,
    topo_data: dict = None,
    finance_data: dict = None,
    transactions: List[dict] = None,
    field_interventions: list[dict] = None,
    office_work: list[dict] = None,
    coordinates: List[dict] = None
        
):
    # 1. CRÉATION DU PROJET
    db_project = Project(**project_data, updated_by_id=current_user_id, client_id=client_id)
    db_project.created_at = datetime.utcnow()
    db.add(db_project)
    db.flush()  # pour générer l'ID du projet et l'utiliser dans les étapes suivantes

    # 2. CRÉATION DU TOPO METADATA (L'aspect technique)
    if topo_data:
        add_topo_metadata_action(
            db=db,
            current_user_id=current_user_id,
            project_id=db_project.id,
            topo_data=topo_data,
            filed_interventions=field_interventions,
            office_work=office_work,
            coordinates=coordinates
        )
    
    # 3. CRÉATION DES DÉTAILS FINANCIERS (L'aspect comptable)
    if finance_data:
        add_financial_details_action(
            db=db,
            project_id=db_project.id,
            current_user_id=current_user_id,
            finance_data=finance_data,
            transactions=transactions
        )
    db.commit()  # Commit global pour s'assurer que tout est enregistré ensemble
    
    return db_project

def generate_project_reference(db: Session, project_type_code: str) -> str:
    year = datetime.utcnow().year

    count = db.exec(
        select(Project).where(
            Project.reference.like(f"{project_type_code}-{year}-%")
        )
    ).all()

    sequence = len(count) + 1

    return f"{project_type_code}-{year}-{sequence:04d}"
def add_project (
        db: Session,
        current_user_id,
        project_type_id,
        project_type_code,
        clients,
        topo_metadata,
        financial_details,
        field_interventions,
        office_works
):
    # 1. CRÉATION DU PROJET
    db_project = Project(updated_by_id=current_user_id)
    db_project.created_at = datetime.utcnow()
    db_project.project_type_id = project_type_id
    db_project.reference = generate_project_reference(db, project_type_code)

    db.add(db_project)
    db.flush()  # pour générer l'ID du projet et l'utiliser dans les étapes suivantes
    for client in clients :
        db_client = ProjectClientLink ( client_id = client["id"], project_id=db_project.id)
        db.add(db_client)
    if topo_metadata:
        saved_topo_metada = add_topo_metadata_action(
            db=db,
            current_user_id=current_user_id,
            project_id=db_project.id,
            topo_data=topo_metadata,
            filed_interventions=field_interventions,
            office_work=office_works,
        
        )
    if financial_details:
         saved_financial_details=add_financial_details_action(
            db=db,
            project_id=db_project.id,
            current_user_id=current_user_id,
            finance_data=financial_details,
            
        )
    db.commit()
    db.refresh(db_project)

    return {
        "id": db_project.id,
        "reference": db_project.reference,
        "financial_details" : saved_financial_details,
        **saved_topo_metada
    }




def update_project_clients(
    db: Session,
    project_id: uuid.UUID,
    clients: list[dict]
):
    """
    Synchronise les clients d'un projet.
    """

    # IDs envoyés par le frontend
    new_client_ids = {
        uuid.UUID(client["id"]) if isinstance(client["id"], str)
        else client["id"]
        for client in clients
    }

    # Relations actuellement en base
    existing_links = db.exec(
        select(ProjectClientLink).where(
            ProjectClientLink.project_id == project_id
        )
    ).all()

    existing_client_ids = {
        link.client_id
        for link in existing_links
    }

    # ------------------------
    # SUPPRESSION
    # ------------------------
    for link in existing_links:
        if link.client_id not in new_client_ids:
            db.delete(link)

    # ------------------------
    # AJOUT
    # ------------------------
    clients_to_add = new_client_ids - existing_client_ids

    for client_id in clients_to_add:
        db.add(
            ProjectClientLink(
                project_id=project_id,
                client_id=client_id
            )
        )

    db.flush()
def update_project(
    db: Session,
    project_id: uuid.UUID,
    current_user_id: uuid.UUID,
    project_type_id=None,
    project_type_code=None,
    clients=None,
    topo_metadata=None,
    financial_details=None,
    field_interventions=None,
    office_works=None,
):
    db_project = db.get(Project, project_id)

    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db_project.updated_at = datetime.utcnow()
    db_project.updated_by_id = current_user_id

    if project_type_id:
        db_project.project_type_id = project_type_id
    if project_type_code:
        db_project.reference = generate_project_reference(db, project_type_code)

    if clients is not None:
        update_project_clients(db, project_id, clients)
    saved_topo_data = {}
    if topo_metadata is not None or field_interventions is not None or office_works is not None:
        saved_topo_data = add_topo_metadata_action(
            db=db,
            current_user_id=current_user_id,
            project_id=project_id,
            topo_data=topo_metadata,
            filed_interventions=field_interventions,
            office_work=office_works,
        )

    saved_financial_details = None
    if financial_details is not None:
        saved_financial_details = add_financial_details_action(
            db=db,
            project_id=project_id,
            current_user_id=current_user_id,
            finance_data=financial_details,
        )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return {
        "id": db_project.id,
        "reference": db_project.reference,
        "financial_details": saved_financial_details,
        **saved_topo_data
    }




def get_projects_table(db: Session) -> List[dict]:
    projects = db.exec(
        select(Project).order_by(Project.created_at.desc())
    ).all()

    result = []

    for project in projects:
        # Project type
        project_type = db.get(ProjectType, project.project_type_id)

        # Clients
        links = db.exec(
            select(ProjectClientLink).where(
                ProjectClientLink.project_id == project.id
            )
        ).all()

        clients = []
        for link in links:
            client = db.get(Client, link.client_id)
            quality = db.get(Quality, client.quality_id)
            if client:
                clients.append({
                    "id": client.id,
                    "first_name": client.first_name,
                    "last_name": client.last_name,
                    "phone_number": client.phone_number,
                    "email": client.email,
                    "client_type": client.client_type,
                    "cin": client.cin,
                    "quality":{
                        "id":quality.id,
                        "name":quality.name

                    },
                    "company_name": client.company_name,
                    "ice": client.ice,
                    "rc": client.rc,
                })

        # Financial details
        financial_details = None
        finance = db.exec(
            select(FinancialDetails).where(
                FinancialDetails.project_id == project.id
            )
        ).first()

        if finance:
            transactions_db = db.exec(
                select(PaymentTransaction).where(
                    PaymentTransaction.financial_details_id == finance.id,
                    PaymentTransaction.is_confirmed == True
                )
            ).all()

            """
            total_paid = sum(t.amount or 0 for t in transactions_db)
            balance = (finance.amount_ttc or 0) - total_paid

            if finance.is_pro_bono:
                payment_status = "GRATUIT"
            elif total_paid == 0:
                payment_status = "NON_PAYE"
            elif balance > 0:
                payment_status = "PARTIEL"
            else:
                payment_status = "PAYE"
            """

            financial_details = {
                "id": finance.id,
                "amount_ttc": finance.amount_ttc,
                "amount_ht": finance.amount_ht,
                "vat_rate": finance.vat_rate,
                "is_tax_exempt": finance.is_tax_exempt,
                "is_pro_bono": finance.is_pro_bono,
                "balance": finance.balance,
                "payment_status": finance.payment_status,
                "total_paid": finance.total_paid,
                "transactions": [
                    {
                        "id": t.id,
                        "amount": t.amount,
                        "payment_mode": t.payment_mode,
                        "payment_date": t.payment_date,
                        "reference_number": t.reference_number,
                        "is_confirmed": t.is_confirmed,
                    }
                    for t in transactions_db
                ],
            }

        # Topo metadata
        topo_metadata = None
        field_interventions = []
        office_works = []

        topo = db.exec(
            select(TopoMetadata).where(
                TopoMetadata.project_id == project.id
            )
        ).first()
        print("topo", topo)

        if topo:
            coords = db.exec(
                select(Coordinates).where(
                    Coordinates.topo_metadata_id == topo.id,
                    Coordinates.s == False
                )
            ).all()
            print("coords", coords)

            system_coords = db.exec(
                select(Coordinates).where(
                    Coordinates.topo_metadata_id == topo.id,
                    Coordinates.s == True
                )
            ).all()
            commune = db.get(Commune, topo.commune_id) if topo.commune_id else None
            lieu_dit = db.get(LieuDit, topo.lieu_dit_id) if topo.lieu_dit_id else None
            reference_system = db.get(ReferenceSystem,topo.reference_system_id) if topo.reference_system_id else None
            topo_metadata = {
                "id": topo.id,
                "registry_type": topo.registry_type,
                "title_number": topo.title_number,
                "title_index": topo.title_index,
                "document_type": topo.document_type,
                "designation": topo.designation,
                "created_at": topo.created_at,
                "updated_at": topo.updated_at,
                "place_name": topo.place_name,
                "coordinates": [
                    {"id": c.id, "x": c.x, "y": c.y, "s": c.s}
                    for c in coords
                ],
                "commune": {"id": commune.id, "name": commune.name} if commune else None,
                "lieu_dit": {"id": lieu_dit.id, "name": lieu_dit.name} if lieu_dit else None,
                "reference_system": {"id": reference_system.id, "name": reference_system.name} if reference_system else None,
                "reference_benchmark": topo.reference_benchmark,
                "system_zone": topo.system_zone,
                "system_coordinates": [
                    {"id": c.id, "x": c.x, "y": c.y, "s": c.s}
                    for c in system_coords
                ],
                "system_notes": topo.system_notes,
            }

            # Field interventions
            field_db = db.exec(
                select(FieldIntervention).where(
                    FieldIntervention.topo_metadata_id == topo.id
                )
            ).all()

            for intervention in field_db:
                staff_links = db.exec(
                    select(FieldInterventionStaffLink).where(
                        FieldInterventionStaffLink.intervention_id == intervention.id
                    )
                ).all()

                staff_with_roles = []
                staff_with_roles = []

                for link in staff_links:
                    staff = db.get(Staff, link.staff_id)
                    role = db.get(InterventionStaffRole, link.role_id)
                    

                    staff_with_roles.append({
                        "id": link.id,
                        "agent": {"id": staff.id, "full_name": staff.full_name} if staff else None,
                        "role": {"id": role.id, "name": role.name} if role else None
                    })

                field_interventions.append({
                    "id": intervention.id,
                    "staff_with_roles": staff_with_roles,
                    "intervention_date": intervention.intervention_date,
                    "observations": intervention.observations,
                })

            # Office works
            office_db = db.exec(
                select(OfficeWork).where(
                    OfficeWork.topo_metadata_id == topo.id
                )
            ).all()

            for work in office_db:
                staff_links = db.exec(
                    select(OfficeWorkStaffLink).where(
                        OfficeWorkStaffLink.intervention_id == work.id
                    )
                ).all()

                staff_with_roles = []
                staff_with_roles = []

                for link in staff_links:
                    staff = db.get(Staff, link.staff_id)
                    role = db.get(InterventionStaffRole, link.role_id)

                    staff_with_roles.append({
                        "id": link.id,
                        "agent": {"id": staff.id, "full_name": staff.full_name} if staff else None,
                        "role": {"id": role.id, "name": role.name} if role else None
                    })
                task_category = db.get(OfficeTaskCategory, work.task_category_id) if work.task_category_id else None
                office_works.append({
                    "id": work.id,
                    "staff_with_roles": staff_with_roles,
                    "task_date": work.work_date,
                    "task_category": {"id": task_category.id, "name": task_category.name} if task_category else None,
                    "time_spent_hour": work.time_spent_hours,
                    "description": work.description,
                })

        result.append({
            "id": project.id,
            "reference": project.reference,
            "project_type": {
                "id": project_type.id,
                "name": project_type.name,
                "code": project_type.code,
                "color": project_type.color,
                "description": project_type.description,
            },
            "status": project.status,
            "clients": clients,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
            "updated_by": {
                "id": project.updated_by_id,
                "full_name": db.get(User, project.updated_by_id).full_name if project.updated_by_id else None
            } if project.updated_by_id else None,
            "financial_details": financial_details,
            "field_interventions": field_interventions,
            "office_works": office_works,
            "topo_metadata": topo_metadata,
        })

    return result