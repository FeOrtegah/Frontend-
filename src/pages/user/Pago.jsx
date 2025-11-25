import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VentaService from '../../services/VentaService';
import 'animate.css'; // 🔥 IMPORTANTE: Agregar esta importación

const Pago = ({ carrito, setCarrito, user }) => {
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
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    // 🔥 CORREGIDO: Función mejorada para validar ID de usuario
    const isValidUserId = (userId) => {
        if (userId === null || userId === undefined) return false;
        if (typeof userId === 'string') {
            if (userId === 'N/A' || userId === 'null' || userId === 'undefined' || userId.trim() === '') return false;
        }
        
        const num = Number(userId);
        return !isNaN(num) && num > 0;
    };

    // 🔥 CORREGIDO: Función mejorada para extraer ID real del usuario
    const extractValidUserId = (usuarioData) => {
        console.log('🔍 Extrayendo ID válido de usuario:', usuarioData);
        
        if (!usuarioData) {
            console.error('❌ Datos de usuario no definidos');
            return null;
        }

        // Buscar ID en diferentes ubicaciones posibles
        const posiblesIds = [
            usuarioData.id,
            usuarioData.usuario?.id,
            usuarioData.data?.id,
            usuarioData.user?.id,
            usuarioData.userId,
            usuarioData.usuarioId
        ].filter(id => id !== undefined && id !== null);
        
        for (const id of posiblesIds) {
            if (isValidUserId(id)) {
                console.log('✅ ID válido encontrado:', id);
                return Number(id);
            }
        }
        
        console.error('❌ No se encontró ID válido en:', usuarioData);
        return null;
    };

    // 🔥 CORREGIDO: Función para asegurar número
    const ensureNumber = (value) => {
        if (value === null || value === undefined || value === 'N/A') {
            console.warn('⚠️ Valor inválido para conversión, usando 0:', value);
            return 0;
        }
        
        const num = Number(value);
        if (isNaN(num)) {
            console.warn('⚠️ Valor no numérico, usando 0:', value);
            return 0;
        }
        
        return num;
    };

    // 🔥 CORREGIDO: useEffect mejorado para cargar usuario
    useEffect(() => {
        console.log('🔄 Iniciando carga de usuario...');
        
        const loadUser = () => {
            try {
                // Intentar todas las fuentes posibles
                const usuarioDeProps = user;
                const usuarioDeLocalStorage = JSON.parse(localStorage.getItem('user') || 'null');
                const usuarioDeSessionStorage = JSON.parse(sessionStorage.getItem('usuarioActivo') || 'null');
                
                console.log('📋 Fuentes de usuario:');
                console.log('- Props:', usuarioDeProps);
                console.log('- LocalStorage:', usuarioDeLocalStorage);
                console.log('- SessionStorage:', usuarioDeSessionStorage);

                // Orden de prioridad: props -> localStorage -> sessionStorage
                let usuarioEncontrado = usuarioDeProps || usuarioDeLocalStorage || usuarioDeSessionStorage;
                
                if (!usuarioEncontrado) {
                    console.error('❌ No se encontró usuario en ninguna fuente');
                    setError('No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.');
                    return;
                }

                console.log('✅ Usuario encontrado:', usuarioEncontrado);
                
                // 🔥 CORREGIDO: Extraer ID válido
                const idValido = extractValidUserId(usuarioEncontrado);
                
                if (!idValido) {
                    console.error('❌ No se pudo encontrar ID válido para el usuario');
                    setError('Error: ID de usuario inválido. Por favor, inicia sesión nuevamente.');
                    
                    // Limpiar datos inválidos
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('usuarioActivo');
                    return;
                }

                // 🔥 CORREGIDO: Crear usuario con ID válido y datos completos
                const usuarioCorregido = {
                    ...usuarioEncontrado,
                    id: idValido,
                    nombre: usuarioEncontrado.nombre || '',
                    correo: usuarioEncontrado.correo || usuarioEncontrado.email || '',
                    email: usuarioEncontrado.email || usuarioEncontrado.correo || '',
                    telefono: usuarioEncontrado.telefono || ''
                };
                
                console.log('✅ Usuario corregido con ID válido:', usuarioCorregido);
                setUsuario(usuarioCorregido);
                
                // Rellenar automáticamente el formulario
                setFormData(prev => ({
                    ...prev,
                    nombre: usuarioCorregido.nombre || '',
                    email: usuarioCorregido.correo || usuarioCorregido.email || '',
                    telefono: usuarioCorregido.telefono || ''
                }));

            } catch (error) {
                console.error('💥 Error al cargar usuario:', error);
                setError('Error al cargar información del usuario. Por favor, recarga la página.');
            }
        };

        loadUser();
    }, [user]);

    // 🔥 CORREGIDO: Calcular totales de forma segura
    const calcularTotales = () => {
        try {
            const subtotal = carrito.reduce((sum, item) => {
                if (!item) return sum;
                const precio = Number(item.price || item.precio || 0);
                const cantidad = Number(item.cantidad || 1);
                return sum + (precio * cantidad);
            }, 0);
            
            const costoEnvio = formData.metodoEnvio === 'delivery' ? 3500 : 0;
            const total = subtotal + costoEnvio;
            
            return { subtotal, costoEnvio, total };
        } catch (error) {
            console.error('Error calculando totales:', error);
            return { subtotal: 0, costoEnvio: 0, total: 0 };
        }
    };

    const { subtotal, costoEnvio, total } = calcularTotales();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarPaso1 = () => {
        return formData.nombre.trim() && formData.email.trim() && formData.telefono.trim();
    };

    const validarPaso2 = () => {
        return formData.direccion.trim() && formData.ciudad.trim() && formData.comuna.trim();
    };

    const validarPaso3 = () => {
        if (formData.metodoPago === 'tarjeta') {
            const tarjetaValida = formData.numeroTarjeta.trim().replace(/\s/g, '').length >= 15;
            const nombreValido = formData.nombreTarjeta.trim().length >= 3;
            const fechaValida = formData.fechaExpiracion.trim().length === 5;
            const cvvValido = formData.cvv.trim().length >= 3;
            
            return tarjetaValida && nombreValido && fechaValida && cvvValido;
        }
        return true;
    };

    const siguientePaso = () => {
        setError('');
        
        switch(pasoActual) {
            case 1:
                if (!validarPaso1()) {
                    setError('Por favor completa toda la información personal');
                    return;
                }
                break;
            case 2:
                if (!validarPaso2()) {
                    setError('Por favor completa la dirección de envío');
                    return;
                }
                break;
            default:
                break;
        }
        
        setPasoActual(pasoActual + 1);
    };

    const pasoAnterior = () => {
        setError('');
        setPasoActual(pasoActual - 1);
    };

    // 🔥 CORREGIDO: Función de procesamiento de pago mejorada
    const procesarPago = async () => {
        if (pasoActual === 3 && !validarPaso3()) {
            setError('Por favor completa la información de pago');
            return;
        }

        // Validación de usuario
        if (!usuario || !isValidUserId(usuario.id)) {
            setError('No se encontró información válida del usuario. Por favor, inicia sesión nuevamente.');
            setTimeout(() => navigate('/auth'), 3000);
            return;
        }

        // Validación de carrito
        if (!carrito || carrito.length === 0) {
            setError('El carrito está vacío');
            return;
        }

        const carritoValido = carrito.every(item => 
            item && 
            item.id && 
            isValidUserId(item.id) && 
            (item.price || item.precio)
        );
        
        if (!carritoValido) {
            setError('El carrito contiene productos inválidos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 🔥 CORREGIDO: Estructura de datos validada
            const usuarioId = ensureNumber(usuario.id);
            console.log('✅ Usuario ID final para venta:', usuarioId);

            const ventaData = {
                numeroVenta: `VEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                usuario: { 
                    id: usuarioId
                },
                estado: { 
                    id: 1 // PENDIENTE
                },
                metodoPago: { 
                    id: formData.metodoPago === 'tarjeta' ? 1 : 
                        formData.metodoPago === 'transferencia' ? 2 : 3 
                },
                metodoEnvio: { 
                    id: formData.metodoEnvio === 'delivery' ? 1 : 2 
                },
                items: carrito.map(item => ({
                    producto: { 
                        id: ensureNumber(item.id)
                    },
                    cantidad: ensureNumber(item.cantidad || 1),
                    precioUnitario: parseFloat(item.price || item.precio || 0),
                    subtotal: parseFloat((item.price || item.precio || 0) * (item.cantidad || 1))
                })),
                total: parseFloat(total),
                direccionEnvio: {
                    direccion: formData.direccion.trim(),
                    ciudad: formData.ciudad.trim(),
                    comuna: formData.comuna.trim(),
                    codigoPostal: formData.codigoPostal.trim(),
                    instrucciones: formData.instruccionesEspeciales.trim()
                },
                cliente: {
                    nombre: formData.nombre.trim(),
                    email: formData.email.trim(),
                    telefono: formData.telefono.trim()
                }
            };

            console.log('📤 Enviando datos de venta:', ventaData);

            const resultado = await VentaService.crearVenta(ventaData);

            if (resultado.success) {
                console.log('✅ Venta creada exitosamente:', resultado.data);
                
                // Limpiar carrito y datos temporales
                setCarrito([]);
                localStorage.removeItem('carrito');
                localStorage.removeItem('carritoParaPago');
                localStorage.removeItem('totalParaPago');
                
                // Redirigir a confirmación
                navigate('/confirmacion', { 
                    state: { 
                        venta: resultado.data,
                        carrito: carrito,
                        total: total,
                        datosEnvio: formData,
                        usuario: usuario
                    } 
                });
            } else {
                console.error('❌ Error del servicio:', resultado);
                const mensajeError = resultado.error?.message || resultado.error || 'Error al procesar el pago';
                setError(mensajeError);
            }

        } catch (err) {
            console.error('💥 Error en procesarPago:', err);
            setError(err.message || 'Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 CORREGIDO: Para las imágenes, usar una ruta local
    const getImageSrc = (imageUrl) => {
        if (!imageUrl || imageUrl.includes('placeholder.com') || imageUrl.includes('undefined')) {
            return '/images/placeholder-product.jpg';
        }
        return imageUrl;
    };

    // 🔥 CORREGIDO: Renderizado condicional mejorado
    if (!carrito || carrito.length === 0) {
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

    // 🔥 CORREGIDO: Validación de usuario con mensajes más claros
    if (error && !usuario) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <div className="mb-4">
                            <i className="bi bi-exclamation-triangle" style={{ fontSize: '4rem', color: '#dc3545' }}></i>
                        </div>
                        <h2>Error de Autenticación</h2>
                        <p className="text-muted mb-3">
                            {error}
                        </p>
                        <p className="text-muted mb-4">
                            Por favor, inicia sesión nuevamente.
                        </p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button 
                                className="btn btn-primary btn-lg" 
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    sessionStorage.removeItem('usuarioActivo');
                                    navigate('/auth');
                                }}
                            >
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Iniciar Sesión
                            </button>
                            <button 
                                className="btn btn-outline-secondary btn-lg" 
                                onClick={() => window.location.reload()}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Recargar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 🔥 CORREGIDO: Mostrar loading mientras se carga el usuario
    if (!usuario) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow">
                    <div className="card-body py-5">
                        <div className="mb-4">
                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                        <h2>Cargando información...</h2>
                        <p className="text-muted mb-4">
                            Verificando tu sesión de usuario...
                        </p>
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

                            {/* Información del usuario actual */}
                            {usuario && (
                                <div className="alert alert-info d-flex align-items-center mb-4">
                                    <i className="bi bi-person-check me-2"></i>
                                    <div>
                                        <strong>Comprador identificado:</strong> {usuario.nombre} 
                                        {(usuario.correo || usuario.email) && ` (${usuario.correo || usuario.email})`}
                                    </div>
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
                                                placeholder="Ej: Juan Pérez"
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
                                                placeholder="ejemplo@correo.com"
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
                                                placeholder="+56 9 1234 5678"
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
                                                placeholder="Santiago"
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
                                                placeholder="Providencia"
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
                                                placeholder="7500000"
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
                                                    <div className="card-body text-center p-2">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="tarjeta"
                                                            id="tarjeta"
                                                            checked={formData.metodoPago === 'tarjeta'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="tarjeta">
                                                            <i className="bi bi-credit-card me-2"></i>
                                                            Tarjeta
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'transferencia' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center p-2">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="transferencia"
                                                            id="transferencia"
                                                            checked={formData.metodoPago === 'transferencia'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="transferencia">
                                                            <i className="bi bi-bank me-2"></i>
                                                            Transferencia
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className={`card border ${formData.metodoPago === 'efectivo' ? 'border-primary' : ''}`}>
                                                    <div className="card-body text-center p-2">
                                                        <input
                                                            type="radio"
                                                            className="btn-check"
                                                            name="metodoPago"
                                                            value="efectivo"
                                                            id="efectivo"
                                                            checked={formData.metodoPago === 'efectivo'}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label className="btn btn-outline-primary w-100 mb-0" htmlFor="efectivo">
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                                Pagar ${total.toLocaleString('es-CL')}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
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
                                            src={getImageSrc(item.image || item.imagen)} 
                                            alt={item.name || item.nombre}
                                            className="rounded me-3"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder-product.jpg';
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-semibold small">{item.name || item.nombre}</div>
                                            <div className="text-muted small">
                                                {item.cantidad || 1} x ${(item.price || item.precio || 0).toLocaleString('es-CL')}
                                            </div>
                                        </div>
                                        <div className="fw-semibold">
                                            ${((item.price || item.precio || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-3">
                                <h6>Método de envío</h6>
                                <div className="d-flex justify-content-between">
                                    <span>{formData.metodoEnvio === 'delivery' ? 'Delivery a domicilio' : 'Retiro en tienda'}</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString('es-CL')}`}</span>
                                </div>
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Envío</span>
                                    <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString('es-CL')}`}</span>
                                </div>
                                <div className="d-flex justify-content-between fw-bold fs-5 text-success">
                                    <span>Total</span>
                                    <span>${total.toLocaleString('es-CL')}</span>
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
