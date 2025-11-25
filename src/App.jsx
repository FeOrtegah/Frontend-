import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import { appRoutes } from "./routes/config";
import { useProducts } from "./context/ProductContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css";
import { Container, Spinner } from "react-bootstrap"; // Importado para el loading

function App() {
  const [carrito, setCarrito] = React.useState([]);
  const [user, setUser] = React.useState(null);
  // Nuevo estado: Indica si ya terminamos de revisar sessionStorage
  const [isAuthLoaded, setIsAuthLoaded] = React.useState(false); 

  const location = useLocation();
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    const savedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const savedUser = JSON.parse(sessionStorage.getItem("usuarioActivo"));

    setCarrito(savedCarrito);
    if (savedUser) setUser(savedUser);
    
    // Una vez que hemos revisado sessionStorage, marcamos la carga como completa
    setIsAuthLoaded(true); 
  }, []);

  React.useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const isAuthenticated = () => user !== null;
  const isAdmin = () =>
    user && (user.rol === "admin" || user.rol?.nombreRol === "admin");

  const navbarHidden = ["/admin"].includes(location.pathname);

  // 🔴 AGREGAR ESTE BLOQUE: Mostrar spinner mientras se carga la autenticación inicial
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

      {/* SE AGREGA user y setUser AL NAVBAR  */}
      {!navbarHidden && <Navbar carrito={carrito} user={user} setUser={setUser} />}

      <main className="flex-grow-1">
        <Routes>
          {appRoutes.map((route, i) => {
            if (route.isAdmin)
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={isAdmin() ? route.element : <Navigate to="/" replace />}
                />
              );

            if (route.private)
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    isAuthenticated()
                      ? React.cloneElement(route.element, {
                          carrito,
                          setCarrito,
                          user,
                          setUser,
                        })
                      : <Navigate to="/auth" replace state={{ from: location }} />
                      /* IMPORTANTE: Redirigimos a /auth (la ruta de login) 
                        en lugar de / para que el usuario pueda iniciar sesión
                      */
                  }
                />
              );

            return (
              <Route
                key={i}
                path={route.path}
                element={React.cloneElement(route.element, {
                  carrito,
                  setCarrito,
                  user,
                  setUser,
                })}
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
