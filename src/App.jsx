import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { appRoutes } from './routes/config';

// Componentes de layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// 🔥 COMPONENTE PARA RUTAS PROTEGIDAS
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user.rol?.id !== 1 && user.rol?.id !== 2) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 🔥 COMPONENTE PARA RUTAS PÚBLICAS (solo para no autenticados)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 🔥 COMPONENTE PARA MANEJAR LAS RUTAS DINÁMICAMENTE
const RouteHandler = () => {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error cargando carrito:', error);
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
    <Routes>
      {appRoutes.map((route, index) => {
        let element = route.element;

        // 🔥 Pasar props a componentes que las necesiten
        if (route.path === "/producto/:id") {
          element = React.cloneElement(route.element, { 
            carrito, 
            setCarrito 
          });
        }

        if (route.path === "/carrito") {
          element = React.cloneElement(route.element, { 
            carrito, 
            setCarrito 
          });
        }

        if (route.path === "/pago") {
          element = React.cloneElement(route.element, { 
            carrito, 
            setCarrito,
            user 
          });
        }

        // 🔥 MANEJO DE RUTAS PROTEGIDAS
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

        // 🔥 MANEJO DE RUTAS SOLO PÚBLICAS (como /auth)
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

        // 🔥 RUTAS PÚBLICAS NORMALES
        return (
          <Route
            key={index}
            path={route.path}
            element={element}
          />
        );
      })}
    </Routes>
  );
};

// 🔥 COMPONENTE PRINCIPAL
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Suspense fallback={<LoadingSpinner />}>
              <RouteHandler />
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
