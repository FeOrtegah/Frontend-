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

  const getRouteElement = (route) => {
    const baseProps = { user, setUser };
    
    const routeSpecificProps = {};
    
    if (route.path === "/carrito" || route.path === "/pago" || route.path === "/confirmacion" || route.path === "/producto/:id") {
      routeSpecificProps.carrito = carrito;
      routeSpecificProps.setCarrito = setCarrito;
    }
    
    if (route.path === "/auth") {
      routeSpecificProps.setUser = setUser;
    }
    
    console.log(`🛣️ Ruta ${route.path} - User:`, user);

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
              private: route.private,
              user: user 
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
