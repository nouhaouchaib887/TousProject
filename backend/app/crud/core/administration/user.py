from sqlmodel import Session, select
from app.models.core.administration.user import User
import uuid


def get_users(db: Session):
    # 1. Construction de la requête de base
    statement = select(User)
    
    
    # 2. Exécution et retour des résultats
    results = db.exec(statement).all()
    return results