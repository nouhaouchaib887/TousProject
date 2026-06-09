import smtplib
from email.message import EmailMessage
from app.core.config import settings # Vos variables d'environnement

def send_reset_password_email(email_to: str, token: str):
    # 1. Construction du lien (URL de votre Frontend)

    link = f"{settings.FRONTEND_HOST}/reset-password?token={token}"

    # 2. Création du contenu
    message = EmailMessage()
    message["Subject"] = "Albiruni - Réinitialisation de votre mot de passe"
    message["From"] = settings.EMAILS_FROM_EMAIL
    message["To"] = email_to
    
    # Version texte simple (et vous pouvez ajouter du HTML)
    message.set_content(f"""
    Bonjour,
    
    Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Albiruni.
    Veuillez cliquer sur le lien ci-dessous (valable 30 minutes) :
    
    {link}
    
    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
    """)

    # 3. Envoi via le serveur SMTP
    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(message)