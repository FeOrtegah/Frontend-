# Proyecto EFA — Frontend

Frontend de una tienda de ropa online (Proyecto EFA), construido con **React 19** y **Vite**. Incluye panel de usuario (catálogo, carrito, pago, cuenta) y panel de administración (gestión de productos/facciones), consumiendo una API REST propia mediante Axios.

## Tecnologías

- **React 19** + **React Router DOM 7** (rutas con *lazy loading*)
- **Vite 7** como bundler y servidor de desarrollo
- **Bootstrap 5** y **React Bootstrap** para estilos y componentes
- **Axios** para el consumo de la API
- **Karma + Jasmine + Testing Library** para pruebas unitarias
- **ESLint** para linting

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