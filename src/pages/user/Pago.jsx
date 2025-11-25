import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VentaService from '../../services/VentaService';

const Pago = ({ carrito, setCarrito, user }) => {
    const [formData, setFormData] = useState({
        nombre: '', email: '', telefono: '', direccion: '', ciudad: '', comuna: '',
        codigoPostal: '', metodoPago: 'tarjeta', numeroTarjeta: '', nombreTarjeta: '',
        fechaExpiracion: '', cvv: '', metodoEnvio: 'delivery', instruccionesEspeciales: ''
    });
    
    const [pasoActual, setPasoActual] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const isValidUserId = (userId) => {
        if (userId === null || userId === undefined) return false;
        if (typeof userId === 'string') {
            if (userId === 'N/A' || userId === 'null' || userId === 'undefined' || userId.trim() === '') {
                return false;
            }
        }
        const num = Number(userId);
        return !isNaN(num) && num > 0 && num < 1000000;
    };

    const extractUserId = (usuarioData) => {
        if (!usuarioData) return null;
        const posiblesIds = [
            usuarioData.id,
            usuarioData.userId,
            usuarioData.usuarioId,
            usuarioData?.usuario?.id,
            usuarioData?.user?.id,
            usuarioData?.data?.id,
            usuarioData?.data?.usuario?.id,
            usuarioData?.data?.user?.id,
            usuarioData?.response?.data?.id,
            usuarioData?.response?.id,
            usuarioData?.result?.id,
            usuarioData?.data?.data?.id,
        ];

        for (let id of posiblesIds) {
            if (isValidUserId(id)) {
                return Number(id);
            }
        }
        return null;
    };

    const getUserFromAllSources = (userProp) => {
        const sources = [
            { name: 'Props', data: userProp },
            { name: 'LocalStorage', data: JSON.parse(localStorage.getItem('user') || 'null') },
            { name: 'SessionStorage', data: JSON.parse(sessionStorage.getItem('usuarioActivo') || 'null') },
        ];

        for (let source of sources) {
            if (source.data && typeof source.data === 'object') {
                const userId = extractUserId(source.data);
                if (userId) {
                    return { ...source.data, id: userId };
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const cargarUsuario = () => {
            try {
                const usuarioEncontrado = getUserFromAllSources(user);
                if (!usuarioEncontrado) {
                    setError('❌ No estás autenticado. Por favor inicia sesión.');
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('usuarioActivo');
                    setTimeout(() => navigate('/auth'), 2000);
                    return;
                }
                setUsuario(usuarioEncontrado);
                setFormData(prev => ({
                    ...prev,
                    nombre: usuarioEncontrado.nombre || usuarioEncontrado.name || '',
                    email: usuarioEncontrado.correo || usuarioEncontrado.email || '',
                    telefono: usuarioEncontrado.telefono || usuarioEncontrado.phone || ''
                }));
            } catch (error) {
                setError('Error crítico al cargar usuario. Recarga la página.');
            }
        };
        cargarUsuario();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validarPaso1 = () => {
        return formData.nombre.trim() && formData.email.trim() && formData.telefono.trim();
    };

    const validarPaso2 = () => {
        return formData.direccion.trim() && formData.ciudad.trim() && formData.comuna.trim();
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

    // 🔥🔥🔥 FUNCIÓN DE PAGO CORREGIDA
    const procesarPago = async () => {
        console.log('💰 INICIANDO PROCESO DE PAGO...');
        
        if (!usuario) {
            setError('❌ No se encontró información del usuario');
            return;
        }

        const userId = extractUserId(usuario);
        if (!userId) {
            setError('💥 ID de usuario inválido. Contacta al soporte.');
            return;
        }

        if (!carrito || carrito.length === 0) {
            setError('🛒 El carrito está vacío');
            return;
        }

        // 🔥 VERIFICAR PRODUCTOS ANTES DE ENVIAR
        console.log('🔍 VERIFICANDO PRODUCTOS EN CARRITO:');
        carrito.forEach((item, index) => {
            console.log(`Producto ${index}:`, {
                id: item.id,
                nombre: item.name || item.nombre,
                tieneId: !!item.id,
                idValido: item.id && item.id > 0
            });
        });

        // 🔥 FILTRAR SOLO PRODUCTOS CON ID VÁLIDO
        const productosValidos = carrito.filter(item => item.id && Number(item.id) > 0);
        
        if (productosValidos.length === 0) {
            setError('❌ No hay productos válidos en el carrito. Algunos productos no tienen ID.');
            return;
        }

        if (productosValidos.length !== carrito.length) {
            console.warn(`⚠️ Se excluyeron ${carrito.length - productosValidos.length} productos sin ID válido`);
        }

        setLoading(true);
        setError('');

        try {
            const ventaData = {
                numeroVenta: `VEN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                usuario: { id: userId },
                estado: { id: 1 },
                metodoPago: { 
                    id: formData.metodoPago === 'tarjeta' ? 1 : 
                         formData.metodoPago === 'transferencia' ? 2 : 3 
                },
                metodoEnvio: { 
                    id: formData.metodoEnvio === 'delivery' ? 1 : 2 
                },
                items: productosValidos.map(item => ({
                    producto: { id: Number(item.id) },
                    cantidad: Number(item.cantidad || 1),
                    precioUnitario: Number(item.price || item.precio || 0),
                    subtotal: Number((item.price || item.precio || 0) * (item.cantidad || 1))
                })),
                total: Number(total),
                direccionEnvio: {
                    direccion: formData.direccion,
                    ciudad: formData.ciudad,
                    comuna: formData.comuna,
                    codigoPostal: formData.codigoPostal,
                    instrucciones: formData.instruccionesEspeciales
                }
            };

            console.log('🔄 ENVIANDO VENTA AL SERVIDOR:', ventaData);
            
            const resultado = await VentaService.crearVenta(ventaData);

            if (resultado.success) {
                console.log('🎉 VENTA EXITOSA:', resultado.data);
                setCarrito([]);
                localStorage.removeItem('carrito');
                localStorage.removeItem('carritoParaPago');
                navigate('/confirmacion', { 
                    state: { 
                        venta: resultado.data,
                        carrito: productosValidos,
                        total: total,
                        datosEnvio: formData
                    } 
                });
            } else {
                setError(resultado.error || 'Error al procesar el pago');
            }

        } catch (err) {
            console.error('💥 ERROR FATAL:', err);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = carrito.reduce((sum, item) => sum + ((item.price || item.precio || 0) * (item.cantidad || 1)), 0);
    const costoEnvio = formData.metodoEnvio === 'delivery' ? 3500 : 0;
    const total = subtotal + costoEnvio;

    if (!usuario) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <h4>Cargando información de usuario...</h4>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        );
    }

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <h4>🛒 Carrito Vacío</h4>
                        <p>No hay productos para procesar el pago</p>
                        <button className="btn btn-primary" onClick={() => navigate('/hombre')}>
                            Seguir Comprando
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getImageSrc = (imageUrl) => {
        if (!imageUrl || imageUrl.includes('placeholder.com')) {
            return '/images/placeholder-product.jpg';
        }
        return imageUrl;
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Finalizar Compra</h4>
                                <div className="text-muted">Paso {pasoActual} de 3</div>
                            </div>
                        </div>
                        
                        <div className="card-body border-bottom">
                            <div className="progress mb-3" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: `${(pasoActual / 3) * 100}%` }}></div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className={`text-center ${pasoActual >= 1 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>1</div><small>Información</small>
                                </div>
                                <div className={`text-center ${pasoActual >= 2 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>2</div><small>Envío</small>
                                </div>
                                <div className={`text-center ${pasoActual >= 3 ? 'text-success fw-bold' : 'text-muted'}`}>
                                    <div>3</div><small>Pago</small>
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

                            {usuario && (
                                <div className="alert alert-success d-flex align-items-center mb-4">
                                    <i className="bi bi-person-check me-2"></i>
                                    <div>
                                        <strong>✅ Usuario identificado:</strong> {usuario.nombre} 
                                        {(usuario.correo || usuario.email) && ` (${usuario.correo || usuario.email})`}
                                        <br />
                                        <small>ID: {extractUserId(usuario)}</small>
                                    </div>
                                </div>
                            )}

                            {/* ... (el resto del JSX del formulario se mantiene igual) ... */}
                            {pasoActual === 1 && (
                                <div className="fade-in">
                                    <h5 className="mb-4">Información Personal</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nombre completo *</label>
                                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ej: Juan Pérez" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required placeholder="ejemplo@correo.com" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Teléfono *</label>
                                            <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="+56 9 1234 5678" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {pasoActual === 2 && (
                                <div className="fade-in">
                                    <h5 className="mb-4">Dirección de Envío</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Dirección *</label>
                                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Calle y número" required />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Ciudad *</label>
                                            <input type="text" className="form-control" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required placeholder="Santiago" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Comuna *</label>
                                            <input type="text" className="form-control" name="comuna" value={formData.comuna} onChange={handleInputChange} required placeholder="Providencia" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Código Postal</label>
                                            <input type="text" className="form-control" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} placeholder="7500000" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Instrucciones especiales</label>
                                            <textarea className="form-control" name="instruccionesEspeciales" value={formData.instruccionesEspeciales} onChange={handleInputChange} rows="3" placeholder="Ej: Timbre azul, dejar con portero, etc." />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {pasoActual === 3 && (
                                <div className="fade-in">
                                    <h5 className="mb-4">Método de Pago</h5>
                                    <div className="mb-4">
                                        <label className="form-label">Selecciona método de pago *</label>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'tarjeta' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="tarjeta" id="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="tarjeta">
                                                            <i className="bi bi-credit-card me-2"></i>Tarjeta
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'transferencia' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="transferencia" id="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="transferencia">
                                                            <i className="bi bi-bank me-2"></i>Transferencia
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'efectivo' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="efectivo" id="efectivo" checked={formData.metodoPago === 'efectivo'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100" htmlFor="efectivo">
                                                            <i className="bi bi-cash-coin me-2"></i>Efectivo
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
                                                <input type="text" className="form-control" name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleInputChange} placeholder="1234 5678 9012 3456" maxLength="19" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Nombre en la tarjeta *</label>
                                                <input type="text" className="form-control" name="nombreTarjeta" value={formData.nombreTarjeta} onChange={handleInputChange} placeholder="Como aparece en la tarjeta" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Expira *</label>
                                                <input type="text" className="form-control" name="fechaExpiracion" value={formData.fechaExpiracion} onChange={handleInputChange} placeholder="MM/AA" maxLength="5" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">CVV *</label>
                                                <input type="text" className="form-control" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" maxLength="3" />
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
                                    <button type="button" className="btn btn-outline-secondary" onClick={pasoAnterior} disabled={loading}>
                                        <i className="bi bi-arrow-left me-2"></i>Anterior
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/carrito')}>
                                        <i className="bi bi-arrow-left me-2"></i>Volver al Carrito
                                    </button>
                                )}
                                
                                {pasoActual < 3 ? (
                                    <button type="button" className="btn btn-primary" onClick={siguientePaso}>
                                        Siguiente<i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-success btn-lg" onClick={procesarPago} disabled={loading}>
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
                                        <img src={getImageSrc(item.image || item.imagen)} alt={item.name || item.nombre} className="rounded me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }} />
                                        <div className="flex-grow-1">
                                            <div className="fw-semibold small">{item.name || item.nombre}</div>
                                            <div className="text-muted small">
                                                {item.cantidad || 1} x ${(item.price || item.precio || 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="fw-semibold">
                                            ${((item.price || item.precio || 0) * (item.cantidad || 1)).toLocaleString()}
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

                            <div className="border-top pt-
