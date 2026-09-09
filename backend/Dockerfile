# 1. Utiliser une image Python officielle légère comme base
FROM python:3.11-slim

# 2. Empêcher Python d'écrire des fichiers .pyc et forcer l'affichage direct des logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Définir le dossier de travail à l'intérieur du conteneur
WORKDIR /app

# 4. Copier d'abord le fichier des dépendances pour bénéficier du cache Docker
COPY requirements.txt /app/

# 5. Installer les dépendances Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copier tout le reste du code source dans le conteneur
COPY . /app/

# 7. Informer Docker que le conteneur écoutera sur le port 8000
EXPOSE 8000

# 8. Commande par défaut à exécuter quand le conteneur démarre
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]