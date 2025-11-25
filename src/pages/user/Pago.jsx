import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VentaService from '../../services/VentaService';
import "./styles/global.css";

const Pago = ({ carrito, setCarrito }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        comuna: '',
        codigoPostal: '',
        metodoPago: 'tarjeta',
        numeroTarjeta: '',
        nombreTarjeta: '',
        fechaExpiracion: '',
        cvv: '',
        metodoEnvio: 'delivery',
        instruccionesEspeciales: ''
    });
    
    const [pasoActual, setPasoActual] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const usuario = JSON.parse(sessionStorage.getItem('usuarioActivo'));

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
            const ventaData = {
                numeroVenta: `VEN-${Date.now()}`,
                usuario: { id: usuario.id },
                estado: { id: 1 },
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

            const resultado = await VentaService.crearVenta(ventaData);

            if (resultado.success) {
                setCarrito([]);
                localStorage.removeItem('carrito');
                
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

                            {pasoActual === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">Información Personal</h5>
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

                            {pasoActual === 2 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">Dirección de Envío</h5>
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

                            {pasoActual === 3 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="mb-4">Método de Pago</h5>
                                    
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

                    <div className="card border-0 bg-light">
                        <div className="card-body text-center py-3">
                            <small className="text-muted">
                                <i className="bi bi-shield-check me-1"></i>
                                Pago seguro
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Resumen del Pedido</h5>
                        </div>
                        <div className="card-body">
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

                            <div className="mb-3">
                                <h6>Método de envío</h6>
                                <div className="d-flex justify-content-between">
                                    <span>{formData.metodoEnvio === 'delivery' ? 'Delivery a domicilio' : 'Retiro en tienda'}</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span>
                                </div>
                            </div>

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
};

export default Pago;
