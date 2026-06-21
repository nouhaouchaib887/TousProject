
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from app.db.session import get_session
from app.core.auth import get_current_user
from app.crud.core.administration.user import get_users
from app.models.core.administration.user import User
from typing import List, Optional

router = APIRouter()



@router.get("/get_users", response_model=List[dict])
def read_location(
    db: Session = Depends(get_session),
):
    """

    """

    users = get_users (db=db)

    return users
