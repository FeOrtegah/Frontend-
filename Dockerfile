# =============================================================================
# Dockerfile multietapa - Frontend del Proyecto EFA
#
# Etapa 1: construccion de la aplicacion React con Vite.
# Etapa 2: servicio de los archivos estaticos con nginx, configurado para
#          emitir logs estructurados y exponer las sondas de salud y estado.
#
# La imagen final no contiene Node ni el codigo fuente: solo nginx y los
# assets compilados. Esto reduce la superficie de ataque y el tamano final.
#
# El servidor escucha en el puerto 8080 y corre como el usuario "nginx"
# (uid 101), sin privilegios de root: para ello se cambia el puerto de
# escucha (un puerto por debajo de 1024 exigiria CAP_NET_BIND_SERVICE) y se
# preparan los directorios de trabajo con el propietario correcto.
# =============================================================================

# --- Etapa 1: build ----------------------------------------------------------
FROM node:22.14-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:8080/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Se copian primero los manifiestos para que la cache de Docker se reutilice
# mientras no cambien las dependencias.
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# --- Etapa 2: ejecucion -----------------------------------------------------
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="efa-frontend" \
      org.opencontainers.image.description="Frontend del Proyecto EFA servido con nginx y logs estructurados" \
      org.opencontainers.image.source="https://github.com/FeOrtegah/Frontend-"

# La configuracion de nginx se copia sobre la imagen base.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Se reemplazan los assets generados por Vite.
COPY --from=builder /app/dist /usr/share/nginx/html

# --- Preparacion para la ejecucion sin privilegios --------------------------
# nginx necesita escribir en estos directorios. Se los cambia de propietario
# para que el usuario "nginx" pueda operarlos sin ser root.
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && mkdir -p /var/cache/nginx /var/run \
 && chown -R nginx:nginx /var/cache/nginx /var/run \
 && touch /var/run/nginx.pid \
 && chown nginx:nginx /var/run/nginx.pid

# --- Healthcheck nativo -----------------------------------------------------
# El mismo endpoint que usan las sondas de Kubernetes.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

# --- Usuario sin privilegios -------------------------------------------------
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
