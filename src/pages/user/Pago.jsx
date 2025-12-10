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
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    // Función simple para formatear número de tarjeta
    const formatearNumeroTarjeta = (valor) => {
        const soloNumeros = valor.replace(/\D/g, '');
        const grupos = soloNumeros.match(/.{1,4}/g);
        return grupos ? grupos.join(' ').substring(0, 19) : '';
    };

    // Función simple para formatear fecha de expiración
    const formatearFechaExpiracion = (valor) => {
        const soloNumeros = valor.replace(/\D/g, '');
        if (soloNumeros.length <= 2) return soloNumeros;
        return soloNumeros.substring(0, 2) + '/' + soloNumeros.substring(2, 4);
    };

    const isValidUserId = (userId) => {
        if (!userId) return false;
        const num = Number(userId);
        return !isNaN(num) && num > 0;
    };

    const extractUserId = (usuarioData) => {
        if (!usuarioData) return null;
        const posiblesIds = [usuarioData.id, usuarioData.userId, usuarioData.usuarioId, usuarioData?.usuario?.id];
        for (let id of posiblesIds) {
            if (isValidUserId(id)) return Number(id);
        }
        return null;
    };

    useEffect(() => {
        const cargarUsuario = () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
                const usuarioEncontrado = user || storedUser;
                
                if (!usuarioEncontrado) {
                    setError('❌ No estás autenticado');
                    setTimeout(() => navigate('/auth'), 2000);
                    return;
                }

                const userId = extractUserId(usuarioEncontrado);
                if (!userId) {
                    setError('❌ ID de usuario inválido');
                    return;
                }

                setUsuario({ ...usuarioEncontrado, id: userId });
                setFormData(prev => ({
                    ...prev,
                    nombre: usuarioEncontrado.nombre || '',
                    email: usuarioEncontrado.correo || usuarioEncontrado.email || '',
                    telefono: usuarioEncontrado.telefono || ''
                }));
            } catch (error) {
                setError('Error al cargar usuario');
            }
        };
        cargarUsuario();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let valorProcesado = value;

        // Aplicar formateo específico por campo
        switch (name) {
            case 'numeroTarjeta':
                valorProcesado = formatearNumeroTarjeta(value);
                break;

            case 'fechaExpiracion':
                valorProcesado = formatearFechaExpiracion(value);
                break;

            case 'cvv':
                // Solo números, máximo 4 dígitos
                valorProcesado = value.replace(/\D/g, '').substring(0, 4);
                break;

            case 'codigoPostal':
                // Solo números, máximo 10 dígitos
                valorProcesado = value.replace(/\D/g, '').substring(0, 10);
                break;

            case 'telefono':
                // Permitir números, +, -, espacios y paréntesis
                valorProcesado = value.replace(/[^\d+\-\s()]/g, '');
                break;

            default:
                break;
        }

        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validarPaso1 = () => {
        const errors = {};
        
        if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
        if (!formData.email.trim()) errors.email = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
        if (!formData.telefono.trim()) errors.telefono = 'El teléfono es requerido';
        
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const validarPaso2 = () => {
        const errors = {};
        
        if (!formData.direccion.trim()) errors.direccion = 'La dirección es requerida';
        if (!formData.ciudad.trim()) errors.ciudad = 'La ciudad es requerida';
        if (!formData.comuna.trim()) errors.comuna = 'La comuna es requerida';
        
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const validarPaso3 = () => {
        if (formData.metodoPago !== 'tarjeta') return true;

        const errors = {};
        
        const numeroTarjetaLimpio = formData.numeroTarjeta.replace(/\s/g, '');
        if (!numeroTarjetaLimpio) errors.numeroTarjeta = 'El número de tarjeta es requerido';
        else if (numeroTarjetaLimpio.length !== 16) errors.numeroTarjeta = 'El número de tarjeta debe tener 16 dígitos';
        
        if (!formData.nombreTarjeta.trim()) errors.nombreTarjeta = 'El nombre en la tarjeta es requerido';
        
        if (!formData.fechaExpiracion) errors.fechaExpiracion = 'La fecha de expiración es requerida';
        else if (formData.fechaExpiracion.length !== 5) errors.fechaExpiracion = 'Formato MM/AA requerido';
        else {
            // Validar que la fecha no esté expirada
            const [mes, año] = formData.fechaExpiracion.split('/');
            const mesNum = parseInt(mes, 10);
            const añoNum = parseInt(año, 10);
            
            if (mesNum < 1 || mesNum > 12) {
                errors.fechaExpiracion = 'Mes inválido (01-12)';
            } else {
                const fechaExpiracion = new Date(2000 + añoNum, mesNum - 1);
                const hoy = new Date();
                if (fechaExpiracion < hoy) {
                    errors.fechaExpiracion = 'La tarjeta está expirada';
                }
            }
        }
        
        if (!formData.cvv) errors.cvv = 'El CVV es requerido';
        else if (formData.cvv.length < 3) errors.cvv = 'El CVV debe tener 3 o 4 dígitos';
        
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const siguientePaso = () => {
        setError('');
        
        switch (pasoActual) {
            case 1:
                if (!validarPaso1()) {
                    setError('Por favor corrige los errores en la información personal');
                    return;
                }
                break;
            case 2:
                if (!validarPaso2()) {
                    setError('Por favor corrige los errores en la dirección de envío');
                    return;
                }
                break;
        }
        
        setPasoActual(pasoActual + 1);
    };

    const pasoAnterior = () => {
        setError('');
        setFieldErrors({});
        setPasoActual(pasoActual - 1);
    };

    const procesarPago = async () => {
        if (!usuario) {
            setError('No se encontró usuario');
            return;
        }

        const userId = extractUserId(usuario);
        if (!userId) {
            setError('ID de usuario inválido');
            return;
        }

        if (!carrito?.length) {
            setError('Carrito vacío');
            return;
        }

        if (formData.metodoPago === 'tarjeta' && !validarPaso3()) {
            setError('Por favor corrige los errores en la información de pago');
            return;
        }

        // Filtrar productos válidos
        const productosValidos = carrito.filter(item => item.id && Number(item.id) > 0);
        if (productosValidos.length === 0) {
            setError('No hay productos válidos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const ventaData = {
                usuarioId: userId,
                estadoId: 1,
                metodoPagoId: formData.metodoPago === 'tarjeta' ? 1 : 
                             formData.metodoPago === 'transferencia' ? 2 : 3,
                metodoEnvioId: formData.metodoEnvio === 'delivery' ? 1 : 2,
                items: productosValidos.map(item => ({
                    productoId: Number(item.id),
                    cantidad: Number(item.cantidad || 1),
                    precioUnitario: Number(item.price || item.precio || 0),
                    subtotal: Number((item.price || item.precio || 0) * (item.cantidad || 1))
                }))
            };

            console.log('📤 Enviando datos al backend:', ventaData);
            const resultado = await VentaService.crearVenta(ventaData);

            if (resultado.success) {
                setCarrito([]);
                localStorage.removeItem('carrito');
                navigate('/confirmacion', { 
                    state: { 
                        venta: resultado.data,
                        carrito: productosValidos,
                        total: total,
                        datosEnvio: formData
                    } 
                });
            } else {
                setError(resultado.error || 'Error al procesar pago');
            }
        } catch (err) {
            setError('Error de conexión');
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
                        <div className="spinner-border text-primary mb-3"></div>
                        <h4>Cargando usuario...</h4>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        );
    }

    if (!carrito.length) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <h4>🛒 Carrito Vacío</h4>
                        <button className="btn btn-primary" onClick={() => navigate('/hombre')}>Seguir Comprando</button>
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
                                <div className="text-muted">Paso {pasoActual} de 3</div>
                            </div>
                        </div>
                        
                        <div className="card-body border-bottom">
                            <div className="progress mb-3" style={{ height: '8px' }}>
                                <div className="progress-bar bg-success" style={{ width: `${(pasoActual / 3) * 100}%` }}></div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className={`text-center ${pasoActual >= 1 ? 'text-success fw-bold' : 'text-muted'}`}><div>1</div><small>Información</small></div>
                                <div className={`text-center ${pasoActual >= 2 ? 'text-success fw-bold' : 'text-muted'}`}><div>2</div><small>Envío</small></div>
                                <div className={`text-center ${pasoActual >= 3 ? 'text-success fw-bold' : 'text-muted'}`}><div>3</div><small>Pago</small></div>
                            </div>
                        </div>

                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            {usuario && (
                                <div className="alert alert-success mb-4">
                                    <strong>✅ Usuario:</strong> {usuario.nombre} 
                                    {(usuario.correo || usuario.email) && ` (${usuario.correo || usuario.email})`}
                                </div>
                            )}

                            {pasoActual === 1 && (
                                <div>
                                    <h5 className="mb-4">Información Personal</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input 
                                                type="text"
                                                className={`form-control ${fieldErrors.nombre ? 'is-invalid' : ''}`}
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                placeholder="Nombre completo *"
                                            />
                                            {fieldErrors.nombre && <div className="invalid-feedback">{fieldErrors.nombre}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <input 
                                                type="email"
                                                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email *"
                                            />
                                            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <input 
                                                type="tel"
                                                className={`form-control ${fieldErrors.telefono ? 'is-invalid' : ''}`}
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                placeholder="Teléfono *"
                                            />
                                            {fieldErrors.telefono && <div className="invalid-feedback">{fieldErrors.telefono}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {pasoActual === 2 && (
                                <div>
                                    <h5 className="mb-4">Dirección de Envío</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <input 
                                                type="text"
                                                className={`form-control ${fieldErrors.direccion ? 'is-invalid' : ''}`}
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                placeholder="Dirección *"
                                            />
                                            {fieldErrors.direccion && <div className="invalid-feedback">{fieldErrors.direccion}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <input 
                                                type="text"
                                                className={`form-control ${fieldErrors.ciudad ? 'is-invalid' : ''}`}
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleInputChange}
                                                placeholder="Ciudad *"
                                            />
                                            {fieldErrors.ciudad && <div className="invalid-feedback">{fieldErrors.ciudad}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <input 
                                                type="text"
                                                className={`form-control ${fieldErrors.comuna ? 'is-invalid' : ''}`}
                                                name="comuna"
                                                value={formData.comuna}
                                                onChange={handleInputChange}
                                                placeholder="Comuna *"
                                            />
                                            {fieldErrors.comuna && <div className="invalid-feedback">{fieldErrors.comuna}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <input 
                                                type="text"
                                                className="form-control"
                                                name="codigoPostal"
                                                value={formData.codigoPostal}
                                                onChange={handleInputChange}
                                                placeholder="Código Postal"
                                                maxLength="10"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <textarea 
                                                className="form-control"
                                                name="instruccionesEspeciales" 
                                                value={formData.instruccionesEspeciales} 
                                                onChange={handleInputChange}
                                                rows="3" 
                                                placeholder="Instrucciones especiales" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {pasoActual === 3 && (
                                <div>
                                    <h5 className="mb-4">Método de Pago</h5>
                                    <div className="mb-4">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'tarjeta' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center p-2">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="tarjeta" id="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="tarjeta">💳 Tarjeta</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'transferencia' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center p-2">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="transferencia" id="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="transferencia">🏦 Transferencia</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'efectivo' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center p-2">
                                                        <input type="radio" className="btn-check" name="metodoPago" value="efectivo" id="efectivo" checked={formData.metodoPago === 'efectivo'} onChange={handleInputChange} />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="efectivo">💰 Efectivo</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.metodoPago === 'tarjeta' && (
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <input 
                                                    type="text"
                                                    className={`form-control ${fieldErrors.numeroTarjeta ? 'is-invalid' : ''}`}
                                                    name="numeroTarjeta"
                                                    value={formData.numeroTarjeta}
                                                    onChange={handleInputChange}
                                                    placeholder="Número de tarjeta *"
                                                    maxLength="19"
                                                />
                                                {fieldErrors.numeroTarjeta && <div className="invalid-feedback">{fieldErrors.numeroTarjeta}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input 
                                                    type="text"
                                                    className={`form-control ${fieldErrors.nombreTarjeta ? 'is-invalid' : ''}`}
                                                    name="nombreTarjeta"
                                                    value={formData.nombreTarjeta}
                                                    onChange={handleInputChange}
                                                    placeholder="Nombre en tarjeta *"
                                                />
                                                {fieldErrors.nombreTarjeta && <div className="invalid-feedback">{fieldErrors.nombreTarjeta}</div>}
                                            </div>
                                            <div className="col-md-3">
                                                <input 
                                                    type="text"
                                                    className={`form-control ${fieldErrors.fechaExpiracion ? 'is-invalid' : ''}`}
                                                    name="fechaExpiracion"
                                                    value={formData.fechaExpiracion}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/AA *"
                                                    maxLength="5"
                                                />
                                                {fieldErrors.fechaExpiracion && <div className="invalid-feedback">{fieldErrors.fechaExpiracion}</div>}
                                            </div>
                                            <div className="col-md-3">
                                                <input 
                                                    type="text"
                                                    className={`form-control ${fieldErrors.cvv ? 'is-invalid' : ''}`}
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="CVV *"
                                                    maxLength="4"
                                                />
                                                {fieldErrors.cvv && <div className="invalid-feedback">{fieldErrors.cvv}</div>}
                                            </div>
                                        </div>
                                    )}

                                    {formData.metodoPago === 'transferencia' && (
                                        <div className="alert alert-info">
                                            <h6>Instrucciones transferencia:</h6>
                                            <p className="mb-1">Banco: Santander</p>
                                            <p className="mb-1">Cuenta: 123456789</p>
                                            <p className="mb-0">Titular: EFA Store</p>
                                        </div>
                                    )}

                                    {formData.metodoPago === 'efectivo' && (
                                        <div className="alert alert-warning">
                                            <h6>Pago en efectivo</h6>
                                            <p className="mb-0">Paga al momento de la entrega</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-between mt-4">
                                {pasoActual > 1 ? (
                                    <button className="btn btn-outline-secondary" onClick={pasoAnterior} disabled={loading}>← Anterior</button>
                                ) : (
                                    <button className="btn btn-outline-secondary" onClick={() => navigate('/carrito')}>← Carrito</button>
                                )}
                                
                                {pasoActual < 3 ? (
                                    <button className="btn btn-primary" onClick={siguientePaso}>Siguiente →</button>
                                ) : (
                                    <button className="btn btn-success btn-lg" onClick={procesarPago} disabled={loading}>
                                        {loading ? '🔄 Procesando...' : `🔒 Pagar $${total.toLocaleString()}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-header bg-white"><h5 className="mb-0">Resumen</h5></div>
                        <div className="card-body">
                            <div className="mb-3">
                                <h6>Productos ({carrito.length})</h6>
                                {carrito.map(item => (
                                    <div key={item.id} className="d-flex align-items-center mb-2 pb-2 border-bottom">
                                        <img src={item.image || item.imagen || '/images/placeholder-product.jpg'} alt={item.name || item.nombre} className="rounded me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        <div className="flex-grow-1">
                                            <div className="fw-semibold small">{item.name || item.nombre}</div>
                                            <div className="text-muted small">{item.cantidad || 1} x ${(item.price || item.precio || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="fw-semibold">${((item.price || item.precio || 0) * (item.cantidad || 1)).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-3">
                                <h6>Envío</h6>
                                <div className="d-flex justify-content-between">
                                    <span>{formData.metodoEnvio === 'delivery' ? 'Delivery' : 'Retiro'}</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span>
                                </div>
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                                <div className="d-flex justify-content-between mb-2"><span>Envío</span><span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}</span></div>
                                <div className="d-flex justify-content-between fw-bold fs-5 text-success"><span>Total</span><span>${total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pago;
