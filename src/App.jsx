import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";

import { appRoutes } from "./config/Config";
import { useProducts } from "./context/ProductContext";

function App() {
  const [carrito, setCarrito] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const location = useLocation();
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    const savedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const savedUser = JSON.parse(sessionStorage.getItem("usuarioActivo"));

    setCarrito(savedCarrito);
    if (savedUser) setUser(savedUser);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const isAuthenticated = () => user !== null;

  const isAdmin = () =>
    user && (user.rol === "admin" || user.rol?.nombreRol === "admin");
  
  const navbarHidden = ["/login", "/registro", "/admin"].includes(
    location.pathname
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {!navbarHidden && (
        <Navbar carrito={carrito} user={user} setUser={setUser} />
      )}

      <main className="flex-grow-1">
        <Routes>
          {appRoutes.map((route, i) => {
            // ADMIN
            if (route.isAdmin)
              return (
                <Route
                  key={i}
                  path={route.path}
                  element={
                    isAdmin() ? route.element : <Navigate to="/" replace />
                  }
                />
              );

            // PRIVADAS
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
                      : (
                        <Navigate
                          to="/login"
                          replace
                          state={{ from: location }}
                        />
                      )
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
