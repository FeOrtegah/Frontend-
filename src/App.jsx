import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Container, Spinner, Alert, Form, Button, Card } from "react-bootstrap"; 
// NOTA: Se mantienen las versiones MOCK de componentes no centrales para que el archivo compile.

// ---------------------------------------------------------------------
// MOCKS Y COMPONENTES FUNCIONALES
// ---------------------------------------------------------------------

// URL base de la API (Asumiendo que el frontend se conecta al backend en el mismo host o a través de proxy)
const API_BASE_URL = "/api/v1/usuarios"; 

// 1. Componente de Página: Home Mock
const Home = ({ user }) => (
  <Container className="py-5 text-center">
    <h2>Inicio Mock</h2>
    <p>Bienvenido, {user?.nombre || 'Invitado'}.</p>
    <p>Navega a Mi Cuenta para ver la ruta privada funcionando.</p>
  </Container>
);

// 2. Componente de Página: Auth (Implementación Funcional de Login)
const Auth = ({ setUser }) => {
  const [correo, setCorreo] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  // Nota: location ya no es necesaria aquí ya que la redirección la maneja el padre.

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Implementación de Backoff exponencial para la llamada a la API
    const maxRetries = 3;
    let attempt = 0;

    const executeFetch = async () => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        const data = await response.json();

        if (response.ok) {
            const { token, usuario } = data;
            
            if (usuario && usuario.contrasena) {
                delete usuario.contrasena; 
            }

            sessionStorage.setItem("jwtToken", token);
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
            setUser(usuario);
        } else {
            // Error de autenticación
            throw new Error(data.msg || "Credenciales inválidas o error desconocido.");
        }
    };
    
    while (attempt < maxRetries) {
        try {
            await executeFetch();
            // Si tiene éxito, salir del bucle
            break; 
        } catch (e) {
            if (attempt === maxRetries - 1) {
                // Si es el último intento, establecer el error visible
                setError(e.message.includes("Credenciales") ? e.message : "Error de conexión con el servidor. Inténtalo de nuevo.");
            }
            attempt++;
            if (e.message.includes("Credenciales") || attempt >= maxRetries) {
                // No reintentar en caso de error de credenciales o si es el último intento
                break;
            }
            // Esperar con backoff exponencial: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        }
    }

    setIsLoading(false);
  };

  // Simulación de Login para pruebas sin Backend
  const simularLogin = () => {
    setUser({ id: 'user-123', nombre: 'Test User', correo: 'test@example.com', rol: 'cliente' });
    sessionStorage.setItem("usuarioActivo", JSON.stringify({ id: 'user-123', nombre: 'Test User', correo: 'test@example.com', rol: 'cliente' }));
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card style={{ width: '24rem' }} className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" className="me-2" /> : 'Acceder'}
            </Button>
          </Form>

          <hr className="my-3"/>
          <div className="text-center">
             <Button variant="outline-secondary" size="sm" onClick={simularLogin}>
                Simular Login (Si API no está disponible)
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

// 3. Componente de Página: MiCuenta (Funcionalidad de Logout)
const MiCuenta = ({ user, setUser }) => (
    <Container className="my-5">
      <div className="text-center mb-4 p-4 border rounded shadow-sm bg-light">
        <h2>Mi Cuenta Mock</h2>
        <p className="text-muted">Esta es la vista privada.</p>
        <p>Usuario ID: <strong>{user?.id || 'N/A'}</strong></p>
        <p>Rol: <strong>{user?.rol || 'Cliente'}</strong></p>
        
        <button className="btn btn-outline-danger mt-3" onClick={() => {
            sessionStorage.removeItem("usuarioActivo");
            sessionStorage.removeItem("jwtToken"); // Limpiar el token también
            setUser(null);
        }}>
            Cerrar Sesión
        </button>
      </div>
    </Container>
);

// 4. Mock de Contexto
const useProducts = () => ({ products: [], loading: false, error: null });

// 5. Mocks de Componentes de Layout
const Navbar = ({ carrito, user, setUser }) => (
  <header className="bg-light shadow-sm">
    <Container className="d-flex justify-content-between align-items-center py-3">
      <h4 className="mb-0 text-primary">E-Commerce Mock</h4>
      <div className="d-flex align-items-center">
        <span className="me-3 text-secondary">
          Carrito ({carrito.length})
        </span>
        {user ? (
          <span className="text-success me-3">Hola, {user.nombre}</span>
        ) : (
          <span className="text-muted me-3">No logueado</span>
        )}
      </div>
    </Container>
  </header>
);

const Footer = () => (
  <footer className="bg-dark text-white-50 text-center py-3 mt-auto">
    <Container>
      <small>&copy; 2024 E-Commerce Mock. Derechos Reservados.</small>
    </Container>
  </footer>
);

// 6. Mocks de Rutas (basado en routes/config)
export const appRoutes = [
  { path: "/", element: <Home />, showNavbar: true },
  { path: "/auth", element: <Auth />, showNavbar: false },
  { path: "/micuenta", element: <MiCuenta />, private: true, showNavbar: true }, 
  { path: "/admin", element: <Home />, isAdmin: true, showNavbar: false }, 
  // Ejemplos para testear la nueva lógica de getRouteElement
  { path: "/carrito", element: <Home />, needsCarrito: true, showNavbar: true }, 
  { path: "/producto/:id", element: <Home />, showNavbar: true }, 
  { path: "*", element: <div className="text-center text-3xl py-10">404 - Página no encontrada</div>, showNavbar: false },
];
// ---------------------------------------------------------------------

function App() {
  const [carrito, setCarrito] = React.useState([]);
  const [user, setUser] = React.useState(null);
  // Nuevo estado: Indica si ya terminamos de revisar sessionStorage
  const [isAuthLoaded, setIsAuthLoaded] = React.useState(false); 

  const location = useLocation();
  const { products, loading, error } = useProducts(); 

  // 1. Carga Inicial de la Sesión
  React.useEffect(() => {
    let savedUser = null;
    try {
      const savedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
      savedUser = JSON.parse(sessionStorage.getItem("usuarioActivo"));
      setCarrito(savedCarrito);
    } catch (e) {
      console.error("Error al leer storage:", e);
    }

    if (savedUser && savedUser.id) {
        // Aseguramos que el usuario cargado no tenga contraseña visible
        if (savedUser.contrasena) delete savedUser.contrasena;
        setUser(savedUser);
    }
    
    // Marcar la carga como completa SÓLO después de revisar la sesión
    setIsAuthLoaded(true); 
  }, []);

  // 2. Persistencia del Carrito
  React.useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);
  
  // 3. Persistencia de la Sesión (Se ejecuta después de login/logout en Auth/MiCuenta)
  React.useEffect(() => {
    if (user && user.id) {
      sessionStorage.setItem("usuarioActivo", JSON.stringify(user));
    } else if (isAuthLoaded) {
      // Solo limpiamos si ya cargó y el user es null (logout)
      sessionStorage.removeItem("usuarioActivo");
      sessionStorage.removeItem("jwtToken"); 
    }
  }, [user, isAuthLoaded]);


  const isAuthenticated = () => user !== null && user.id;
  const isAdmin = () =>
    user && (user.rol?.toLowerCase() === "admin" || user.rol?.nombreRol?.toLowerCase() === "admin");

  const navbarHidden = ["/admin"].includes(location.pathname);

  // NUEVA FUNCIÓN: Determina qué props pasar a cada elemento de ruta
  const getRouteElement = (route) => {
    // Props base (disponibles para todas las rutas)
    const baseProps = { user, setUser };
    
    const routeSpecificProps = {};
    
    // 1. Rutas que necesitan el carrito/setCarrito (Carrito, Pago)
    if (route.path === "/carrito" || route.path === "/pago") {
      routeSpecificProps.carrito = carrito;
      routeSpecificProps.setCarrito = setCarrito;
    }
    
    // 2. Ruta de Detalle de Producto (necesita el listado de productos)
    if (route.path === "/producto/:id") {
      // Nota: Aquí se usa products, que viene de useProducts.
      routeSpecificProps.products = products; 
    }
    
    // 3. Rutas que se marcan explícitamente con needsCarrito (si es el caso)
    if (route.needsCarrito) {
      routeSpecificProps.carrito = carrito;
      routeSpecificProps.setCarrito = setCarrito;
    }
    
    // Clonar el elemento de ruta y añadir las props combinadas
    return React.cloneElement(route.element, {
      ...baseProps,
      ...routeSpecificProps
    });
  };


  // Mostrar spinner mientras se carga la autenticación inicial
  if (!isAuthLoaded) {
    return (
      <Container className="text-center d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Verificando sesión...</p>
      </Container>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Navbar sigue recibiendo las props que necesita para su renderizado (carrito, user, setUser) */}
      {!navbarHidden && <Navbar carrito={carrito} user={user} setUser={setUser} />}

      <main className="flex-grow-1">
        <Routes>
          {appRoutes.map((route, i) => {
            if (route.isAdmin)
              return (
                <Route
                  key={i}
                  path={route.path}
                  // Usamos getRouteElement para pasar las props correctas al componente
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
                      ? getRouteElement(route) // Usamos getRouteElement aquí también
                      : <Navigate to="/auth" replace state={{ from: location }} />
                  }
                />
              );

            return (
              <Route
                key={i}
                path={route.path}
                // Usamos getRouteElement para pasar las props correctas al componente
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
