from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.db.session import init_db, engine
from app.db.init_data import init_initial_data
from sqlmodel import Session

app = FastAPI(
    title="My Modular Login App",
    description="Application de logging avec FastAPI, SQLModel et PostgreSQL",
    version="1.0.0"
)

# 1. CONFIGURATION DU CORS (Crucial pour ton Frontend)
# Sans cela, ton fichier index.html ne pourra pas parler à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En production, on remplace par l'URL du site
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. ACTIONS AU DÉMARRAGE (Startup)
@app.on_event("startup")
def on_startup():
    print("Démarrage du serveur...")
    # Crée les tables si elles n'existent pas
    init_db()
    
    # Remplit la base avec l'Admin et les Roles de test
    with Session(engine) as session:
        init_initial_data(session)
    print("Base de données initialisée !")

# 3. INCLUSION DES ROUTES
# On lie toutes les routes du dossier api/v1 avec un préfixe
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "Online", "docs": "/docs"}