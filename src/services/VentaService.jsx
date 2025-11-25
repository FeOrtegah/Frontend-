import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1/ventas';

class VentaService {
    async crearVenta(ventaData) {
        try {
            const response = await axios.post(BASE_URL, ventaData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || 'Error al procesar la venta' 
            };
        }
    }

    async obtenerVentasPorUsuario(usuarioId) {
        try {
            const response = await axios.get(`${BASE_URL}/usuario/${usuarioId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: 'Error al obtener las ventas' };
        }
    }

    async obtenerVentaPorId(id) {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: 'Error al obtener la venta' };
        }
    }

    calcularTotalVenta(venta) {
        if (!venta) return 0;
        
        if (venta.total !== undefined && venta.total !== null) {
            return Number(venta.total);
        }
        
        if (venta.items && Array.isArray(venta.items) && venta.items.length > 0) {
            return venta.items.reduce((sum, item) => {
                const precio = item.precio || item.precioUnitario || 0;
                const cantidad = item.cantidad || 0;
                const subtotal = item.subtotal || (precio * cantidad);
                return sum + Number(subtotal);
            }, 0);
        }
        
        if (venta.productoVenta && Array.isArray(venta.productoVenta) && venta.productoVenta.length > 0) {
            return venta.productoVenta.reduce((sum, item) => {
                const precio = item.precio || item.precioUnitario || 0;
                const cantidad = item.cantidad || 0;
                const subtotal = item.subtotal || (precio * cantidad);
                return sum + Number(subtotal);
            }, 0);
        }

        if (venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0) {
            return venta.productos.reduce((sum, producto) => {
                const precio = producto.precio || producto.precioUnitario || 0;
                const cantidad = producto.cantidad || 0;
                const subtotal = producto.subtotal || (precio * cantidad);
                return sum + Number(subtotal);
            }, 0);
        }
        
        return 0;
    }

    calcularCantidadProductos(venta) {
        if (!venta) return 0;
        
        if (venta.items && Array.isArray(venta.items) && venta.items.length > 0) {
            return venta.items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
        }
        
        if (venta.productoVenta && Array.isArray(venta.productoVenta) && venta.productoVenta.length > 0) {
            return venta.productoVenta.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
        }

        if (venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0) {
            return venta.productos.reduce((sum, producto) => sum + (Number(producto.cantidad) || 0), 0);
        }
        
        return 0;
    }

    procesarVentas(ventas) {
        if (!ventas || !Array.isArray(ventas)) return [];
        
        const ventasProcesadas = ventas.map((venta) => {
            const totalCalculado = this.calcularTotalVenta(venta);
            const cantidadProductos = this.calcularCantidadProductos(venta);
            
            return {
                ...venta,
                totalCalculado: totalCalculado,
                cantidadProductos: cantidadProductos
            };
        });
        
        return ventasProcesadas;
    }
}

const ventaServiceInstance = new VentaService();

// Componentes de utilidad (Container, Card, Button, Alert, etc.)
const Container = ({ children, className }) => <div className={`p-4 mx-auto ${className || ''}`}>{children}</div>;
const Card = ({ children, className, ...props }) => <div className={`bg-white rounded-lg shadow-md ${className || ''}`} {...props}>{children}</div>;
Card.Header = ({ children, className }) => <div className={`p-4 border-b rounded-t-lg ${className || 'bg-gray-100 text-gray-700'}`}>{children}</div>;
Card.Body = ({ children, className }) => <div className={`p-4 ${className || ''}`}>{children}</div>;
const Button = ({ children, onClick, variant, size, className, disabled = false, type = 'button' }) => {
    let baseStyle = 'px-4 py-2 rounded-lg font-semibold transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
    if (variant === 'primary') baseStyle += ' bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
    if (variant === 'outline-danger') baseStyle += ' border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500';
    if (size === 'lg') baseStyle += ' text-lg';
    if (size === 'sm') baseStyle += ' text-sm py-1 px-2';
    return <button type={type} className={`${baseStyle} ${className || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
};
const Alert = ({ children, variant }) => <div className={`p-3 mb-4 rounded ${variant === 'danger' ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>{children}</div>;
const Spinner = () => <div className="animate-spin inline-block w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>;
const Row = ({ children, className, ...props }) => <div className={`flex flex-wrap ${className || ''}`} {...props}>{children}</div>;
const Col = ({ children, md, className }) => {
    let colClass = 'w-full';
    if (md) {
        if (md === 10) colClass = 'md:w-5/6';
        if (md === 6) colClass = 'md:w-1/2';
        if (md === 12) colClass = 'md:w-full';
    }
    return <div className={`px-2 mb-4 ${colClass} ${className || ''}`}>{children}</div>;
};
const Badge = ({ children, bg }) => {
    let bgClass = '';
    if (bg === 'secondary') bgClass = 'bg-gray-500 text-white';
    if (bg === 'danger') bgClass = 'bg-red-500 text-white';
    if (bg === 'success') bgClass = 'bg-green-500 text-white';
    if (bg === 'primary' || bg === 'info') bgClass = 'bg-blue-500 text-white';
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bgClass}`}>{children}</span>;
};
const Table = ({ children, striped, bordered, hover }) => {
    let tableClass = 'min-w-full divide-y divide-gray-200';
    if (striped) tableClass += ' [&>tbody>tr:nth-child(odd)]:bg-gray-50';
    if (bordered) tableClass += ' border border-gray-300';
    return <table className={tableClass}>{children}</table>;
};
Table.Thead = ({ children, className }) => <thead className={className}>{children}</thead>;
Table.Tbody = ({ children }) => <tbody>{children}</tbody>;

// Componente MiCuentaComponent
const MiCuentaComponent = ({ user, setUser, navigate }) => {
    const [ventas, setVentas] = useState([]);
    const [loadingVentas, setLoadingVentas] = useState(false);
    const [error, setError] = useState("");

    const formatClp = (value) => (value || 0).toLocaleString("es-CL");

    const obtenerTotalVenta = useCallback((venta) => venta.totalCalculado || 0, []);
    const obtenerCantidadProductos = useCallback((venta) => venta.cantidadProductos || 0, []);

    const cargarVentas = useCallback(async () => {
        // Aseguramos que los datos del usuario existan antes de llamar a la API
        if (!user?.id) return;
        
        setLoadingVentas(true);
        setError("");
        try {
            const resultado = await ventaServiceInstance.obtenerVentasPorUsuario(user.id);
            
            if (resultado.success) {
                const ventasProcesadas = ventaServiceInstance.procesarVentas(resultado.data);
                setVentas(ventasProcesadas);
            } else {
                setError(resultado.error || "Error al cargar las ventas desde el servidor.");
            }
        } catch (err) {
            setError("No se pudieron conectar con el servicio de ventas.");
        } finally {
            setLoadingVentas(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            // Se mantiene la redirección aquí para seguridad a nivel de componente
            navigate('/login');
        } else {
            cargarVentas();
        }
    }, [user, navigate, cargarVentas]);


    const cerrarSesion = () => {
        sessionStorage.removeItem("usuarioActivo");
        setUser(null);
        navigate('/'); // Redirige al home después de cerrar sesión
    };

    if (!user) {
        // Esto se activa si user es null (debido a la asincronía) antes de que AppWrapper lo redirija
        return (
            <Container className="my-5 text-center">
                <Spinner />
                <p className="mt-2 text-gray-600">Cargando datos de sesión...</p>
            </Container>
        );
    }
    
    // Extracción segura de datos para evitar errores de "undefined"
    const rolName = user.rol?.nombreRol || (typeof user.rol === 'string' ? user.rol : 'Cliente');
    const esAdmin = rolName.toLowerCase() === 'admin';

    return (
        <Container className="max-w-6xl my-5 font-sans">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Mi Cuenta</h2>
                <p className="text-gray-500">Gestiona tu información personal y revisa tu historial de compras</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="justify-center">
                <Col md={10} className="mx-auto">
                    <Card className="shadow-lg mb-6 border-t-4 border-blue-600">
                        <Card.Header className="bg-blue-600 text-white">
                            <h5 className="mb-0 text-xl font-semibold">Información Personal</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p className="mb-2"><strong>Nombre:</strong> {user.nombre || 'N/A'}</p>
                                    <p className="mb-2"><strong>Email:</strong> {user.correo || 'N/A'}</p>
                                    <p className="mb-2"><strong>ID de Usuario:</strong> <Badge bg="secondary">{user.id || 'N/A'}</Badge></p>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-2"><strong>Rol:</strong> 
                                        <Badge bg={esAdmin ? 'danger' : 'success'}>
                                            {rolName}
                                        </Badge>
                                    </p>
                                    <p className="mb-2"><strong>Fecha de Registro:</strong> 
                                        {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p className="mb-2"><strong>Total Compras:</strong> <Badge bg="info">{ventas.length}</Badge></p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-lg mb-6">
                        <Card.Header className="bg-gray-100">
                            <div className="flex justify-between items-center">
                                <h5 className="mb-0 text-lg font-semibold text-gray-700">Historial de Compras</h5>
                                <Badge bg="primary">{ventas.length} compras</Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {loadingVentas ? (
                                <div className="text-center py-8">
                                    <Spinner />
                                    <p className="text-gray-500 mt-2">Cargando tus compras...</p>
                                </div>
                            ) : ventas.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <Table striped bordered hover>
                                            <Table.Thead className="bg-gray-800 text-white">
                                                <tr>
                                                    <th className="p-3 text-left">N° Venta</th>
                                                    <th className="p-3 text-left">Fecha</th>
                                                    <th className="p-3 text-left">Estado</th>
                                                    <th className="p-3 text-left">Método Pago</th>
                                                    <th className="p-3 text-right">Productos</th>
                                                    <th className="p-3 text-right">Total</th>
                                                    <th className="p-3"></th>
                                                </tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {ventas.map((venta, index) => {
                                                    const total = obtenerTotalVenta(venta);
                                                    const cantidad = obtenerCantidadProductos(venta);

                                                    return (
                                                        <tr key={venta.id || index} className="border-b border-gray-200">
                                                            <td className="p-3">{venta.id || `VEN-${index + 1}`}</td>
                                                            <td className="p-3">{venta.fecha ? new Date(venta.fecha).toLocaleDateString() : "-"}</td>
                                                            <td className="p-3">
                                                                <Badge 
                                                                    bg={venta.estado?.nombre === "Completada" ? "success" : venta.estado?.nombre === "Cancelada" ? "danger" : "info"}
                                                                >
                                                                    {venta.estado?.nombre || "PENDIENTE"}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-3">{venta.metodoPago?.nombre || "No especificado"}</td>
                                                            <td className="p-3 text-right">{cantidad}</td>
                                                            <td className="p-3 text-right font-semibold text-green-600">{formatClp(total)}</td>
                                                            <td className="p-3">
                                                                <Button 
                                                                    size="sm"
                                                                    variant="primary"
                                                                    onClick={() => console.log('Ver detalles de venta:', venta.id)}
                                                                >
                                                                    Ver detalles
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </Table.Tbody>
                                        </Table>
                                    </div>

                                    <Row className="mt-4 justify-end">
                                        <Col md={6}>
                                            <Card className="bg-gray-50 border border-gray-300">
                                                <Card.Body>
                                                    <h6 className="font-bold text-lg mb-3 border-b pb-1 text-gray-700">Resumen de Compras</h6>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Total de compras:</span>
                                                        <strong className="text-gray-800">{ventas.length}</strong>
                                                    </div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-600">Total de productos comprados:</span>
                                                        <strong className="text-gray-800">
                                                            {ventas.reduce((t, v) => t + obtenerCantidadProductos(v), 0)}
                                                        </strong>
                                                    </div>
                                                    <div className="flex justify-between pt-3 border-t border-gray-300">
                                                        <span className="text-lg font-bold">Total gastado:</span>
                                                        <strong className="text-blue-600 text-xl font-extrabold">
                                                            {formatClp(ventas.reduce((t, v) => t + obtenerTotalVenta(v), 0))}
                                                        </strong>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <h5 className="text-gray-500 mb-4 text-xl">Aún no has realizado compras</h5>
                                    <Button variant="primary" size="lg" onClick={() => console.log('Simular navegación a /productos')}>
                                        Comenzar a Comprar
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <div className="text-center mt-6">
                        <Button variant="outline-danger" onClick={cerrarSesion}>
                            Cerrar Sesión
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

// Componente AppWrapper con lógica de enrutamiento corregida
const AppWrapper = () => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = sessionStorage.getItem("usuarioActivo");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            return null;
        }
    });

    // La ruta inicial siempre comienza en el home para evitar bucles al cargar
    const [currentRoute, setCurrentRoute] = useState('/'); 
    
    const navigate = useCallback((path, state = {}) => {
        setCurrentRoute(path);
    }, []);

    // Lógica de Redirección y Sincronización de Rutas
    useEffect(() => {
        const authRoutes = ['/login', '/registro'];
        
        // 1. Redirección de protección: Si no hay usuario y se accede a una ruta privada
        if (!user && currentRoute === '/micuenta') {
            navigate('/login');
            return;
        }
        
        // 2. Redirección de conveniencia: Si hay usuario y está en una ruta de autenticación
        // CORRECCIÓN: Si el usuario está logueado, lo mandamos a /micuenta si intenta ir a /login o /registro.
        if (user && authRoutes.includes(currentRoute)) {
            navigate('/micuenta');
            return;
        }

    }, [user, currentRoute, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Datos simulados (CORREGIDOS para asegurar que se muestren en MiCuentaComponent)
        const userData = { 
            id: '123456789',
            nombre: 'Juanito Pérez', 
            correo: 'juanito@tienda.cl', 
            rol: { id: 2, nombreRol: 'cliente' },
            fechaRegistro: '2023-10-01T10:00:00Z' // Aseguramos un formato de fecha válido
        };
        
        sessionStorage.setItem("usuarioActivo", JSON.stringify(userData));
        setUser(userData);
        navigate('/micuenta'); 
    };
    
    let componentToRender;

    // Lógica de Renderizado
    if (currentRoute === '/micuenta') {
        componentToRender = <MiCuentaComponent user={user} setUser={setUser} navigate={navigate} />;
    } else if (currentRoute === '/login' || currentRoute === '/registro') {
        componentToRender = (
            <Container className="text-center my-5 max-w-lg">
                <Card className="p-8 mx-auto shadow-xl">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800">{user ? "Sesión Activa" : currentRoute === '/login' ? "Iniciar Sesión" : "Registro de Usuario"}</h3>
                    {!user ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input 
                                type="email" 
                                placeholder="Correo" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required
                            />
                            {currentRoute === '/registro' && (
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                    required
                                />
                            )}
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                                required
                            />
                            <Button 
                                type="submit"
                                variant="primary" 
                                className="w-full"
                            >
                                {currentRoute === '/login' ? 'Ingresar' : 'Registrarse'} (Simulación)
                            </Button>
                            <p className="text-sm text-gray-500 mt-4">
                                {currentRoute === '/login' ? (
                                    <>¿No tienes cuenta? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/registro')}>Regístrate aquí</span></>
                                ) : (
                                    <>¿Ya tienes cuenta? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Inicia sesión</span></>
                                )}
                            </p>
                            <p className="text-sm text-gray-500 mt-4">Para probar, pulsa el botón. No se requiere llenar los campos.</p>
                        </form>
                    ) : (
                        <div className="mt-4">
                            <Alert variant="success">Ya has iniciado sesión como **{user.nombre}**</Alert>
                            <Button variant="primary" onClick={() => navigate('/micuenta')}>Ir a Mi Cuenta</Button>
                        </div>
                    )}
                </Card>
            </Container>
        );
    } else {
        // HOME PAGE (currentRoute === '/' o cualquier otra ruta no definida)
        componentToRender = (
            <Container className="text-center my-12">
                <h3 className="text-4xl font-extrabold mb-6 text-blue-600">Bienvenido a la Tienda EFA</h3>
                <p className="text-xl text-gray-600 mb-8">Esta es la página principal.</p>
                {user ? (
                    <Button variant="primary" size="lg" onClick={() => navigate('/micuenta')}>Ver Mi Cuenta</Button>
                ) : (
                    <Button variant="primary" size="lg" onClick={() => navigate('/login')}>Comenzar / Ingresar</Button>
                )}
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 antialiased">
            <header className="bg-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-10">
                <span className="font-extrabold text-2xl text-blue-600 cursor-pointer" onClick={() => navigate('/')}>EFA Store</span>
                <nav className="space-x-4 flex items-center">
                    {user && <span className="text-gray-700 font-medium hidden sm:inline">Hola, {user.nombre}!</span>}
                    <Button 
                        variant="primary" 
                        onClick={() => navigate(user ? '/micuenta' : '/login')}
                    >
                        {user ? 'Mi Cuenta' : 'Ingresar'}
                    </Button>
                </nav>
            </header>
            <main>{componentToRender}</main>
        </div>
    );
};

export default AppWrapper;
