
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from app.db.session import get_session
from app.core.auth import get_current_user
from app.crud.core.administration.auth import authenticate_user_action, create_session_action
from app.models.core.administration.user import User

router = APIRouter()

@router.post("/login", response_model=dict)
def login_endpoint(
    payload: dict, 
    request: Request, 
    db: Session = Depends(get_session)
):
    # 1. APPEL AU CRUD : Vérifier l'utilisateur
    # On lui passe la DB et les infos du Schema d'entrée
    auth_result = authenticate_user_action(db, payload.username, payload.password)
    
    if not auth_result["success"]:
        raise HTTPException(status_code=401, detail=auth_result["message"])
    
    user = auth_result["user"]

    # 2. APPEL AU CRUD : Créer la session
    user_session = create_session_action(
        db, 
        user_id=user.id, 
        ip_address=request.client.host, 
        user_agent=request.headers.get("user-agent")
    )

    # 3. TRANSACTION : On valide tout en base de données
    db.commit()
    db.refresh(user_session)

    # 4. RÉPONSE : FastAPI transforme automatiquement ce dictionnaire 
    # en l'objet LoginResponse (JSON) que tu as défini.
    return {
        "message": f"Welcome {user.firstname} {user.lastname}",
        "user": user,
        "session": user_session,
        "must_change_password": user.must_change_password
    }


@router.get("/me", response_model=dict)
def get_current_user_endpoint(
    # FastAPI va appeler get_current_user tout seul
    current_user: User = Depends(get_current_user) 
):
    # Si le code arrive ici, c'est que l'utilisateur est forcément authentifié
    return current_user

    