# Utiliser l'image officielle Node.js comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers et dossiers du projet dans le répertoire de travail du conteneur
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 4000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
