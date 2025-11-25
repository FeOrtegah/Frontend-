
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
  { path: "/", element: <Home />, public: true },
  { path: "/hombre", element: <RopaHombre />, public: true },
  { path: "/hombre/:subcategoria", element: <RopaHombre />, public: true },
  { path: "/mujer", element: <RopaMujer />, public: true },
  { path: "/mujer/:subcategoria", element: <RopaMujer />, public: true },
  { path: "/infantil", element: <RopaInfantil />, public: true },
  { path: "/infantil/:subcategoria", element: <RopaInfantil />, public: true },
  { path: "/producto/:id", element: <ProductDetail />, public: true },
  { path: "/blog", element: <Blogs />, public: true },
  { path: "/ayuda", element: <Ayuda />, public: true },
  { path: "/noticias", element: <Noticias />, public: true },
  { path: "/auth", element: <Auth />, public: true, onlyPublic: true },
  { path: "/carrito", element: <Carrito />, private: true },
  { path: "/pago", element: <Pago />, private: true },
  { path: "/confirmacion", element: <Confirmacion />, private: true },
  { path: "/micuenta", element: <MiCuenta />, private: true },
  { path: "/admin", element: <HomeAdmin />, private: true, admin: true },
  { path: "/admin/*", element: <HomeAdmin />, private: true, admin: true },
  { path: "*", element: <div className="text-center text-3xl py-10">404 - Página no encontrada</div>, public: true },
];
