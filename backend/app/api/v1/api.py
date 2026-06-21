from fastapi import APIRouter
from app.api.v1.endpoints.core.administration import auth as login
from app.api.v1.endpoints.core.administration import user as user_router

api_router = APIRouter()

# On inclut le fichier login sous le tag "auth"
api_router.include_router(login.router, tags=["auth"])


api_router.include_router(user_router.router, tags=["user"])

