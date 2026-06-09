# Étape 1 : Build de l'application React
FROM node:20-alpine AS build-stage

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code et build
COPY . .
RUN npm run build

# Étape 2 : Serveur de production Nginx
FROM nginx:stable-alpine AS production-stage

# Copie des fichiers compilés depuis l'étape 1 vers Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]