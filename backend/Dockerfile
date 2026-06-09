# 1. Image de base légère
FROM python:3.10-slim

# 2. Variables d’environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Dossier de travail
WORKDIR /app

# 4. Copier les dépendances AVANT le code (cache Docker)
COPY requirements.txt .

# 5. Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copier le code
COPY . .

# 7. Lancer l’application (PROD)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
