
# On importe SQLModel
from sqlmodel import SQLModel

# ON FORCE LE CHARGEMENT DES MODÈLES ICI
# Sans ces lignes, SQLModel.metadata reste vide !
from app.models.core.administration.user import User
from app.models.core.administration.role import Role, RolePermission
from app.models.core.administration.permission import Permission
from app.models.core.administration.session import UserSession
from app.models.core.administration.passwordResetToken import PasswordResetToken
from app.models.core.Partner.partner import Partner
from app.models.core.product.product import Product
from app.models.core.product.stock import StockMovement
from app.models.core.location.location import Region, Province, Commune
# On exporte metadata pour que session.py ou Alembic puisse l'utiliser
target_metadata = SQLModel.metadata