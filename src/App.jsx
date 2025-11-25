import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import { appRoutes } from "./routes/config";
import { useProducts } from "./context/ProductContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css";
import { Container, Spinner } from "react-bootstrap"; 

function App() {
  const [carrito, setCarrito] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = React.useState(false); 

  const location = useLocation();
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    const savedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // 🔥 CORREGIDO: Cargar usuario desde localStorage también
    const savedUser = JSON.parse(localStorage.getItem("user")) || 
                     JSON.parse(sessionStorage.getItem("usuarioActivo")) || 
                     null;

    setCarrito(savedCarrito);
    if (savedUser) {
      setUser(savedUser);
      console.log('✅ Usuario cargado al iniciar App:', savedUser);
    }
    
    setIsAuthLoaded(true); 
  }, []);

  React.useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // 🔥 NUEVO: Sincronizar automáticamente user con localStorage
  React.useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log('💾 Usuario guardado en localStorage:', user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const isAuthenticated = () => user !== null;
  const isAdmin = () =>
    user && (user.rol === "admin" || user.rol?.nombreRol === "admin");

  const navbarHidden = ["/admin"].includes(location.pathname);

  // 🔥 CORREGIDO: Función para manejar props específicas
  const getRouteElement = (route) => {
    const baseProps = { user, setUser };
    
    const routeSpecificProps = {};
    
    // 🔥 CORRECCIÓN: Incluir /producto/:id en las rutas que necesitan carrito
    if (route.path === "/carrito" || route.path === "/pago" || route.path === "/confirmacion" || route.path === "/producto/:id") {
      routeSpecificProps.carrito = carrito;
      routeSpecificProps.setCarrito = setCarrito;
    }
    
    // ProductDetail podría necesitar products (opcional)
    if (route.path === "/producto/:id") {
      routeSpecificProps.products = products;
    }
    
    // 🔥 IMPORTANTE: Auth y CreateUser necesitan setUser para actualizar estado global
    if (route.path === "/auth" || route.path === "/create-user") {
      routeSpecificProps.setUser = setUser;
    }
    
    // Para debugging
    console.log(`🛣️ Ruta ${route.path} - Props:`, { 
      hasUser: !!user, 
      hasSetUser: !!routeSpecificProps.setUser,
      hasCarrito: !!routeSpecificProps.carrito,
      hasProducts: !!routeSpecificProps.products
    });

    return React.cloneElement(route.element, {
      ...baseProps,
      ...routeSpecificProps
    });
  };

  if (!isAuthLoaded) {
    return (
      <Container className="text-center d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando sesión...</p>
      </Container>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">

      {!navbarHidden && <Navbar carrito={carrito} user={user} setUser={setUser} />}

      <main className="flex-grow-1">
        <Routes>
          {appRoutes.map((route, i) => {
            console.log(`🔍 Procesando ruta: ${route.path}`, { 
              isAdmin: route.isAdmin, 
              private: route.private 
            });

            if (route.isAdmin)
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={isAdmin() ? getRouteElement(route) : <Navigate to="/" replace />}
                />
              );

            if (route.private)
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    isAuthenticated()
                      ? getRouteElement(route)
                      : <Navigate to="/auth" replace state={{ from: location }} />
                  }
                />
              );

            // 🔥 RUTAS PÚBLICAS (incluyendo carrito)
            return (
              <Route
                key={i}
                path={route.path}
                element={getRouteElement(route)}
              />
            );
          })}
        </Routes>
      </main>

      {!navbarHidden && <Footer />}
    </div>
  );
}

export default App;
