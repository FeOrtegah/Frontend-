// src/services/VentaService.jsx
const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';

class VentaService {
    // Crear una nueva venta - CON MEJOR DEBUGGING
    async crearVenta(ventaData) {
        try {
            console.log('🔄 Creando nueva venta - Datos recibidos:', ventaData);
            
            // 🔥 VALIDAR DATOS ANTES DE ENVIAR
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
                const errorText = await response.text();
                console.error(`❌ Error ${response.status}:`, errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
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

    // 🔥 NUEVO: Validar y corregir datos antes de enviar
    validarDatosVenta(ventaData) {
        const datos = { ...ventaData };
        
        console.log('🔍 Validando datos de venta:', datos);
        
        // Validar usuario
        if (!datos.usuario || !datos.usuario.id) {
            console.error('❌ Usuario ID es requerido');
            throw new Error('Usuario ID es requerido');
        }
        
        // Validar items del carrito
        if (!datos.items || !Array.isArray(datos.items) || datos.items.length === 0) {
            console.error('❌ El carrito está vacío');
            throw new Error('El carrito está vacío');
        }
        
        // Validar cada item del carrito
        datos.items = datos.items.map((item, index) => {
            if (!item.producto || !item.producto.id) {
                console.error(`❌ Item ${index} no tiene producto ID:`, item);
                throw new Error(`El producto en posición ${index + 1} no tiene ID válido`);
            }
            
            if (!item.cantidad || item.cantidad < 1) {
                console.error(`❌ Item ${index} cantidad inválida:`, item.cantidad);
                throw new Error(`La cantidad del producto en posición ${index + 1} es inválida`);
            }
            
            // Asegurar que tenga precioUnitario
            if (!item.precioUnitario && item.precio) {
                item.precioUnitario = item.precio;
            }
            
            return {
                producto: { id: item.producto.id },
                cantidad: Number(item.cantidad),
                precioUnitario: Number(item.precioUnitario || item.precio || 0),
                subtotal: Number(item.cantidad) * Number(item.precioUnitario || item.precio || 0)
            };
        });
        
        // Validar método de pago
        if (!datos.metodoPago || !datos.metodoPago.id) {
            console.warn('⚠️ Método de pago no especificado, usando default');
            datos.metodoPago = { id: 1 }; // Default: Tarjeta de crédito
        }
        
        // Validar método de envío
        if (!datos.metodoEnvio || !datos.metodoEnvio.id) {
            console.warn('⚠️ Método de envío no especificado, usando default');
            datos.metodoEnvio = { id: 1 }; // Default: Delivery
        }
        
        // Calcular total si no viene
        if (!datos.total) {
            datos.total = datos.items.reduce((sum, item) => 
                sum + (item.subtotal || (item.cantidad * item.precioUnitario)), 0
            );
        }
        
        console.log('✅ Datos validados correctamente:', datos);
        return datos;
    }

    // ... (los otros métodos se mantienen igual)
    async obtenerVentasPorUsuario(usuarioId) {
        try {
            console.log(`🔄 Obteniendo ventas para usuario: ${usuarioId}`);
            const response = await fetch(`${BASE_URL}/ventas`);
            
            if (!response.ok) throw new Error('Error al obtener ventas');
            
            const todasLasVentas = await response.json();
            
            // Filtrar por usuario ID localmente
            const ventasUsuario = todasLasVentas.filter(venta => 
                venta.usuario && venta.usuario.id === parseInt(usuarioId)
            );
            
            console.log(`✅ Ventas filtradas para usuario ${usuarioId}:`, ventasUsuario);
            return { success: true, data: ventasUsuario };
            
        } catch (error) {
            console.error('💥 Error en obtenerVentasPorUsuario:', error);
            return { success: false, error: error.message };
        }
    }

    async obtenerVentaPorId(id) {
        try {
            console.log(`🔄 Obteniendo venta ID: ${id}`);
            const response = await fetch(`${BASE_URL}/ventas/${id}`);
            
            if (!response.ok) throw new Error('Error al obtener la venta');
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('💥 Error en obtenerVentaPorId:', error);
            return { success: false, error: error.message };
        }
    }

    calcularTotalVenta(venta) {
        if (!venta) return 0;
        if (venta.total != null) return Number(venta.total);

        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                return venta[key].reduce((sum, item) => {
                    const precio = item.precio || item.precioUnitario || item.price || 0;
                    const cantidad = item.cantidad || item.quantity || 0;
                    const subtotal = item.subtotal || (precio * cantidad);
                    return sum + Number(subtotal);
                }, 0);
            }
        }
        return 0;
    }

    calcularCantidadProductos(venta) {
        if (!venta) return 0;

        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                return venta[key].reduce((sum, item) => 
                    sum + (Number(item.cantidad) || Number(item.quantity) || 0), 0);
            }
        }
        return 0;
    }

    procesarVentas(ventas) {
        if (!Array.isArray(ventas)) return [];
        return ventas.map(venta => ({
            ...venta,
            totalCalculado: this.calcularTotalVenta(venta),
            cantidadProductos: this.calcularCantidadProductos(venta)
        }));
    }
}

export default new VentaService();
