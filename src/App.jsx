import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { appRoutes } from './routes/config';

// Componentes de layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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

// 🔥 COMPONENTE PRINCIPAL SIN COMPLICACIONES
function App() {
  const [carrito, setCarrito] = useState([]);

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
                  // 🔥 CLONAR ELEMENTOS PARA PASAR PROPS
                  let element = route.element;

                  if (route.path === "/producto/:id") {
                    element = React.cloneElement(route.element, { carrito, setCarrito });
                  }

                  if (route.path === "/carrito") {
                    element = React.cloneElement(route.element, { carrito, setCarrito });
                  }

                  if (route.path === "/pago") {
                    const { user } = useAuth();
                    element = React.cloneElement(route.element, { carrito, setCarrito, user });
                  }

                  // 🔥 MANEJAR TIPOS DE RUTAS
                  if (route.private) {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <ProtectedRoute requireAdmin={route.admin}>
                            {element}
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
                            {element}
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
                      element={element}
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
