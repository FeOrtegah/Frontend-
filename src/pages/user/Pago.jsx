<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VentaService from '../../services/VentaService';

const Pago = ({ carrito, setCarrito }) => {
    const [formData, setFormData] = useState({
        // Información personal
        nombre: '',
        email: '',
        telefono: '',
        
        // Dirección de envío
        direccion: '',
        ciudad: '',
        comuna: '',
        codigoPostal: '',
        
        // Información de pago
        metodoPago: 'tarjeta',
        numeroTarjeta: '',
        nombreTarjeta: '',
        fechaExpiracion: '',
        cvv: '',
        
        // Método de envío
        metodoEnvio: 'delivery',
        instruccionesEspeciales: ''
    });
    
    const [pasoActual, setPasoActual] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const usuario = JSON.parse(sessionStorage.getItem('usuarioActivo'));

    // Calcular totales
    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    const costoEnvio = formData.metodoEnvio === 'delivery' ? 3500 : 0;
    const total = subtotal + costoEnvio;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarPaso1 = () => {
        return formData.nombre && formData.email && formData.telefono;
    };

    const validarPaso2 = () => {
        return formData.direccion && formData.ciudad && formData.comuna;
    };

    const validarPaso3 = () => {
        if (formData.metodoPago === 'tarjeta') {
            return formData.numeroTarjeta && formData.nombreTarjeta && formData.fechaExpiracion && formData.cvv;
        }
        return true;
    };

    const siguientePaso = () => {
        if (pasoActual === 1 && !validarPaso1()) {
            setError('Por favor completa toda la información personal');
            return;
        }
        if (pasoActual === 2 && !validarPaso2()) {
            setError('Por favor completa la dirección de envío');
            return;
        }
        setError('');
        setPasoActual(pasoActual + 1);
    };

    const pasoAnterior = () => {
        setError('');
        setPasoActual(pasoActual - 1);
    };

    const procesarPago = async () => {
        if (pasoActual === 3 && !validarPaso3()) {
            setError('Por favor completa la información de pago');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Preparar datos para la venta
            const ventaData = {
                numeroVenta: `VEN-${Date.now()}`,
                usuario: { id: usuario.id },
                estado: { id: 1 }, // PENDIENTE
                metodoPago: { 
                    id: formData.metodoPago === 'tarjeta' ? 1 : 
                        formData.metodoPago === 'transferencia' ? 2 : 3 
                },
                metodoEnvio: { 
                    id: formData.metodoEnvio === 'delivery' ? 1 : 2 
                },
                items: carrito.map(item => ({
                    producto: { id: item.id },
                    cantidad: item.cantidad,
                    precioUnitario: item.price,
                    subtotal: item.price * item.cantidad
                }))
            };

            console.log('📤 Procesando pago...');
            const resultado = await VentaService.crearVenta(ventaData);

            if (resultado.success) {
                // Limpiar carrito
                setCarrito([]);
                localStorage.removeItem('carrito');
                
                // Redirigir a confirmación
                navigate('/confirmacion', { 
                    state: { 
                        venta: resultado.data,
                        carrito: carrito,
                        total: total,
                        datosEnvio: formData
                    } 
                });
            } else {
                setError(resultado.error || 'Error al procesar el pago');
            }

        } catch (err) {
            console.error('💥 Error en pago:', err);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <div className="mb-4">
                            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                        </div>
                        <h2>Carrito Vacío</h2>
                        <p className="text-muted mb-4">No hay productos para procesar el pago</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/hombre')}>
                            <i className="bi bi-arrow-left me-2"></i>
                            Seguir Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                {/* Proceso de Pago */}
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Finalizar Compra</h4>
                                <div className="text-muted">
                                    Paso {pasoActual} de 3
                                </div>
                            </div>
                        </div>
                        
                        {/* Indicador de Progreso */}
                        <div className="card-body border-bottom">
                            <div className="progress mb-3" style={{ height: '8px' }}>
                                <div 
                                    className="progress-bar bg-success" 
                                    style={{ width: `${(pasoActual / 3) * 100}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className={`text-center ${pasoActual >= 1 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>1</div>
                                    <small>Información</small>
                                </div>
                                <div className={`text-center ${pasoActual >= 2 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>2</div>
                                    <small>Envío</small>
                                </div>
                                <div className={`text-center ${pasoActual >= 3 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>3</div>
                                    <small>Pago</small>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* Paso 1: Información Personal */}
                            {pasoActual === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">📋 Información Personal</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nombre completo *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Teléfono *</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2: Dirección de Envío */}
                            {pasoActual === 2 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">🚚 Dirección de Envío</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Dirección *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                placeholder="Calle y número"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Ciudad *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Comuna *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="comuna"
                                                value={formData.comuna}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Código Postal</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="codigoPostal"
                                                value={formData.codigoPostal}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Instrucciones especiales</label>
                                            <textarea
                                                className="form-control"
                                                name="instruccionesEspeciales"
                                                value={formData.instruccionesEspeciales}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Ej: Timbre azul, dejar con portero, etc."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Paso 3: Método de Pago */}
                            {pasoActual === 3 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">💳 Método de Pago</h5>
                                    
                                    <div className="mb-4">
                                        <label className="form-label">Selecciona método de pago *</label>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'tarjeta' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="tarjeta"
                                                            id="tarjeta"
                                                            checked={formData.metodoPago === 'tarjeta'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="tarjeta">
                                                            <i className="bi bi-credit-card me-2"></i>
                                                            Tarjeta
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'transferencia' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="transferencia"
                                                            id="transferencia"
                                                            checked={formData.metodoPago === 'transferencia'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="transferencia">
                                                            <i className="bi bi-bank me-2"></i>
                                                            Transferencia
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'efectivo' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="efectivo"
                                                            id="efectivo"
                                                            checked={formData.metodoPago === 'efectivo'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="efectivo">
                                                            <i className="bi bi-cash-coin me-2"></i>
                                                            Efectivo
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.metodoPago === 'tarjeta' && (
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label">Número de tarjeta *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="numeroTarjeta"
                                                    value={formData.numeroTarjeta}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Nombre en la tarjeta *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="nombreTarjeta"
                                                    value={formData.nombreTarjeta}
                                                    onChange={handleInputChange}
                                                    placeholder="Como aparece en la tarjeta"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Expira *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fechaExpiracion"
                                                    value={formData.fechaExpiracion}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/AA"
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">CVV *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    maxLength="3"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {formData.metodoPago === 'transferencia' && (
                                        <div className="alert alert-info">
                                            <h6>Instrucciones para transferencia:</h6>
                                            <p className="mb-1">Banco: Santander</p>
                                            <p className="mb-1">Cuenta: 123456789</p>
                                            <p className="mb-1">Titular: EFA Store</p>
                                            <p className="mb-0">RUT: 12.345.678-9</p>
                                        </div>
                                    )}

                                    {formData.metodoPago === 'efectivo' && (
                                        <div className="alert alert-warning">
                                            <h6>Pago en efectivo</h6>
                                            <p className="mb-0">Podrás pagar en efectivo al momento de la entrega o retiro en tienda.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botones de Navegación */}
                            <div className="d-flex justify-content-between mt-4">
                                {pasoActual > 1 ? (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={pasoAnterior}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Anterior
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/carrito')}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Volver al Carrito
                                    </button>
                                )}
                                
                                {pasoActual < 3 ? (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={siguientePaso}
                                    >
                                        Siguiente
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-lg"
                                        onClick={procesarPago}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-lock-fill me-2"></i>
                                                Pagar ${total.toLocaleString()}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Seguridad */}
                    <div className="card border-0 bg-light">
                        <div className="card-body text-center py-3">
                            <small className="text-muted">
                                <i className="bi bi-shield-check me-1"></i>
                                Pago 100% seguro • Tus datos están protegidos
                            </small>
                        </div>
                    </div>
                </div>

                {/* Resumen del Pedido */}
                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-header bg-white">
                            <h5 className="mb-0">📦 Resumen del Pedido</h5>
                        </div>
                        <div className="card-body">
                            {/* Productos */}
                            <div className="mb-3">
                                <h6>Productos ({carrito.length})</h6>
                                {carrito.map(item => (
                                    <div key={item.id} className="d-flex align-items-center mb-2 pb-2 border-bottom">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="rounded me-3"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50x50/eee/333?text=Imagen';
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-semibold small">{item.name}</div>
                                            <div className="text-muted small">
                                                {item.cantidad} x ${item.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="fw-semibold">
                                            ${(item.price * item.cantidad).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Método de Envío */}
                            <div className="mb-3">
                                <h6>Método de envío</h6>
                                <div className="d-flex justify-content-between">
                                    <span>{formData.metodoEnvio === 'delivery' ? 'Delivery a domicilio' : 'Retiro en tienda'}</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span>
                                </div>
                            </div>

                            {/* Totales */}
                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Envío</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold fs-5 text-success">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
=======
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
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
};

export default Pago;