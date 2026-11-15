# Proyecto EFA — Frontend

Frontend de una tienda de ropa online (Proyecto EFA), construido con **React 19** y **Vite**. Incluye panel de usuario (catálogo, carrito, pago, cuenta) y panel de administración (gestión de productos/facciones), consumiendo una API REST propia mediante Axios.

## Tecnologías

- **React 19** + **React Router DOM 7** (rutas con *lazy loading*)
- **Vite 7** como bundler y servidor de desarrollo
- **Bootstrap 5** y **React Bootstrap** para estilos y componentes
- **Axios** para el consumo de la API
- **Karma + Jasmine + Testing Library** para pruebas unitarias
- **ESLint** para linting
- **nginx** como servidor de producción, con access log en JSON
- **nginx-prometheus-exporter** para las métricas del servidor web

---

## Observabilidad

El frontend participa de la misma cadena de observabilidad que el backend.

### Logs estructurados

El servidor de producción es **nginx** (no el servidor de Node de
desarrollo), configurado en [`nginx.conf`](nginx.conf) para emitir el access
log en JSON:

```json
{"@timestamp":"2026-11-10T21:20:57.963Z","service":"efa-frontend",
 "remote_addr":"10.0.0.12","request_method":"GET","request_uri":"/api/productos",
 "status":404,"body_bytes_sent":512,"request_time":"0.012",
 "http_x_correlation_id":"a7640f29f48743d4ad69e787149ba1e4"}
```

Grafana Alloy las recolecta y Loki las indexa por la etiqueta `service`, de
modo que los errores del frontend se consultan con los mismos filtros
estructurados que los del backend.

### Sondas y métricas

| Endpoint | Propósito | Consumidor |
|---|---|---|
| `/healthz` | Sonda de salud. Devuelve 200 sin depender de los assets. | Sondas `livenessProbe` y `readinessProbe` de Kubernetes; `HEALTHCHECK` del Dockerfile. |
| `/nginx_status` | Estado del servidor. | `nginx-prometheus-exporter`, que lo convierte en métricas Prometheus (peticiones por código, conexiones activas). |

En Kubernetes el pod lleva las anotaciones
`prometheus.io/scrape: "true"`, `prometheus.io/path: "/metrics"` y
`prometheus.io/port: "9113"`, de modo que el descubrimiento es automático.

### Correlación de extremo a extremo

El módulo [`src/services/observability.js`](src/services/observability.js)
instala un interceptor global de Axios que genera un identificador de
correlación por petición y lo envía en la cabecera `X-Correlation-Id`. El
backend lo reutiliza y lo escribe en el MDC, de modo que aparece en todas las
líneas de log de esa petición.

Con esto se resuelve el problema habitual de «el usuario reporta un error»:
el identificador permite pasar del síntoma en pantalla a la línea exacta del
log del backend, sin buscar por fecha y hora.

```javascript
// En la consola del navegador
[efa] GET /api/productos -> 500 { correlationId: 'a7640f29f48743d4ad69e787149ba1e4' }
```

```promql
// En Grafana > Explore > Loki
{service="efa-backend"} | json | traceId="a7640f29f48743d4ad69e787149ba1e4"
```

### Documentación relacionada

La documentación completa de la observabilidad del proyecto (stack,
dashboards, alertas y decisiones que habilitan) está en el repositorio del
backend: [`docs/OBSERVABILITY.md`](https://github.com/ealejandro23/backend-efa/blob/main/docs/OBSERVABILITY.md).

---

## Estructura del proyecto

El código sigue una organización tipo *atomic design*:

```
src/
├── components/
│   ├── atoms/         # Button, Input, Image, Text, etc.
│   ├── molecules/      # CardBody, DynamicForm, DynamicTable, NewsCard...
│   ├── organisms/       # Navbar, Footer, Modal, ProductCard, NewsList...
│   └── templates/        # Forms, Section
├── context/             # AuthContext, ProductContext
├── data/                 # Datos estáticos (links de navbar, productos, tablas)
├── pages/
│   ├── admin/            # HomeAdmin, Facciones
│   ├── auth/              # Login, Registro de usuario
│   └── user/               # Home, Productos, Carrito, Pago, Mi Cuenta, Blogs, etc.
├── routes/                # Configuración centralizada de rutas (config.jsx)
├── services/               # ApiService, ProductService, UserService, OrderService, VentaService
├── utils/                   # Utilidades (GenerarMensaje)
└── test/                     # Specs de componentes (Karma/Jasmine)
```

## Funcionalidades principales

- **Catálogo público**: home, listado de productos por categoría (hombre, mujer, infantil) con subcategorías, detalle de producto, blogs/noticias.
- **Autenticación**: login y creación de usuario, con contexto de sesión (`AuthContext`).
- **Carrito y pago**: flujo de carrito, confirmación y pago (`Carrito`, `Pago`, `Confirmacion`).
- **Cuenta de usuario**: sección "Mi Cuenta" y ayuda/contacto.
- **Panel administrador**: dashboard y gestión de "facciones" (categorías) de productos.
- **Ruta 404** personalizada para rutas no encontradas.

## Puesta en marcha

### Requisitos
- Node.js (versión compatible con Vite 7)
- npm

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build de producción

```bash
npm run build
npm run preview   # sirve el build localmente
```

### Tests

```bash
npm run test        # ejecuta los tests una vez
npm run test:watch  # modo watch
```

### Lint

```bash
npm run lint
```

## Despliegue

El proyecto incluye configuración (`vercel.json`) para despliegue en **Vercel**.

## Notas

- Los servicios (`src/services/`) centralizan la comunicación con el backend (Proyecto EFA API) vía Axios.
- Existen archivos con marcas de conflicto de merge sin resolver (por ejemplo `src/routes/config.jsx`), conviene revisarlos antes de tomar este código como base estable.