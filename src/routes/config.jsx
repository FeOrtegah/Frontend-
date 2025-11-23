import { lazy } from 'react';

// Lazy loading hace que cargue las páginas solo cuando se necesitan
const Home = lazy(() => import('../pages/user/Home'));
const Login = lazy(() => import('../pages/auth/login'));
const CreateUser = lazy(() => import('../pages/auth/create-user'));
const HomeAdmin = lazy(() => import('../pages/admin/HomeAdmin'));
const HomeFacciones = lazy(() => import('../pages/admin/Facciones/HomeFacciones'));
const RopaHombre = lazy(() => import('../pages/user/RopaHombre')); // ← Agregar esta línea
const RopaMujer = lazy(() => import('../pages/user/RopaMujer'));   // ← Agregar esta línea
const RopaInfantil = lazy(() => import('../pages/user/RopaInfantil')); // ← Agregar esta línea

// Rutas públicas o del usuario, así están mejor organizadas
const publicRoutes = [
  { path: '/', element: <Home />, showNavbar: true },
  { path: '/login', element: <Login />, showNavbar: false },
  { path: '/create-user', element: <CreateUser />, showNavbar: false },
  // Agregar rutas de categorías
  { path: '/hombre', element: <RopaHombre />, showNavbar: true },
  { path: '/hombre/:subcategoria', element: <RopaHombre />, showNavbar: true }, // ← Subcategorías
  { path: '/mujer', element: <RopaMujer />, showNavbar: true },
  { path: '/mujer/:subcategoria', element: <RopaMujer />, showNavbar: true },
  { path: '/infantil', element: <RopaInfantil />, showNavbar: true },
  { path: '/infantil/:subcategoria', element: <RopaInfantil />, showNavbar: true },
];

// Rutas del administrador 
const adminRoutes = [
  { path: '/admin/dashboard', element: <HomeAdmin />, isAdmin: true },
  { path: '/admin/facciones', element: <HomeFacciones />, isAdmin: true },
];

// Ruta 404 por ahora no hice una página específica, solo un div simple
const notFoundRoute = {
  path: '*',
  element: <div className="text-center py-10 text-2xl">404 - Página no encontrada u.u</div>,
  showNavbar: false,
};

// Exportar todas las rutas en un solo arreglo, hell yeah
export const appRoutes = [...publicRoutes, ...adminRoutes, notFoundRoute];