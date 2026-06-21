from sqlmodel import create_engine, Session
from app.core.config import settings

# 1. Utilisation de l'URL récupérée depuis le dossier core
database_url = settings.DATABASE_URL

# 2. Création de l'Engine pour PostgreSQL
engine = create_engine(
    database_url, 
    echo=True,        # Affiche les requêtes SQL dans la console (utile en dev)
    pool_pre_ping=True # Vérifie que la connexion est vivante avant de l'utiliser
)

# 3. Opération d'initialisation
def init_db():
    """
    Crée physiquement les tables dans PostgreSQL.
    Note : SQLModel utilisera les modèles importés dans db/base.py
    """
    # On s'assure que les modèles sont bien chargés avant le create_all
    from app.db.base import target_metadata 
    
    target_metadata.create_all(engine)

# 4. Générateur de session (utilisé par FastAPI et le CRUD)
def get_session():
    with Session(engine) as session:
        yield session