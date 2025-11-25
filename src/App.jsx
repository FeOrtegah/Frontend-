import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { appRoutes } from './routes/config';
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";

// 🔥 COMPONENTE SIMPLE PARA RUTAS PROTEGIDAS
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user.rol?.id !== 1 && user.rol?.id !== 2) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 🔥 COMPONENTE SIMPLE PARA RUTAS PÚBLICAS
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 🔥 COMPONENTE PARA RUTAS CON CARRITO
const CarritoRoute = ({ children, carrito, setCarrito }) => {
  return React.cloneElement(children, { carrito, setCarrito });
};

// 🔥 COMPONENTE PARA RUTAS CON PAGO
const PagoRoute = ({ children, carrito, setCarrito }) => {
  const { user } = useAuth();
  return React.cloneElement(children, { carrito, setCarrito, user });
};

// 🔥 COMPONENTE PRINCIPAL SIN COMPLICACIONES
function App() {
  const [carrito, setCarrito] = useState([]);
  const { user } = useAuth(); // 🔥 MOVER useAuth AQUÍ

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        localStorage.removeItem('carrito');
      }
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      localStorage.removeItem('carrito');
    }
  }, [carrito]);

  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Suspense fallback={<div className="text-center py-5">Cargando...</div>}>
              <Routes>
                {appRoutes.map((route, index) => {
                  // 🔥 MANEJAR TIPOS DE RUTAS
                  if (route.private) {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <ProtectedRoute requireAdmin={route.admin}>
                            {route.path === "/pago" ? (
                              <PagoRoute carrito={carrito} setCarrito={setCarrito}>
                                {route.element}
                              </PagoRoute>
                            ) : route.path === "/carrito" ? (
                              <CarritoRoute carrito={carrito} setCarrito={setCarrito}>
                                {route.element}
                              </CarritoRoute>
                            ) : (
                              route.element
                            )}
                          </ProtectedRoute>
                        }
                      />
                    );
                  }

                  if (route.onlyPublic) {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <PublicRoute>
                            {route.element}
                          </PublicRoute>
                        }
                      />
                    );
                  }

                  // Ruta pública normal
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        route.path === "/producto/:id" || route.path === "/carrito" ? (
                          <CarritoRoute carrito={carrito} setCarrito={setCarrito}>
                            {route.element}
                          </CarritoRoute>
                        ) : (
                          route.element
                        )
                      }
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
