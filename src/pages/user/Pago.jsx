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

    // Validaciones para campos numéricos
    const soloNumeros = (valor) => /^\d*$/.test(valor);

    // Formatear número de tarjeta con espacios cada 4 dígitos
    const formatearNumeroTarjeta = (valor) => {
        const soloNumeros = valor.replace(/\D/g, '');
        return soloNumeros.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    };

    // Validar fecha de expiración (MM/AA)
    const validarFechaExpiracion = (valor) => {
        if (!/^\d{0,2}\/?\d{0,2}$/.test(valor)) return false;
        
        if (valor.length >= 2) {
            const mes = parseInt(valor.substring(0, 2));
            if (mes < 1 || mes > 12) return false;
        }
        
        return true;
    };

    // Formatear fecha de expiración
    const formatearFechaExpiracion = (valor) => {
        const soloNumeros = valor.replace(/\D/g, '');
        if (soloNumeros.length <= 2) return soloNumeros;
        return soloNumeros.substring(0, 2) + '/' + soloNumeros.substring(2, 4);
    };

    // Validar CVV (solo 3-4 dígitos)
    const validarCVV = (valor) => /^\d{0,4}$/.test(valor);

    // Validar que solo letras y espacios para nombre
    const soloLetrasYEspacios = (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor);

    // Validar email
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validar teléfono (solo números y +)
    const validarTelefono = (telefono) => /^[\d+\-\s()]*$/.test(telefono);

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
        let error = '';

        // Aplicar validaciones específicas por campo
        switch (name) {
            case 'numeroTarjeta':
                valorProcesado = formatearNumeroTarjeta(value);
                if (valorProcesado.replace(/\s/g, '').length !== 16 && valorProcesado) {
                    error = 'El número de tarjeta debe tener 16 dígitos';
                }
                break;

            case 'fechaExpiracion':
                if (!validarFechaExpiracion(value)) return;
                valorProcesado = formatearFechaExpiracion(value);
                
                // Validar que no esté expirada
                if (valorProcesado.length === 5) {
                    const [mes, año] = valorProcesado.split('/');
                    const fechaExpiracion = new Date(2000 + parseInt(año), parseInt(mes) - 1);
                    const hoy = new Date();
                    if (fechaExpiracion < hoy) {
                        error = 'La tarjeta está expirada';
                    }
                }
                break;

            case 'cvv':
                if (!validarCVV(value)) return;
                valorProcesado = value.substring(0, 4);
                if (valorProcesado.length < 3 && valorProcesado) {
                    error = 'El CVV debe tener 3 o 4 dígitos';
                }
                break;

            case 'nombreTarjeta':
                if (!soloLetrasYEspacios(value)) return;
                break;

            case 'telefono':
                if (!validarTelefono(value)) return;
                break;

            case 'email':
                if (value && !validarEmail(value)) {
                    error = 'Ingresa un email válido';
                }
                break;

            case 'nombre':
                if (!soloLetrasYEspacios(value)) return;
                break;

            case 'codigoPostal':
                if (!soloNumeros(value)) return;
                valorProcesado = value.substring(0, 10);
                break;

            default:
                break;
        }

        setFormData(prev => ({ ...prev, [name]: valorProcesado }));
        
        // Actualizar errores del campo
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validarPaso1 = () => {
        const errors = {};
        
        if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
        if (!formData.email.trim()) errors.email = 'El email es requerido';
        else if (!validarEmail(formData.email)) errors.email = 'Email inválido';
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

    // Función para renderizar campo con validación
    const CampoConValidacion = ({ name, placeholder, type = 'text', maxLength, className = '' }) => (
        <div className={className}>
            <input 
                type={type}
                className={`form-control ${fieldErrors[name] ? 'is-invalid' : ''}`}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                maxLength={maxLength}
            />
            {fieldErrors[name] && <div className="invalid-feedback">{fieldErrors[name]}</div>}
        </div>
    );

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
                                        <CampoConValidacion 
                                            name="nombre"
                                            placeholder="Nombre completo *"
                                            className="col-md-6"
                                        />
                                        <CampoConValidacion 
                                            name="email"
                                            placeholder="Email *"
                                            type="email"
                                            className="col-md-6"
                                        />
                                        <CampoConValidacion 
                                            name="telefono"
                                            placeholder="Teléfono *"
                                            type="tel"
                                            className="col-md-6"
                                        />
                                    </div>
                                </div>
                            )}

                            {pasoActual === 2 && (
                                <div>
                                    <h5 className="mb-4">Dirección de Envío</h5>
                                    <div className="row g-3">
                                        <CampoConValidacion 
                                            name="direccion"
                                            placeholder="Dirección *"
                                            className="col-12"
                                        />
                                        <CampoConValidacion 
                                            name="ciudad"
                                            placeholder="Ciudad *"
                                            className="col-md-4"
                                        />
                                        <CampoConValidacion 
                                            name="comuna"
                                            placeholder="Comuna *"
                                            className="col-md-4"
                                        />
                                        <CampoConValidacion 
                                            name="codigoPostal"
                                            placeholder="Código Postal"
                                            className="col-md-4"
                                            maxLength="10"
                                        />
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
                                            <CampoConValidacion 
                                                name="numeroTarjeta"
                                                placeholder="Número de tarjeta *"
                                                className="col-12"
                                                maxLength="19"
                                            />
                                            <CampoConValidacion 
                                                name="nombreTarjeta"
                                                placeholder="Nombre en tarjeta *"
                                                className="col-md-6"
                                            />
                                            <CampoConValidacion 
                                                name="fechaExpiracion"
                                                placeholder="MM/AA *"
                                                className="col-md-3"
                                                maxLength="5"
                                            />
                                            <CampoConValidacion 
                                                name="cvv"
                                                placeholder="CVV *"
                                                className="col-md-3"
                                                maxLength="4"
                                            />
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
