// src/services/VentaService.jsx
const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';

class VentaService {
    async crearVenta(ventaData) {
        try {
            console.log('🔄 Creando nueva venta - Datos recibidos:', ventaData);
            
            console.log('🔍 DEBUG - Productos en carrito:');
            ventaData.items?.forEach((item, index) => {
                console.log(`Producto ${index}:`, {
                    id: item.producto?.id,
                    nombre: item.nombre || 'Sin nombre',
                    tieneId: !!item.producto?.id,
                    idValido: item.producto?.id && item.producto.id > 0
                });
            });

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
            
            const responseText = await response.text();
            console.log(`📊 Response text: ${responseText}`);
            
            if (!response.ok) {
                console.error(`❌ Error ${response.status}:`, responseText);
                let errorMessage = `Error ${response.status}`;
                
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('❌ Error parseando respuesta:', e);
                throw new Error('Respuesta del servidor inválida');
            }
            
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

    validarDatosVenta(ventaData) {
    console.log('🔍 Validando datos de venta:', ventaData);
    
    if (!ventaData) {
        throw new Error('Los datos de la venta son requeridos');
    }
    
    const datos = { ...ventaData };
    
    if (!datos.usuarioId || isNaN(Number(datos.usuarioId))) {
        throw new Error('Usuario ID es requerido');
    }
    
    datos.usuarioId = Number(datos.usuarioId);
    
    if (!datos.estadoId || isNaN(Number(datos.estadoId))) {
        throw new Error('Estado ID es requerido');
    }
    datos.estadoId = Number(datos.estadoId);
    
    if (!datos.metodoPagoId || isNaN(Number(datos.metodoPagoId))) {
        throw new Error('Método de pago ID es requerido');
    }
    datos.metodoPagoId = Number(datos.metodoPagoId);
    
    if (!datos.metodoEnvioId || isNaN(Number(datos.metodoEnvioId))) {
        throw new Error('Método de envío ID es requerido');
    }
    datos.metodoEnvioId = Number(datos.metodoEnvioId);
    
    if (!datos.items || !Array.isArray(datos.items) || datos.items.length === 0) {
        throw new Error('El carrito está vacío');
    }
    
    const itemsValidos = datos.items
        .filter(item => {
            const tieneId = item.productoId && Number(item.productoId) > 0;
            if (!tieneId) {
                console.warn('⚠️ Producto sin ID válido, excluyendo:', item);
            }
            return tieneId;
        })
        .map((item, index) => {
            const productoId = Number(item.productoId);
            const cantidad = Number(item.cantidad || 1);
            const precioUnitario = Number(item.precioUnitario || item.precio || 0);
            const subtotal = cantidad * precioUnitario;
            
            if (cantidad < 1) {
                throw new Error(`La cantidad del producto en posición ${index + 1} debe ser al menos 1`);
            }
            
            if (precioUnitario < 0) {
                throw new Error(`El precio del producto en posición ${index + 1} es inválido`);
            }
            
            return {
                productoId: productoId,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                subtotal: subtotal
            };
        });

    if (itemsValidos.length === 0) {
        throw new Error('No hay productos válidos en el carrito');
    }

    datos.items = itemsValidos;
    
    // Calcular total
    if (!datos.total || datos.total === 0) {
        datos.total = datos.items.reduce((sum, item) => sum + item.subtotal, 0);
    }
    datos.total = Number(datos.total);
    
    // Validar numero de venta
    if (!datos.numeroVenta) {
        datos.numeroVenta = `VEN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    }
    
    // Asegurar direccion de envío
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

    async obtenerVentasPorUsuario(usuarioId) {
        try {
            if (!usuarioId || isNaN(Number(usuarioId))) {
                throw new Error('ID de usuario inválido');
            }
            
            const response = await fetch(`${BASE_URL}/ventas`);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} al obtener ventas`);
            }
            
            const responseText = await response.text();
            const todasLasVentas = JSON.parse(responseText);
            
            const ventasUsuario = todasLasVentas.filter(venta => {
                if (!venta.usuario) return false;
                const ventaUsuarioId = venta.usuario.id || venta.usuario;
                return Number(ventaUsuarioId) === Number(usuarioId);
            });
            
            return { success: true, data: ventasUsuario };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async obtenerVentaPorId(id) {
        try {
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
            
            const responseText = await response.text();
            const data = JSON.parse(responseText);
            
            return { success: true, data };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    calcularTotalVenta(venta) {
        if (!venta) return 0;
        
        if (venta.total != null && !isNaN(Number(venta.total))) {
            return Number(venta.total);
        }

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

    procesarVentas(ventas) {
        if (!Array.isArray(ventas)) return [];
        return ventas.map(venta => {
            if (!venta) return null;
            return {
                ...venta,
                totalCalculado: this.calcularTotalVenta(venta),
                cantidadProductos: this.calcularCantidadProductos(venta),
                fechaFormateada: venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-CL') : 'N/A',
                estadoTexto: this.obtenerEstadoTexto(venta.estado?.id || venta.estado)
            };
        }).filter(venta => venta !== null);
    }

    obtenerEstadoTexto(estadoId) {
        const estados = {
            1: 'Pendiente', 2: 'Confirmada', 3: 'En preparación',
            4: 'Enviada', 5: 'Entregada', 6: 'Cancelada'
        };
        return estados[estadoId] || 'Desconocido';
    }
    
    obtenerFechaVenta(venta) {
        if (!venta) return 'Fecha no disponible';
        
        const posiblesFechas = [
            venta.fechaVenta,
            venta.fecha,
            venta.fechaCreacion,
            venta.createdAt
        ];
        
        for (let fecha of posiblesFechas) {
            if (fecha) {
                try {
                    const fechaObj = new Date(fecha);
                    if (!isNaN(fechaObj.getTime())) {
                        return fechaObj.toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                } catch (error) {
                    console.warn('Error formateando fecha:', error);
                }
            }
        }
        
        return 'Fecha no disponible';
    }

    obtenerMetodoPagoTexto(metodoPagoId) {
        const metodos = {
            1: 'Tarjeta',
            2: 'Transferencia', 
            3: 'Efectivo'
        };
        return metodos[metodoPagoId] || 'No especificado';
    }

    obtenerCantidadProductosDetallada(venta) {
        if (!venta) return '0 productos';
        
        const cantidad = this.calcularCantidadProductos(venta);
        return `${cantidad} producto${cantidad !== 1 ? 's' : ''}`;
    }

    obtenerResumenVenta(venta) {
        if (!venta) return null;
        
        return {
            numeroVenta: venta.numeroVenta || 'N/A',
            fecha: this.obtenerFechaVenta(venta),
            total: this.calcularTotalVenta(venta),
            cantidadProductos: this.calcularCantidadProductos(venta),
            estado: this.obtenerEstadoTexto(venta.estado?.id || venta.estado),
            metodoPago: this.obtenerMetodoPagoTexto(venta.metodoPago?.id || venta.metodoPago)
        };
    }
}

export default new VentaService();
