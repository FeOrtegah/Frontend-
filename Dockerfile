# Etapa 1: build de la app con Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Permite inyectar la URL del backend en tiempo de build
ARG VITE_API_BASE_URL=http://localhost:8080/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir el build estático
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 8081
CMD ["serve", "-s", "dist", "-l", "8081"]