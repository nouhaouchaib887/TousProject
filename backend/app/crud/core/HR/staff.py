from sqlmodel import Session, select
from app.models.core.HR.staff import Staff
from app.models.plugins.topography.intervention_role import InterventionStaffRole
import uuid



def add_staff_action(db: Session, staff_data: dict):
    """
    Ajoute un nouveau collaborareur dans la base de données.
    """
    new_staff = Staff(**staff_data)
    db.add(new_staff)
    db.flush()
   
    db.commit()
    db.refresh(new_staff)

    return new_staff

def get_staff(db: Session):
    # 1. Construction de la requête de base
    statement = select(Staff)
    
    
    # 2. Exécution et retour des résultats
    results = db.exec(statement).all()

    return results



def get_roles(db:Session):
    # 1. Construction de la requête de base
    statement = select(InterventionStaffRole)
    
    
    # 2. Exécution et retour des résultats
    results = db.exec(statement).all()

    return results