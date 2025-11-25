// routes/config.js
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
const Auth = lazy(() => import("../pages/auth/Auth"));

export const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/hombre", element: <RopaHombre /> },
  { path: "/hombre/:subcategoria", element: <RopaHombre /> },
  { path: "/mujer", element: <RopaMujer /> },
  { path: "/mujer/:subcategoria", element: <RopaMujer /> },
  { path: "/infantil", element: <RopaInfantil /> },
  { path: "/infantil/:subcategoria", element: <RopaInfantil /> },
  { path: "/producto/:id", element: <ProductDetail /> },
  { path: "/blog", element: <Blogs /> },
  { path: "/ayuda", element: <Ayuda /> },
  { path: "/noticias", element: <Noticias /> },
  { path: "/auth", element: <Auth /> },
  { path: "/carrito", element: <Carrito /> },
  { path: "/pago", element: <Pago />, private: true },
  { path: "/confirmacion", element: <Confirmacion />, private: true },
  { path: "/micuenta", element: <MiCuenta />, private: true },
  { path: "/admin", element: <HomeAdmin />, isAdmin: true },
  { path: "*", element: <div className="text-center text-3xl py-10">404 - Página no encontrada</div> },
];
