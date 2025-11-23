import React from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import Home from "./pages/user/Home";
import Carrito from "./pages/user/Carrito";
import RopaHombre from "./pages/user/RopaHombre";
import RopaMujer from "./pages/user/RopaMujer";
import RopaInfantil from "./pages/user/RopaInfantil";
import ProductDetail from "./pages/user/ProductDetail";
import Pago from "./pages/user/Pago";
<<<<<<< HEAD
import Confirmacion from "./pages/user/Confirmacion"; // ← IMPORTAR CONFIRMACIÓN
import Registro from "./pages/user/Registro";
import Login from "./pages/user/Login";
=======
import Registro from "./pages/user/Registro";
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
import MiCuenta from "./pages/user/MiCuenta";
import Blogs from "./pages/user/Blogs";
import Ayuda from './pages/user/Ayuda.jsx';
import Noticias from "./pages/user/Noticias";
import HomeAdmin from "./pages/admin/HomeAdmin.jsx";
<<<<<<< HEAD
import { useProducts } from './context/ProductContext';
=======
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9

function App() {
  const [carrito, setCarrito] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const location = useLocation();

<<<<<<< HEAD
  const { products, loading, error } = useProducts();
=======
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9

  React.useEffect(() => {
    const savedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCarrito);

    const savedUser = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const hideNavbarFooterPaths = ["/registro", "/admin", "/login"];
  const shouldHideNavbarFooter = hideNavbarFooterPaths.includes(location.pathname);
<<<<<<< HEAD
  
  const isAuthenticated = () => {
    return user !== null;
  };
  
  const isAdmin = () => {
    return user && (user.rol === 'admin' || user.rol?.nombreRol === 'admin');
=======
  const isAuthenticated = () => {
    return user !== null;
  };
  const isAdmin = () => {
    return user && user.rol === 'admin';
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
  };

  return (
    <div className="d-flex flex-column min-vh-100">
<<<<<<< HEAD
=======
      {/* Ocultar Navbar */}
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
      {!shouldHideNavbarFooter && (
        <Navbar carrito={carrito} user={user} setUser={setUser} />
      )}

      <main className="flex-grow-1">
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<Home />} />
          <Route path="/hombre" element={<RopaHombre />} />
          <Route path="/hombre/:subcategoria" element={<RopaHombre />} />
          <Route path="/mujer" element={<RopaMujer />} />
          <Route path="/mujer/:subcategoria" element={<RopaMujer />} />
          <Route path="/infantil" element={<RopaInfantil />} />
          <Route path="/infantil/:subcategoria" element={<RopaInfantil />} />
          
          <Route 
            path="/producto/:id" 
            element={<ProductDetail carrito={carrito} setCarrito={setCarrito} />} 
=======
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/hombre" element={<RopaHombre />} />
          <Route path="/mujer" element={<RopaMujer />} />
          <Route path="/infantil" element={<RopaInfantil />} />
          <Route 
            path="/producto/:id" 
            element={
              <ProductDetail carrito={carrito} setCarrito={setCarrito} />
            } 
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
          />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/noticias" element={<Noticias />} />
<<<<<<< HEAD
          <Route path="/registro" element={<Registro setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          
          {/* Rutas de compra */}
          <Route 
            path="/carrito" 
            element={<Carrito carrito={carrito} setCarrito={setCarrito} />} 
          />
          
          <Route 
            path="/pago" 
            element={
              carrito.length > 0 ? 
                <Pago carrito={carrito} setCarrito={setCarrito} /> : 
                <Navigate to="/carrito" replace /> 
            } 
          />

          {/* NUEVA RUTA: Confirmación de compra */}
          <Route path="/confirmacion" element={<Confirmacion />} />
          
=======
          <Route 
            path="/registro" 
            element={
              <Registro setUser={setUser} />
            } 
          />
          
          {/* Rutas que requieren autenticación */}
          <Route 
            path="/carrito" 
            element={
              isAuthenticated() ? 
                <Carrito carrito={carrito} setCarrito={setCarrito} /> : 
                <Navigate to="/registro" replace state={{ from: location }} />
            } 
          />
          <Route 
            path="/pago" 
            element={
              isAuthenticated() && carrito.length > 0 ? 
                <Pago carrito={carrito} setCarrito={setCarrito} /> : 
                carrito.length === 0 ? 
                  <Navigate to="/carrito" replace /> : 
                  <Navigate to="/registro" replace state={{ from: location }} />
            } 
          />
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
          <Route 
            path="/micuenta" 
            element={
              isAuthenticated() ? 
                <MiCuenta user={user} setUser={setUser} /> : 
                <Navigate to="/registro" replace state={{ from: location }} />
            } 
          />
          
<<<<<<< HEAD
=======
          {/* Ruta de admin */}
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
          <Route 
            path="/admin" 
            element={
              isAdmin() ? 
                <HomeAdmin /> : 
                <Navigate to="/" replace />
            } 
          />
          
<<<<<<< HEAD
=======
          {/* Ruta 404 - redirigir al home */}
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

<<<<<<< HEAD
=======
      {/* Ocultar footer*/}
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
      {!shouldHideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;