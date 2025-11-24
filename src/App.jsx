import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import { appRoutes } from "./routes/appRoutes";
import ProtectedRoute from "./routes/ProtectedRoute"; 
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Ocultar navbar/footer en estas rutas
  const hideNavbarFooter = ["/login", "/create-user"].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">

      {!hideNavbarFooter && <Navbar />}

      <main className="flex-grow-1">
        <Suspense fallback={<div className="text-center py-10 text-white">Cargando...</div>}>
          <Routes>

            {appRoutes.map((route, index) => {
              if (route.isAdmin) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <ProtectedRoute adminOnly>
                        {route.element}
                      </ProtectedRoute>
                    }
                  />
                );
              }
              return <Route key={index} path={route.path} element={route.element} />;
            })}

          </Routes>
        </Suspense>
      </main>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
