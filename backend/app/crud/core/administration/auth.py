from sqlmodel import Session, select
from uuid import uuid4
from datetime import datetime
from app.models.core.administration.user import User, UserStatus
from app.models.core.administration.session import UserSession # Pour éviter la confusion avec sqlmodel.Session
from app.models.core.administration.passwordResetToken import PasswordResetToken
from app.core.security import verify_password
from typing import Optional


def authenticate_user_action(db: Session, username: str, password: str, ip_address: str = None) -> dict:
    """
     Action CRUD qui orchestre l'authentification de l'utilisateur.
     Retourne un dictionnaire avec le succès, l'utilisateur et un indicateur de changement de mot de passe.
        db: Session - La session de base de données SQLModel
        username: str - Le nom d'utilisateur fourni
        password: str - Le mot de passe fourni
        ip_address: str - L'adresse IP de l'utilisateur (optionnel)
        return: dict - Dictionnaire avec les résultats de l'authentification
    """
    # 1. Recherche et vérification du mot de passe (comme précédemment)
    statement = select(User).where(User.username == username)
    user = db.exec(statement).first()

    if not user or not user.authenticate_user(password):
        return {"success": False, "message": "Identifiants invalides"}

    # 2. Vérification du statut du compte
    if user.User_status != UserStatus.ACTIVE:
        return {"success": False, "message": "Votre compte n'est pas encore actif"}

    # 3. GESTION DE LA PREMIÈRE CONNEXION
    # On vérifie si l'utilisateur doit changer son mot de passe
    requires_password_change = user.must_change_password

    # 4. Mise à jour du suivi
    user.last_login = datetime.utcnow()
    db.add(user)

    # db.commit() (pour l'instant, on ne commit pas encore ici pour éviter des commits multiples inutiles)
    # Le retour contient maintenant l'information sur la première connexion
    return {
        "success": True,
        "user": user,
        "must_change_password": requires_password_change 
    }

def create_session_action(db: Session, user_id: int, ip_address: str, user_agent: str) -> UserSession:
    """
    Crée une nouvelle session utilisateur en base de données.
    1. Génère un token unique pour la session.
    2. Crée une entrée UserSession avec les informations fournies.
    3. Retourne l'objet UserSession créé.
   
    """
    token = str(uuid4())
    new_session = UserSession(
        user_id=user_id,
        session_token=token,
        ip_address=ip_address,
        user_agent=user_agent, # Pour savoir si c'est un PC ou un Mobile
        is_active=True
    )
    db.add(new_session)
    return new_session


def get_session_by_token_action(db: Session, token: str) -> Optional[UserSession]:
    """
    Recherche une session active par son token unique.
    Inclut l'utilisateur lié à cette session.
    """
    # On cherche la session qui correspond au token ET qui est toujours marquée active
    statement = select(UserSession).where(
        UserSession.session_token == token,
        UserSession.is_active == True
    )
    session_db = db.exec(statement).first()

    # Si on trouve la session, on peut mettre à jour la date de dernière activité
    if session_db:
        session_db.last_active_at = datetime.utcnow()
        db.add(session_db)
        # On ne commit pas forcément ici, on peut laisser l'endpoint s'en charger
        
    return session_db


def change_password_action(
    db: Session, 
    user: User, 
    old_password: str, 
    new_password: str
) -> User:
    """
    Action CRUD qui orchestre le changement de mot de passe en utilisant
    la logique interne du modèle User.
    """
    
    # 1. Appel de la méthode que vous avez développée dans la classe User
    success = user.change_password(old_password, new_password)
    if not success:
        return {"success":False, "message": "Le mot de passe actuel est incorrect ou le nouveau mot de passe est identique à l'ancien."}
    # 2. Sauvegarde des modifications en base de données
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"success": True,"user": user, "message":"Mot de passe changé avec succès."}

def reset_password_action(
        db: Session,
        user: User,
        old_password:str,
        new_password:str
) -> dict:
    """
    Action CRUD qui orcheste la réinitialisation du mot de passe en utilisant 
    """

    # 1. Appel de la méthode que vous avez développée dans la classe User
    success = user.reset_password(old_password, new_password)
    if not success:
        return {"success": success, "message": "Le mot de passe actuel est incorrect ou le nouveau mot de passe est identique à l'ancien."}


    # 2. Sauvegarde des modifications en base de données
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"success": True, "message": "Mot de passe réinitialisé avec succès."}

def logout_action(db: Session, token: str) -> bool:
    """
    Désactive une session spécifique.
    """
    statement = select(UserSession).where(UserSession.session_token == token)
    session_db = db.exec(statement).first()

    if session_db:
        session_db.is_active = False
        # Optionnel : on peut enregistrer l'heure de fin
        session_db.closed_at = datetime.utcnow() 
        db.add(session_db)
        db.commit()
        return True
    
    return False

def create_password_reset_token_action(
    db: Session, 
    user_id: int, 
    ip_address: str
) -> PasswordResetToken:
    """
    Crée un jeton de réinitialisation sécurisé en base de données.
    """
    # On crée l'instance (le token et les dates sont gérés par vos default_factory)
    db_token = PasswordResetToken(
        user_id=user_id,
        ip_address=ip_address
    )
    
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def verify_and_use_reset_token_action(db: Session, token_str: str) -> Optional[int]:
    """
    Vérifie si le token est valide, non utilisé et non expiré.
    Retourne l'user_id si valide, sinon None.
    """
    statement = select(PasswordResetToken).where(
        PasswordResetToken.token == token_str,
        PasswordResetToken.is_used == False,
        PasswordResetToken.expires_at > datetime.now()
    )
    db_token = db.exec(statement).first()

    if not db_token:
        return None

    # Marquage du token comme utilisé (Sécurité : un token ne sert qu'une fois !)
    db_token.is_used = True
    db.add(db_token)
    db.commit()

    return db_token.user_id