import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { 
  Container, Card, Button, Alert, Spinner, Row, Col, Badge, Table 
} from "react-bootstrap";
import VentaService from "../../services/VentaService";

const MiCuenta = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/registro');
    } else {
      cargarVentas();
    }
  }, [user, navigate]);

  const cargarVentas = async () => {
    if (!user?.id) return;
    
    setLoadingVentas(true);
    setError("");
    try {
      console.log('🔄 Iniciando carga de ventas para usuario:', user.id);
      const resultado = await VentaService.obtenerVentasPorUsuario(user.id);
      
      if (resultado.success) {
        console.log('📦 Ventas crudas del backend:', resultado.data);
        
        // ✅ DEBUG DETALLADO: Ver estructura completa
        if (resultado.data && resultado.data.length > 0) {
          console.log('🐛 DEBUG - Estructura COMPLETA de ventas:');
          resultado.data.forEach((venta, index) => {
            console.log(`\n--- Venta ${index + 1} ---`);
            console.log('ID:', venta.id);
            console.log('Número Venta:', venta.numeroVenta);
            console.log('Total directo:', venta.total);
            console.log('Estado:', venta.estado);
            console.log('Método Pago:', venta.metodoPago);
            console.log('Items:', venta.items);
            console.log('ProductoVenta:', venta.productoVenta);
            console.log('Productos:', venta.productos);
            console.log('TODOS los campos:', Object.keys(venta));
            console.log('Estructura COMPLETA:', JSON.stringify(venta, null, 2));
          });
        }
        
        // ✅ PROCESAR VENTAS CON ESTRATEGIA MEJORADA
        const ventasProcesadas = resultado.data.map((venta, index) => {
          console.log(`\n🔍 Procesando venta ${index + 1}: ${venta.numeroVenta}`);
          
          // ESTRATEGIA 1: Usar total directo si existe
          let totalCalculado = venta.total || 0;
          let cantidadProductos = 0;
          
          // ESTRATEGIA 2: Buscar productos en diferentes estructuras
          if (venta.items && Array.isArray(venta.items) && venta.items.length > 0) {
            console.log('✅ Encontrados items:', venta.items);
            totalCalculado = venta.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
            cantidadProductos = venta.items.reduce((sum, item) => sum + (item.cantidad || 0), 0);
          } 
          else if (venta.productoVenta && Array.isArray(venta.productoVenta) && venta.productoVenta.length > 0) {
            console.log('✅ Encontrados productoVenta:', venta.productoVenta);
            totalCalculado = venta.productoVenta.reduce((sum, item) => sum + (item.subtotal || 0), 0);
            cantidadProductos = venta.productoVenta.reduce((sum, item) => sum + (item.cantidad || 0), 0);
          }
          else if (venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0) {
            console.log('✅ Encontrados productos:', venta.productos);
            totalCalculado = venta.productos.reduce((sum, producto) => sum + (producto.subtotal || 0), 0);
            cantidadProductos = venta.productos.reduce((sum, producto) => sum + (producto.cantidad || 0), 0);
          }
          else {
            console.log('❌ No se encontraron productos en ninguna estructura conocida');
            console.log('Estructura disponible:', Object.keys(venta));
          }
          
          console.log(`📊 Resultado: Total = $${totalCalculado}, Productos = ${cantidadProductos}`);
          
          return {
            ...venta,
            totalCalculado: totalCalculado,
            cantidadProductos: cantidadProductos
          };
        });
        
        console.log('🎉 Ventas procesadas FINALES:', ventasProcesadas);
        setVentas(ventasProcesadas);
      } else {
        setError("Error al cargar las ventas");
      }
    } catch (error) {
      console.error('Error cargando ventas:', error);
      setError("No se pudieron cargar las ventas");
    } finally {
      setLoadingVentas(false);
    }
  };

  // Función para obtener el total
  const obtenerTotalVenta = (venta) => {
    return venta.totalCalculado || 0;
  };

  // Función para obtener cantidad de productos
  const obtenerCantidadProductos = (venta) => {
    return venta.cantidadProductos || 0;
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioActivo");
    setUser(null);
    navigate('/');
  };

  if (!user) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Redirigiendo...</p>
=======
import { Container, Card, Button, Alert, Spinner, Modal } from "react-bootstrap";
import UserService from "/src/services/UserService"; // Ajusta la ruta según tu estructura

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ titulo: "", texto: "" });

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay usuario en sessionStorage
        const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
        
        if (usuarioActivo && usuarioActivo.token) {
          // Aquí podrías validar el token con el backend
          // const userData = await UserService.verifyToken(usuarioActivo.token);
          setUsuario(usuarioActivo);
        } else {
          showMessage("Información", "No hay ningún usuario iniciado");
          setTimeout(() => navigate('/registro'), 2000);
        }
      } catch (err) {
        setError("Error verificando sesión: " + err.message);
        showMessage("Error", "Sesión inválida. Por favor inicie sesión nuevamente.");
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [navigate]);

  const cerrarSesion = async () => {
    try {
    
      sessionStorage.removeItem("usuarioActivo");
      localStorage.removeItem("carrito");
      
      showMessage("Sesión cerrada", "Has cerrado sesión correctamente");
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      sessionStorage.removeItem("usuarioActivo");
      showMessage("Sesión cerrada", "Sesión cerrada localmente");
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const showMessage = (titulo, texto) => {
    setModalContent({ titulo, texto });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalContent.titulo === "Sesión cerrada") {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Verificando sesión...</p>
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
      </Container>
    );
  }

<<<<<<< HEAD
  const esAdmin = user.rol === 'admin' || user.rol?.nombreRol === 'admin';
=======
  if (error && !usuario) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Ir al Login
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h4>No hay usuario activo</h4>
          <p>Redirigiendo al registro...</p>
        </Alert>
      </Container>
    );
  }
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>Mi Cuenta</h2>
        <p className="text-muted">Gestiona tu información personal</p>
      </div>

<<<<<<< HEAD
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="justify-content-center">
        <Col md={10}>
          {/* Información Personal */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📋 Información Personal</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Nombre:</strong> {user.nombre || "No disponible"}</p>
                  <p><strong>Email:</strong> {user.correo || "No disponible"}</p>
                  <p><strong>ID:</strong> <Badge bg="secondary">{user.id || user._id || "N/A"}</Badge></p>
                </Col>
                <Col md={6}>
                  <p><strong>Rol:</strong> <Badge bg={esAdmin ? 'danger' : 'success'}>
                    {user.rol?.nombreRol || user.rol || 'usuario'}
                  </Badge></p>
                  <p><strong>Total Compras:</strong> <Badge bg="info">{ventas.length}</Badge></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Historial de Compras */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🛒 Historial de Compras</h5>
                <Badge bg="primary">{ventas.length} compras</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {loadingVentas ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Cargando tus compras...</p>
                </div>
              ) : ventas.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover className="align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>N° Venta</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Método Pago</th>
                          <th>Cant. Productos</th>
                          <th className="text-end">Total</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventas.map((venta, index) => {
                          const totalVenta = obtenerTotalVenta(venta);
                          const cantidadProductos = obtenerCantidadProductos(venta);

                          return (
                            <tr key={venta.id || index}>
                              <td>
                                <strong>{venta.numeroVenta || `VEN-${index + 1}`}</strong>
                              </td>
                              <td>
                                {venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-CL') : 
                                 new Date().toLocaleDateString('es-CL')}
                              </td>
                              <td>
                                <Badge bg={
                                  venta.estado?.nombre === 'ENTREGADO' ? 'success' : 
                                  venta.estado?.nombre === 'PAGADO' ? 'primary' :
                                  venta.estado?.nombre === 'ENVIADO' ? 'info' : 
                                  'warning'
                                }>
                                  {venta.estado?.nombre || 'PENDIENTE'}
                                </Badge>
                              </td>
                              <td>
                                <small>
                                  {venta.metodoPago?.nombre || 'No especificado'}
                                </small>
                              </td>
                              <td>
                                <Badge bg={cantidadProductos > 0 ? "info" : "secondary"} className="fs-6">
                                  {cantidadProductos} producto(s)
                                </Badge>
                                {cantidadProductos === 0 && (
                                  <small className="text-warning d-block">Sin productos</small>
                                )}
                              </td>
                              <td className="text-end">
                                <strong className={totalVenta > 0 ? "text-success fs-5" : "text-muted fs-5"}>
                                  ${totalVenta.toLocaleString('es-CL')}
                                </strong>
                                {totalVenta === 0 && (
                                  <small className="text-warning d-block">Sin total</small>
                                )}
                              </td>
                              <td>
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => navigate('/confirmacion', { state: { venta } })}
                                  title="Ver detalles de la compra"
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Ver Detalles
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Resumen de Totales */}
                  <Row className="mt-4">
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-bold">📊 Resumen de Compras</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total de compras:</span>
                            <strong>{ventas.length}</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total de productos comprados:</span>
                            <strong className="text-primary">
                              {ventas.reduce((total, venta) => total + obtenerCantidadProductos(venta), 0)}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total gastado:</span>
                            <strong className="text-success fs-5">
                              ${ventas.reduce((total, venta) => total + obtenerTotalVenta(venta), 0).toLocaleString('es-CL')}
                            </strong>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  </div>
                  <h5 className="text-muted">Aún no has realizado compras</h5>
                  <p className="text-muted mb-4">Descubre nuestros productos y realiza tu primera compra</p>
                  <Button variant="p  rimary" size="lg" onClick={() => navigate('/hombre')}>
                    <i className="bi bi-bag me-2"></i>
                    Comenzar a Comprar
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Botón Cerrar Sesión */}
          <div className="text-center mt-4">
            <Button variant="outline-danger" onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </Button>
          </div>
        </Col>
      </Row>
=======
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Datos del Usuario</h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nombre:</strong></p>
              <p><strong>Email:</strong></p>
              <p><strong>ID de Usuario:</strong></p>
            </div>
            <div className="col-md-6">
              <p>{usuario.nombre || "No disponible"}</p>
              <p>{usuario.email || "No disponible"}</p>
              <p className="text-muted">{usuario.id || usuario._id || "N/A"}</p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
          >
            Seguir Comprando
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={cerrarSesion}
          >
            Cerrar Sesión
          </Button>
        </Card.Footer>
      </Card>

      {/* Sección adicional para futuras funcionalidades */}
      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h6 className="mb-0">Mis Pedidos</h6>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            {usuario.pedidos && usuario.pedidos.length > 0 
              ? `Tienes ${usuario.pedidos.length} pedidos realizados`
              : "Aún no has realizado ningún pedido"}
          </p>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => navigate('/pedidos')}
            disabled={!usuario.pedidos || usuario.pedidos.length === 0}
          >
            Ver Mis Pedidos
          </Button>
        </Card.Body>
      </Card>

      {/* Modal de Bootstrap */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.texto}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            {modalContent.titulo === "Sesión cerrada" ? "Ir a la Tienda" : "Cerrar"}
          </Button>
        </Modal.Footer>
      </Modal>
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
    </Container>
  );
};

export default MiCuenta;