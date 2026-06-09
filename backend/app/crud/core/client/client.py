from sqlmodel import Session, select
from app.models.core.Client.client import Client
from app.models.core.Client.quality import Quality
import uuid
from app.models.core.projects.attachment import Attachment

def search_client_by_last_name_action(db: Session, last_name: str, limit: int = 10):
    """
    Recherche des clients par nom de famille.
    """
    statement = (
        select(Client)
        .where(Client.last_name.ilike(f"%{last_name}%"))
        .limit(limit)
    )
    
    results = db.exec(statement).all()
    return results
def search_client_by_id_action(db: Session, client_id: str):
    """
    Recherche un client par son ID.
    """
    db_client = db.get(Client, client_id)
    return db_client

def get_client_by_cin(db: Session, cin: str):
    statement = (
        select(Client)
        .where(Client.cin == cin)
    )
    
    results = db.exec(statement).first()
    return results

def add_client_action(db: Session, client_data: dict, attachment_id: uuid.UUID):
    """
    Ajoute un nouveau client dans la base de données.
    """
    quality_data = client_data.pop("quality", None)

    if quality_data and quality_data.get("name"):
        if quality_data.get("id"):
            quality_id = uuid.UUID(quality_data["id"]) if isinstance(quality_data["id"], str) else quality_data["id"]
            existing_quality = db.get(Quality, quality_id)

            if not existing_quality:
                raise ValueError(f"La qualité avec l'ID {quality_data['id']} n'existe pas.")

            client_data["quality_id"] = quality_id

        else:
            db_quality = Quality(name=quality_data["name"])
            db.add(db_quality)
            db.flush()
            client_data["quality_id"] = db_quality.id
            
    new_client = Client(**client_data)
    db.add(new_client)
    db.flush()
    # 2. Mettre à jour l'attachment avec l'ID du client (Le chaînon manquant !)
    
    db_attachment = db.get(Attachment, attachment_id)
    if db_attachment:
        db_attachment.client_id = new_client.id
        db.add(db_attachment)
    db.commit()
    db.refresh(new_client)

    return new_client
def update_client_action(db: Session, client_data: dict):
    """
    Met à jour un client existant dans la base de données.
    """
    db_client = db.get(Client, client_data.get("id"))
    if not db_client:
        quality = client_data.pop(quality,{})
    if quality :
        if not quality.get("id",""):
            quality= Quality(name=quality["name"])
            db.add(quality)
            db.flush()
            client_data['quality_id'] = quality.id
        else:
            quality_id = uuid.UUID(quality["id"]) if isinstance(quality["id"], str) else quality["id"]
            existing_lieu_dit = db.get(Quality, quality_id)
            if existing_lieu_dit:
                    client_data["quality_id"] = quality_id
            else:
                raise ValueError(f"La qualité avec l'ID {quality['id']} n'existe pas.")
        new_client = Client(**client_data)
        db.add(new_client)
        db.commit()
        db.refresh(new_client)
        return new_client
    quality = client_data.pop(quality,{})
    if quality :
        if not quality.get("id",""):
            quality= Quality(name=quality["name"])
            db.add(quality)
            db.flush()
            client_data['quality_id'] = quality.id
        else:
            quality_id = uuid.UUID(quality["id"]) if isinstance(quality["id"], str) else quality["id"]
            existing_lieu_dit = db.get(Quality, quality_id)
            if existing_lieu_dit:
                    client_data["quality_id"] = quality_id
            else:
                raise ValueError(f"La qualité avec l'ID {quality['id']} n'existe pas.")
    for key, value in client_data.items():
        if value is not None:
            setattr(db_client, key, value)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def search_clients_action(db: Session, search_query: str, limit: int = 10):
    """
    Recherche des clients dont le nom contient ou commence par la recherche.
    """
    # On utilise .ilike pour une recherche insensible à la casse (A = a)
    # Le format f"{search_query}%" cherche tout ce qui COMMENCE par...
    # Le format f"%{search_query}%" cherche tout ce qui CONTIENT...
    
    statement = (
        select(Client)
        .where(Client.full_name.ilike(f"%{search_query}%"))
        .limit(limit)
    )
    
    results = db.exec(statement).all()
    return results

def get_clients(db: Session):
    # 1. Construction de la requête de base
    statement = select(Client)
    
    
    # 2. Exécution et retour des résultats
    results = db.exec(statement).all()
    print(results)
    return results

def get_qualities(db:Session):
    # 1. Construction de la requête de base
    statement = select(Quality)
    
    
    # 2. Exécution et retour des résultats
    results = db.exec(statement).all()
    return results

