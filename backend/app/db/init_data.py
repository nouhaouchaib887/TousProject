# backend/app/db/init_data.py
from os import name

from sqlmodel import Session, select
from app.models.core.administration.user import User, UserStatus
from app.models.core.administration.role import Role
import json
from app.core.security import get_password_hash
from app.core.config import settings


def init_initial_data(db: Session) -> None:
    roles_to_create = [
        {
            "label": "admin", 
            "description": "Gestion des comptes, des types de projets et des accès. Interface UX simplifiée."
        },
        {
            "label": "directeur", 
            "description": "Propriétaire des données métier. Vision stratégique et validation finale."
        },
        {
            "label": "agent", 
            "description": "Saisie des données techniques et géographiques."
        }
    ]
    # Dictionnaire pour stocker les objets roles créés (pour les lier aux users après)
    created_roles = {}

    for r_data in roles_to_create:
        # On cherche par 'label' (qui doit être unique)
        db_role = db.exec(select(Role).where(Role.label == r_data["label"])).first()
        if not db_role:
            db_role = Role( 
                label=r_data["label"], 
                description=r_data["description"]
            )
            db.add(db_role)
            db.commit() # On commit pour générer l'ID immédiatement
            db.refresh(db_role)
        created_roles[r_data["label"]] = db_role


    staff_roles_to_create = [
        {
             "name": 'Chef',
              "description": "Propriétaire des données métier. Vision stratégique et validation finale."
            
        },
        {
           "name": 'Assistant',
            "description": "Propriétaire des données métier. Vision stratégique et validation finale."
        }
    ]

    # --- 2. CRÉATION DU PREMIER ADMIN ---
    admin_email = settings.FIRST_SUPERUSER_EMAIL
    admin_username = settings.FIRST_SUPERUSER_USERNAME
    admin_firstname = settings.FIRST_SUPERUSER_FIRSTNAME
    admin_lastname = settings.FIRST_SUPERUSER_LASTNAME
    admin_user = db.exec(select(User).where(User.email == admin_email)).first()
    
    if not admin_user:
        new_admin = User(
            username=admin_username,
            firstname=admin_firstname,
            lastname=admin_lastname,
            email=admin_email,
            # Le mot de passe est haché avant d'entrer en base de données
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            must_change_password=True, # Forcer le changement à la première connexion
            User_status=UserStatus.ACTIVE,
            role_id=created_roles["admin"].id
        )
        db.add(new_admin)
        db.commit()
        print(f"Superuser created with email: {admin_email}")
    else:
        print(f"Superuser {admin_email} already exists.")

    


