# --- Étape 1 : Build de l'application React avec Node 20 ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build
COPY . .

# Variable d'environnement pour l'API
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Étape 2 : Serveur Nginx léger ---
FROM nginx:alpine

# Copie des fichiers compilés depuis l'étape 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]