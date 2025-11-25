import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Alert, Spinner, Row, Col, Badge, Table } from "react-bootstrap";
import ventaService from "../../services/VentaService";

const MiCuenta = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [error, setError] = useState("");

  const normalizedUser = user ? {
    id: user.id || user._id || user.usuarioId || 'N/A',
    nombre: user.nombre || user.name || user.nombreCompleto || 'N/A',
    correo: user.correo || user.email || user.mail || 'N/A',
    rol: user.rol || user.role || user.tipo || 'Cliente'
  } : null;

  const formatClp = (value) => (value || 0).toLocaleString("es-CL");
  const obtenerTotalVenta = useCallback((venta) => venta.totalCalculado || 0, []);
  const obtenerCantidadProductos = useCallback((venta) => venta.cantidadProductos || 0, []);

  const cargarVentas = async (usuario) => {
    if (!usuario?.id || usuario.id === 'N/A') return;

    setLoadingVentas(true);
    setError("");
    try {
      const resultado = await ventaService.obtenerVentasPorUsuario(usuario.id);

      if (resultado.success) {
        const ventasProcesadas = ventaService.procesarVentas(resultado.data);
        setVentas(ventasProcesadas);
      } else {
        setError(resultado.error || "Error al cargar las ventas");
      }
    } catch (error) {
      setError("No se pudieron cargar las ventas desde el servicio.");
    } finally {
      setLoadingVentas(false);
    }
  };

  useEffect(() => {
    if (normalizedUser && normalizedUser.id && normalizedUser.id !== 'N/A') {
      cargarVentas(normalizedUser);
    }
  }, [normalizedUser]);

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioActivo");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setUser(null);
    navigate('/');
  };

  if (!normalizedUser) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Cargando...</p>
      </Container>
    );
  }

  const rolName = normalizedUser.rol?.nombreRol || normalizedUser.rol || 'Cliente';
  const esAdmin = rolName.toLowerCase() === 'admin';

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>Mi Cuenta</h2>
        <p className="text-muted">Gestiona tu información personal y revisa tu historial.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Información Personal</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Nombre:</strong> {normalizedUser.nombre || 'N/A'}</p>
                  <p><strong>Email:</strong> {normalizedUser.correo || 'N/A'}</p>
                  <p><strong>ID:</strong> <Badge bg="secondary">{normalizedUser.id || 'N/A'}</Badge></p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Rol:</strong>
                    <Badge bg={esAdmin ? 'danger' : 'success'} className="ms-2">
                      {rolName}
                    </Badge>
                  </p>
                  <p><strong>Total Compras:</strong> <Badge bg="info">{ventas.length}</Badge></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Historial de Compras</h5>
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
                    <Table striped bordered hover>
                      <thead className="table-dark">
                        <tr>
                          <th>N° Venta</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Método Pago</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventas.map((venta, index) => {
                          const total = obtenerTotalVenta(venta);
                          const cantidad = obtenerCantidadProductos(venta);

                          let estadoColor = 'info';
                          if (venta.estado?.nombre === 'Completada') estadoColor = 'success';
                          else if (venta.estado?.nombre === 'Cancelada') estadoColor = 'danger';

                          return (
                            <tr key={index}>
                              <td>{venta.numeroVenta || `VEN-${index + 1}`}</td>
                              <td>{venta.fecha ? new Date(venta.fecha).toLocaleDateString() : "-"}</td>
                              <td>
                                <Badge bg={estadoColor}>{venta.estado?.nombre || "PENDIENTE"}</Badge>
                              </td>
                              <td>{venta.metodoPago?.nombre || "No especificado"}</td>
                              <td>{cantidad}</td>
                              <td>${formatClp(total)}</td>
                              <td>
                                <Button 
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => navigate('/confirmacion', { state: { venta } })}
                                >
                                  Ver detalles
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

                  <Row className="mt-4 justify-content-end">
                    <Col md={6}>
                      <Card className="bg-light border-0">
                        <Card.Body>
                          <h6 className="fw-bold">Resumen de Compras</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total de compras:</span>
                            <strong>{ventas.length}</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Total de productos comprados:</span>
                            <strong>
                              {ventas.reduce((t, v) => t + obtenerCantidadProductos(v), 0)}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between pt-2 border-top">
                            <span className="fs-5 fw-bold">Total gastado:</span>
                            <strong className="text-success fs-5">
                              ${formatClp(ventas.reduce((t, v) => t + obtenerTotalVenta(v), 0))}
                            </strong>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">Aún no has realizado compras</h5>
                  <Button variant="primary" size="lg" onClick={() => navigate('/productos')}>
                    Comenzar a Comprar
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button variant="outline-danger" onClick={cerrarSesion}>
              Cerrar Sesión
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MiCuenta;
