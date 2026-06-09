from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.core.administration.user import User
from app.core.config import settings
from app.models.core.administration.session import UserSession

# Indique à FastAPI où chercher le Token (dans l'en-tête Authorization: Bearer ...)
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_session),
    token: str = Depends(reusable_oauth2)
) -> User:
    """
    Vérifie le token JWT et retourne l'utilisateur actuel.
    Si le token est invalide ou l'utilisateur n'existe pas, renvoie une erreur 401.
    """
    # 1. Chercher la session en base de données au lieu de décoder un JWT
    statement = select(UserSession).where(
        UserSession.session_token == token, 
        UserSession.is_active == True
    )
    session_record = db.exec(statement).first()

    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalide ou expirée",
        )

    # 2. Récupérer l'utilisateur associé à cette session
    user = db.get(User, session_record.user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # if not user.is_active: # Si vous avez ce champ dans votre modèle User
    #    raise HTTPException(status_code=400, detail="Utilisateur inactif")
        
    return user
        

def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Vérifie si l'utilisateur actuel est un Administrateur.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="L'utilisateur n'a pas les privilèges suffisants"
        )
    return current_user
