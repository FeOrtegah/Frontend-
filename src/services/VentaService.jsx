// src/services/VentaService.jsx
const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';

class VentaService {
    // Crear una nueva venta - CON MEJOR DEBUGGING
    async crearVenta(ventaData) {
        try {
            console.log('🔄 Creando nueva venta - Datos recibidos:', ventaData);
            
            // 🔥 CORREGIDO: Validar datos antes de enviar
            const datosValidados = this.validarDatosVenta(ventaData);
            console.log('✅ Datos validados para enviar:', datosValidados);
            
            const response = await fetch(`${BASE_URL}/ventas`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosValidados)
            });
            
            console.log(`📊 Response status: ${response.status}`);
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.error(`❌ Error del servidor:`, errorData);
                } catch (e) {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                    console.error(`❌ Error ${response.status}:`, errorText);
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log('✅ Venta creada exitosamente:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('💥 Error en crearVenta:', error);
            return { 
                success: false, 
                error: error.message || 'Error al procesar la venta' 
            };
        }
    }

    // 🔥 CORREGIDO: Validar y corregir datos antes de enviar
    validarDatosVenta(ventaData) {
        console.log('🔍 Validando datos de venta:', ventaData);
        
        // Validar que ventaData existe
        if (!ventaData) {
            throw new Error('Los datos de la venta son requeridos');
        }
        
        const datos = { ...ventaData };
        
        // 🔥 CORREGIDO: Validar usuario de forma más robusta
        if (!datos.usuario) {
            console.error('❌ Usuario es requerido');
            throw new Error('Usuario es requerido');
        }
        
        if (!datos.usuario.id || isNaN(Number(datos.usuario.id))) {
            console.error('❌ Usuario ID es inválido:', datos.usuario.id);
            throw new Error('Usuario ID es inválido');
        }
        
        // 🔥 CORREGIDO: Asegurar que el usuario ID sea número
        datos.usuario.id = Number(datos.usuario.id);
        
        // Validar items del carrito
        if (!datos.items || !Array.isArray(datos.items) || datos.items.length === 0) {
            console.error('❌ El carrito está vacío');
            throw new Error('El carrito está vacío');
        }
        
        // 🔥 CORREGIDO: Validar cada item del carrito de forma más robusta
        datos.items = datos.items.map((item, index) => {
            if (!item) {
                throw new Error(`El item en posición ${index + 1} es inválido`);
            }
            
            if (!item.producto) {
                console.error(`❌ Item ${index} no tiene producto:`, item);
                throw new Error(`El producto en posición ${index + 1} no es válido`);
            }
            
            if (!item.producto.id || isNaN(Number(item.producto.id))) {
                console.error(`❌ Item ${index} no tiene producto ID válido:`, item.producto.id);
                throw new Error(`El producto en posición ${index + 1} no tiene ID válido`);
            }
            
            // 🔥 CORREGIDO: Asegurar que las cantidades y precios sean números
            const cantidad = Number(item.cantidad || 1);
            const precioUnitario = Number(item.precioUnitario || item.precio || 0);
            const subtotal = cantidad * precioUnitario;
            
            if (cantidad < 1) {
                console.error(`❌ Item ${index} cantidad inválida:`, cantidad);
                throw new Error(`La cantidad del producto en posición ${index + 1} debe ser al menos 1`);
            }
            
            if (precioUnitario < 0) {
                console.error(`❌ Item ${index} precio inválido:`, precioUnitario);
                throw new Error(`El precio del producto en posición ${index + 1} es inválido`);
            }
            
            return {
                producto: { 
                    id: Number(item.producto.id) // 🔥 Asegurar que sea número
                },
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                subtotal: subtotal
            };
        });
        
        // 🔥 CORREGIDO: Validar método de pago
        if (!datos.metodoPago) {
            console.warn('⚠️ Método de pago no especificado, usando default');
            datos.metodoPago = { id: 1 }; // Default: Tarjeta de crédito
        } else if (!datos.metodoPago.id) {
            datos.metodoPago.id = 1;
        }
        datos.metodoPago.id = Number(datos.metodoPago.id);
        
        // 🔥 CORREGIDO: Validar método de envío
        if (!datos.metodoEnvio) {
            console.warn('⚠️ Método de envío no especificado, usando default');
            datos.metodoEnvio = { id: 1 }; // Default: Delivery
        } else if (!datos.metodoEnvio.id) {
            datos.metodoEnvio.id = 1;
        }
        datos.metodoEnvio.id = Number(datos.metodoEnvio.id);
        
        // 🔥 CORREGIDO: Validar estado
        if (!datos.estado) {
            console.warn('⚠️ Estado no especificado, usando default');
            datos.estado = { id: 1 }; // Default: Pendiente
        } else if (!datos.estado.id) {
            datos.estado.id = 1;
        }
        datos.estado.id = Number(datos.estado.id);
        
        // 🔥 CORREGIDO: Calcular total de forma más precisa
        if (!datos.total || datos.total === 0) {
            datos.total = datos.items.reduce((sum, item) => 
                sum + (item.subtotal || (item.cantidad * item.precioUnitario)), 0
            );
        }
        datos.total = Number(datos.total);
        
        // 🔥 CORREGIDO: Validar número de venta
        if (!datos.numeroVenta) {
            datos.numeroVenta = `VEN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        }
        
        // 🔥 CORREGIDO: Asegurar que la dirección de envío tenga estructura correcta
        if (datos.direccionEnvio) {
            datos.direccionEnvio = {
                direccion: datos.direccionEnvio.direccion || '',
                ciudad: datos.direccionEnvio.ciudad || '',
                comuna: datos.direccionEnvio.comuna || '',
                codigoPostal: datos.direccionEnvio.codigoPostal || '',
                instrucciones: datos.direccionEnvio.instrucciones || ''
            };
        }
        
        console.log('✅ Datos validados correctamente:', datos);
        return datos;
    }

    // 🔥 CORREGIDO: Obtener ventas por usuario con mejor manejo de errores
    async obtenerVentasPorUsuario(usuarioId) {
        try {
            console.log(`🔄 Obteniendo ventas para usuario: ${usuarioId}`);
            
            // Validar usuarioId
            if (!usuarioId || isNaN(Number(usuarioId))) {
                throw new Error('ID de usuario inválido');
            }
            
            const response = await fetch(`${BASE_URL}/ventas`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} al obtener ventas`);
            }
            
            const todasLasVentas = await response.json();
            
            // 🔥 CORREGIDO: Filtrar por usuario ID de forma más robusta
            const ventasUsuario = todasLasVentas.filter(venta => {
                if (!venta.usuario) return false;
                
                // Manejar diferentes estructuras de usuario
                const ventaUsuarioId = venta.usuario.id || venta.usuario;
                return Number(ventaUsuarioId) === Number(usuarioId);
            });
            
            console.log(`✅ Ventas filtradas para usuario ${usuarioId}:`, ventasUsuario);
            return { success: true, data: ventasUsuario };
            
        } catch (error) {
            console.error('💥 Error en obtenerVentasPorUsuario:', error);
            return { success: false, error: error.message };
        }
    }

    // 🔥 CORREGIDO: Obtener venta por ID con mejor manejo de errores
    async obtenerVentaPorId(id) {
        try {
            console.log(`🔄 Obteniendo venta ID: ${id}`);
            
            if (!id || isNaN(Number(id))) {
                throw new Error('ID de venta inválido');
            }
            
            const response = await fetch(`${BASE_URL}/ventas/${id}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Venta no encontrada');
                }
                throw new Error(`Error ${response.status} al obtener la venta`);
            }
            
            const data = await response.json();
            console.log('✅ Venta obtenida:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('💥 Error en obtenerVentaPorId:', error);
            return { success: false, error: error.message };
        }
    }

    // 🔥 CORREGIDO: Calcular total de venta de forma más robusta
    calcularTotalVenta(venta) {
        if (!venta) return 0;
        
        // Si ya tiene total, usarlo
        if (venta.total != null && !isNaN(Number(venta.total))) {
            return Number(venta.total);
        }

        // Buscar en diferentes estructuras de items
        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key] && Array.isArray(venta[key]) && venta[key].length > 0) {
                const total = venta[key].reduce((sum, item) => {
                    if (!item) return sum;
                    
                    const precio = Number(item.precio || item.precioUnitario || item.price || 0);
                    const cantidad = Number(item.cantidad || item.quantity || 0);
                    const subtotal = Number(item.subtotal || (precio * cantidad));
                    
                    return sum + (isNaN(subtotal) ? 0 : subtotal);
                }, 0);
                
                return isNaN(total) ? 0 : total;
            }
        }
        return 0;
    }

    // 🔥 CORREGIDO: Calcular cantidad de productos de forma más robusta
    calcularCantidadProductos(venta) {
        if (!venta) return 0;

        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key] && Array.isArray(venta[key]) && venta[key].length > 0) {
                const cantidad = venta[key].reduce((sum, item) => {
                    if (!item) return sum;
                    const cant = Number(item.cantidad) || Number(item.quantity) || 0;
                    return sum + (isNaN(cant) ? 0 : cant);
                }, 0);
                
                return isNaN(cantidad) ? 0 : cantidad;
            }
        }
        return 0;
    }

    // 🔥 CORREGIDO: Procesar ventas con validación mejorada
    procesarVentas(ventas) {
        if (!Array.isArray(ventas)) {
            console.warn('⚠️ procesarVentas: ventas no es un array', ventas);
            return [];
        }
        
        return ventas.map(venta => {
            if (!venta) return null;
            
            return {
                ...venta,
                totalCalculado: this.calcularTotalVenta(venta),
                cantidadProductos: this.calcularCantidadProductos(venta),
                // 🔥 NUEVO: Agregar información útil para la UI
                fechaFormateada: venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-CL') : 'N/A',
                estadoTexto: this.obtenerEstadoTexto(venta.estado?.id || venta.estado)
            };
        }).filter(venta => venta !== null); // Filtrar ventas nulas
    }

    // 🔥 NUEVO: Método para obtener texto del estado
    obtenerEstadoTexto(estadoId) {
        const estados = {
            1: 'Pendiente',
            2: 'Confirmada', 
            3: 'En preparación',
            4: 'Enviada',
            5: 'Entregada',
            6: 'Cancelada'
        };
        return estados[estadoId] || 'Desconocido';
    }

    // 🔥 NUEVO: Método para actualizar estado de venta
    async actualizarEstadoVenta(ventaId, nuevoEstadoId) {
        try {
            console.log(`🔄 Actualizando estado de venta ${ventaId} a ${nuevoEstadoId}`);
            
            const response = await fetch(`${BASE_URL}/ventas/${ventaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: { id: Number(nuevoEstadoId) }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} al actualizar venta`);
            }
            
            const data = await response.json();
            console.log('✅ Estado de venta actualizado:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('💥 Error en actualizarEstadoVenta:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new VentaService();
