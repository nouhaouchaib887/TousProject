from sqlmodel import Session, select
from uuid import uuid4
from datetime import datetime
from app.models.core.projects.project_type import ProjectType
import uuid
from typing import List, Optional
from app.models.core.administration.user import User 
from app.models.core.administration.role import Role


def add_project_type(
    db: Session,
    current_user_id: uuid.UUID,
    name: str,
    code: str,
    color: Optional[str] = None,
    description: Optional[str] = None,
    isByDefault: Optional[bool] = False,
    isActive:Optional[bool] = True,
):
    # 1. CRÉATION DU PROJET
    db_project_type = ProjectType(
        name=name,
        code=code,
        color=color,
        created_by_id=current_user_id,
        is_by_default=isByDefault,
        description= description,
        created_at=datetime.utcnow(),
        is_active= isActive
    )
    db.add(db_project_type)
    db.commit()  # Commit global pour s'assurer que tout est enregistré ensemble
    
    return db_project_type


def get_project_types(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    only_active: bool = False
) -> List[ProjectType]:
    """
    Récupère la liste des types de projets avec pagination.
    Permet également de filtrer pour n'avoir que les types actifs.
    """
    # 1. Construction de la requête de base
    statement = select(ProjectType)
    
    # 2. Application des filtres optionnels
    if only_active:
        statement = statement.where(ProjectType.is_active == True)
        
    # 3. Tri par défaut (par exemple, les types par défaut en premier, puis par nom)
    statement = statement.order_by(ProjectType.is_by_default.desc(), ProjectType.name.asc())
    
    # 4. Application de la pagination (skip et limit)
    statement = statement.offset(skip).limit(limit)
    
    # 5. Exécution et retour des résultats
    results = db.exec(statement).all()
    print(results)
    return results


def get_project_type_by_id(db: Session, project_type_id: uuid.UUID) -> Optional[ProjectType]:
    """
    Récupère un type de projet spécifique par son ID unique.
    """
    return db.get(ProjectType, project_type_id)