import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";
import OrderService from "/src/services/OrderService";

const Pago = ({ carrito, setCarrito }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    metodoPago: "tarjeta",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    notas: "",
    aceptaPolitica: false
  });

  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [mensajeDescuento, setMensajeDescuento] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [mostrarDatosTarjeta, setMostrarDatosTarjeta] = useState(true);

  const codigosValidos = {
    "EFA10": 10,
    "EFA20": 20,
    "COÑITO": 30,
    "PIPOLLA": 40,
    "NEGROTE": 50,
    "POTOÑO": 80,
    "50SOMBRASDEESTEBAN": 99,
    "DICKSON": 100,
  };

  // Calcular totales
  const subtotal = carrito.reduce((total, item) => total + ((item.price || item.precio || 0) * (item.cantidad || 1)), 0);
  const descuentoMonto = subtotal * (descuentoAplicado / 100);
  const total = subtotal - descuentoMonto;

  useEffect(() => {
    localStorage.removeItem("descuento");
    localStorage.removeItem("codigoUsado");
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'metodoPago') {
      setMostrarDatosTarjeta(value === 'tarjeta');
    }
  };

  const aplicarDescuento = () => {
    const codigo = codigoDescuento.trim().toUpperCase();
    const descuento = codigosValidos[codigo];

    if (descuento) {
      setDescuentoAplicado(descuento);
      setMensajeDescuento(`Descuento del ${descuento}% aplicado.`);
      localStorage.setItem("descuento", descuento.toString());
    } else {
      setMensajeDescuento("Código de descuento inválido.");
    }
    setCodigoDescuento("");
  };

  const eliminarDescuento = () => {
    setDescuentoAplicado(0);
    setMensajeDescuento("");
    setCodigoDescuento("");
    localStorage.removeItem("descuento");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.aceptaPolitica) {
      setError("Debes aceptar la política de privacidad");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar datos para la orden
      const orderData = {
        customer: {
          email: formData.correo,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          direccion: {
            calle: formData.direccion,
            ciudad: formData.ciudad,
            region: formData.region,
            codigoPostal: formData.codigoPostal
          }
        },
        items: carrito.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          price: item.price || item.precio,
          quantity: item.cantidad || 1,
          size: item.talla,
          image: item.image
        })),
        payment: {
          method: formData.metodoPago,
          subtotal: subtotal,
          discount: descuentoMonto,
          total: total,
          discountCode: codigoDescuento || null
        },
        notes: formData.notas
      };

      // Enviar orden al backend
      const response = await OrderService.createOrder(orderData);
      
      // Guardar ID de la orden
      setOrderId(response.data.orderId || response.data._id);
      
      // Limpiar carrito
      setCarrito([]);
      localStorage.removeItem('carrito');
      localStorage.removeItem('descuento');
      
      // Mostrar modal de éxito
      setShowSuccessModal(true);

    } catch (err) {
      setError("Error al procesar el pago: " + (err.response?.data?.message || err.message));
      console.error("Error processing order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (carrito.length === 0 && !showSuccessModal) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h2>No hay productos en el carrito</h2>
          <p>Agrega algunos productos para continuar con la compra</p>
        </Alert>
        <Button variant="dark" onClick={() => navigate('/')}>
          Volver a la tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2>Finalizar Compra</h2>
        <p className="text-muted">Completa tus datos para procesar el pedido</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {/* Resumen del Pedido */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Resumen del Pedido</h5>
            </Card.Header>
            <Card.Body>
              {carrito.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-2">
                  <div className="flex-grow-1">
                    <strong>{item.name}</strong>
                    {item.talla && <div className="text-muted small">Talla: {item.talla}</div>}
                    <div className="text-muted small">Cantidad: {item.cantidad || 1}</div>
                  </div>
                  <div className="text-end">
                    <div>${((item.price || item.precio || 0) * (item.cantidad || 1)).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Descuento ({descuentoAplicado}%):</span>
                    <span>-${descuentoMonto.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                  <span>Total:</span>
                  <span className="text-danger">${total.toLocaleString()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Código de descuento */}
          <Card className="mt-3 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">Código de Descuento</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label className="small">Ingresa tu código</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Código de descuento"
                    value={codigoDescuento}
                    onChange={(e) => setCodigoDescuento(e.target.value)}
                  />
                  <Button variant="outline-dark" onClick={aplicarDescuento}>
                    Aplicar
                  </Button>
                </div>
                {mensajeDescuento && (
                  <Form.Text className={mensajeDescuento.includes('inválido') ? 'text-danger' : 'text-success'}>
                    {mensajeDescuento}
                  </Form.Text>
                )}
              </Form.Group>
              {descuentoAplicado > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="mt-2"
                  onClick={eliminarDescuento}
                >
                  Eliminar descuento
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario de Pago */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Datos de Pago y Envío</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellidos *</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad *</Form.Label>
                      <Form.Control
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Región *</Form.Label>
                      <Form.Control
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Método de Pago *</Form.Label>
                  <Form.Select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="paypal">PayPal</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                  </Form.Select>
                </Form.Group>

                {mostrarDatosTarjeta && (
                  <div className="border p-3 rounded mb-3">
                    <Row>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Número de Tarjeta *</Form.Label>
                          <Form.Control
                            type="text"
                            name="tarjeta"
                            placeholder="1234 5678 9012 3456"
                            value={formData.tarjeta}
                            onChange={handleInputChange}
                            required={mostrarDatosTarjeta}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            placeholder="123"
                            maxLength="4"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required={mostrarDatosTarjeta}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Vencimiento *</Form.Label>
                      <Form.Control
                        type="month"
                        name="vencimiento"
                        value={formData.vencimiento}
                        onChange={handleInputChange}
                        required={mostrarDatosTarjeta}
                      />
                    </Form.Group>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Notas del Pedido (Opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="aceptaPolitica"
                    checked={formData.aceptaPolitica}
                    onChange={handleInputChange}
                    label="He leído y acepto la política de privacidad y los términos de servicio"
                    required
                  />
                </Form.Group>

                <Button
                  variant="success"
                  size="lg"
                  type="submit"
                  className="w-100 py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Procesando Pago...
                    </>
                  ) : (
                    `Pagar $${total.toLocaleString()}`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de éxito */}
      <Modal show={showSuccessModal} onHide={handleSuccessModalClose} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>¡Compra Exitosa!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5>¡Gracias por tu compra!</h5>
          <p>Tu pedido ha sido procesado exitosamente.</p>
          {orderId && (
            <Alert variant="info" className="mt-3">
              <strong>Número de orden:</strong> #{orderId}
            </Alert>
          )}
          <p>Recibirás un correo de confirmación shortly.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSuccessModalClose}>
            Continuar Comprando
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pago;