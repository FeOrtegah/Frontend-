import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { appRoutes } from './routes/config';
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";

// 🔥 COMPONENTE SIMPLIFICADO PARA RUTAS
const RouteHandler = ({ route, carrito, setCarrito }) => {
  const { user } = useAuth();

  // Verificar autenticación para rutas privadas
  if (route.private && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar admin para rutas de admin
  if (route.admin && (!user || (user.rol?.id !== 1 && user.rol?.id !== 2))) {
    return <Navigate to="/" replace />;
  }

  // Verificar rutas solo públicas (onlyPublic)
  if (route.onlyPublic && user) {
    return <Navigate to="/" replace />;
  }

  // Pasar props según el tipo de ruta
  let element = route.element;

  if (route.path === "/producto/:id" || route.path === "/carrito") {
    element = React.cloneElement(route.element, { carrito, setCarrito });
  }

  if (route.path === "/pago") {
    element = React.cloneElement(route.element, { carrito, setCarrito, user });
  }

  if (route.path === "/micuenta") {
    element = React.cloneElement(route.element, { user });
  }

  return element;
};

// 🔥 COMPONENTE DE CARGA
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
    <p className="mt-2">Cargando...</p>
  </div>
);

// 🔥 COMPONENTE PRINCIPAL
function App() {
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
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {appRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <RouteHandler 
                        route={route} 
                        carrito={carrito} 
                        setCarrito={setCarrito} 
                      />
                    }
                  />
                ))}
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
