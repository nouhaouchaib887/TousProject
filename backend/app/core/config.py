from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/albiruni_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_default_secret_key")  # Pour signer les tokens JWT
    FIRST_SUPERUSER_USERNAME: str = os.getenv("FIRST_SUPERUSER_USERNAME")
    FIRST_SUPERUSER_FIRSTNAME: str = os.getenv("FIRST_SUPERUSER_FIRSTNAME")
    FIRST_SUPERUSER_LASTNAME: str = os.getenv("FIRST_SUPERUSER_LASTNAME")
    FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD")
    ALGORITHM: str = "HS256"
    API_V1_STR: str = "/api/v1"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",  # <--- Ajoute cette ligne pour ignorer POSTGRES_USER, etc.
        case_sensitive=False
    )
    ENVIRONMENT: str = os.getenv('ENVIRONMENT',"development")



settings = Settings()
