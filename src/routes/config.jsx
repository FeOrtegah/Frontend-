import { lazy } from "react";

const Home = lazy(() => import("../pages/user/Home"));
const RopaHombre = lazy(() => import("../pages/user/RopaHombre"));
const RopaMujer = lazy(() => import("../pages/user/RopaMujer"));
const RopaInfantil = lazy(() => import("../pages/user/RopaInfantil"));
const ProductDetail = lazy(() => import("../pages/user/ProductDetail"));
const Carrito = lazy(() => import("../pages/user/Carrito"));
const Pago = lazy(() => import("../pages/user/Pago"));
const Confirmacion = lazy(() => import("../pages/user/Confirmacion"));
const MiCuenta = lazy(() => import("../pages/user/MiCuenta"));
const Blogs = lazy(() => import("../pages/user/Blogs"));
const Ayuda = lazy(() => import("../pages/user/Ayuda"));
const Noticias = lazy(() => import("../pages/user/Noticias"));
const HomeAdmin = lazy(() => import("../pages/admin/HomeAdmin"));


export const publicRoutes = [
  { path: "/", element: <Home />, showNavbar: true },
  { path: "/login", element: <Login />, showNavbar: false },
  { path: "/registro", element: <Registro />, showNavbar: false },
  { path: "/hombre", element: <RopaHombre />, showNavbar: true },
  { path: "/hombre/:subcategoria", element: <RopaHombre />, showNavbar: true },
  { path: "/mujer", element: <RopaMujer />, showNavbar: true },
  { path: "/mujer/:subcategoria", element: <RopaMujer />, showNavbar: true },
  { path: "/infantil", element: <RopaInfantil />, showNavbar: true },
  { path: "/infantil/:subcategoria", element: <RopaInfantil />, showNavbar: true },
  { path: "/producto/:id", element: <ProductDetail />, showNavbar: true },
  { path: "/blog", element: <Blogs />, showNavbar: true },
  { path: "/ayuda", element: <Ayuda />, showNavbar: true },
  { path: "/noticias", element: <Noticias />, showNavbar: true },
];

export const privateRoutes = [
  { path: "/carrito", element: <Carrito />, private: true, showNavbar: true },
  { path: "/pago", element: <Pago />, private: true, showNavbar: true },
  { path: "/confirmacion", element: <Confirmacion />, private: true, showNavbar: true },
  { path: "/micuenta", element: <MiCuenta />, private: true, showNavbar: true },
];

export const adminRoutes = [
  { path: "/admin", element: <HomeAdmin />, isAdmin: true, showNavbar: false },
];

export const notFoundRoute = {
  path: "*",
  element: <div className="text-center text-3xl py-10">404 - Página no encontrada</div>,
  showNavbar: false,
};

export const Approute = [
  ...publicRoutes,
  ...privateRoutes,
  ...adminRoutes,
  notFoundRoute,
];
