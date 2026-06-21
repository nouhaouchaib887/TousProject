from sqlalchemy import text
from app.db.session import engine

def check_db_connected() -> bool:
    """
    Vérifie si la connexion à PostgreSQL est active.
    Utile pour les 'Health Checks'.
    """
    try:
        # On tente une requête ultra-légère
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"Base de données non disponible : {e}")
        return False