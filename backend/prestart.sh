#!/bin/bash
echo "Vérification de la connexion à la base de données..."
# On attend que la DB réponde
python -c "
import socket
import time
import os

db_host = 'db'
db_port = 5432

while True:
    try:
        with socket.create_connection((db_host, db_port), timeout=1):
            print('Base de données prête !')
            break
    except OSError:
        print('La base de données est indisponible, on attend 1 seconde...')
        time.sleep(1)
"
echo "Lancement des migrations et de l'app..."