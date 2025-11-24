import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1/ventas';

class VentaService {
    async crearVenta(ventaData) {
        try {
            console.log('💰 Creando venta:', ventaData);
            const response = await axios.post(BASE_URL, ventaData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Error creando venta:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Error al procesar la venta' 
            };
        }
    }

    async obtenerVentasPorUsuario(usuarioId) {
        try {
            console.log('🔍 Obteniendo ventas para usuario:', usuarioId);
            const response = await axios.get(`${BASE_URL}/usuario/${usuarioId}`);
            console.log('📦 Respuesta del backend:', response.data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Error obteniendo ventas:', error);
            return { success: false, error: 'Error al obtener las ventas' };
        }
    }

    async obtenerVentaPorId(id) {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: 'Error al obtener la venta' };
        }
    }

    calcularTotalVenta(venta) {
        if (!venta) {
            console.log('❌ Venta es null o undefined');
            return 0;
        }
        
        console.log('🔍 Calculando total para venta:', venta);
        
        // 1. Si ya tiene total directo, usarlo
        if (venta.total !== undefined && venta.total !== null) {
            console.log('✅ Usando total directo:', venta.total);
            return Number(venta.total);
        }
        

        if (venta.items && Array.isArray(venta.items) && venta.items.length > 0) {
            const total = venta.items.reduce((sum, item) => {
                const precio = item.precio || item.precioUnitario || 0;
                const cantidad = item.cantidad || 0;
                const subtotal = item.subtotal || (precio * cantidad);
                console.log(`📦 Item: ${cantidad} x $${precio} = $${subtotal}`);
                return sum + Number(subtotal);
            }, 0);
            console.log('🧮 Total calculado desde items:', total);
            return total;
        }
        

        if (venta.productoVenta && Array.isArray(venta.productoVenta) && venta.productoVenta.length > 0) {
            const total = venta.productoVenta.reduce((sum, item) => {
                const precio = item.precio || item.precioUnitario || 0;
                const cantidad = item.cantidad || 0;
                const subtotal = item.subtotal || (precio * cantidad);
                console.log(`📋 ProductoVenta: ${cantidad} x $${precio} = $${subtotal}`);
                return sum + Number(subtotal);
            }, 0);
            console.log('📊 Total calculado desde productoVenta:', total);
            return total;
        }

        // 4. Si tiene productos directos (otro formato posible)
        if (venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0) {
            const total = venta.productos.reduce((sum, producto) => {
                const precio = producto.precio || producto.precioUnitario || 0;
                const cantidad = producto.cantidad || 0;
                const subtotal = producto.subtotal || (precio * cantidad);
                console.log(`🎁 Producto: ${cantidad} x $${precio} = $${subtotal}`);
                return sum + Number(subtotal);
            }, 0);
            console.log('📦 Total calculado desde productos:', total);
            return total;
        }
        
        console.log('No se pudo calcular el total - Estructura de venta:', {
            tieneItems: venta.items && venta.items.length,
            tieneProductoVenta: venta.productoVenta && venta.productoVenta.length,
            tieneProductos: venta.productos && venta.productos.length,
            ventaCompleta: venta
        });
        return 0;
    }

    // ✅ MEJORADO: Calcular cantidad total de productos en una venta
    calcularCantidadProductos(venta) {
        if (!venta) {
            console.log('Venta es null o undefined');
            return 0;
        }
        
        console.log('Calculando cantidad de productos para venta:', venta);
        
        // 1. Desde items
        if (venta.items && Array.isArray(venta.items) && venta.items.length > 0) {
            const cantidad = venta.items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
            console.log('Cantidad desde items:', cantidad);
            return cantidad;
        }
        
        // 2. Desde productoVenta
        if (venta.productoVenta && Array.isArray(venta.productoVenta) && venta.productoVenta.length > 0) {
            const cantidad = venta.productoVenta.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
            console.log('Cantidad desde productoVenta:', cantidad);
            return cantidad;
        }

        // 3. Desde productos directos
        if (venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0) {
            const cantidad = venta.productos.reduce((sum, producto) => sum + (Number(producto.cantidad) || 0), 0);
            console.log('Cantidad desde productos:', cantidad);
            return cantidad;
        }
        
        console.log('❌o se encontraron productos - Estructura:', {
            tieneItems: venta.items && venta.items.length,
            tieneProductoVenta: venta.productoVenta && venta.productoVenta.length,
            tieneProductos: venta.productos && venta.productos.length
        });
        return 0;
    }

    // ✅ MEJORADO: Procesar ventas para agregar cálculos automáticamente
    procesarVentas(ventas) {
        if (!ventas || !Array.isArray(ventas)) {
            console.log('Ventas no es un array válido:', ventas);
            return [];
        }
        
        console.log(`Procesando ${ventas.length} ventas...`);
        
        const ventasProcesadas = ventas.map((venta, index) => {
            console.log(`\n--- Procesando venta ${index + 1} ---`);
            const totalCalculado = this.calcularTotalVenta(venta);
            const cantidadProductos = this.calcularCantidadProductos(venta);
            
            console.log(`Venta ${index + 1} procesada:`, {
                numeroVenta: venta.numeroVenta,
                totalCalculado: totalCalculado,
                cantidadProductos: cantidadProductos
            });
            
            return {
                ...venta,
                totalCalculado: totalCalculado,
                cantidadProductos: cantidadProductos
            };
        });
        
        console.log('🎉 Todas las ventas procesadas:', ventasProcesadas);
        return ventasProcesadas;
    }

    debugVentas(ventas) {
        if (!ventas || !Array.isArray(ventas)) {
            console.log('No hay ventas para debuguear');
            return;
        }
        
        console.log('DEBUG - Estructura de ventas recibidas:');
        ventas.forEach((venta, index) => {
            console.log(`\n--- Venta ${index + 1} ---`);
            console.log('ID:', venta.id);
            console.log('Número Venta:', venta.numeroVenta);
            console.log('Total:', venta.total);
            console.log('Items:', venta.items);
            console.log('ProductoVenta:', venta.productoVenta);
            console.log('Productos:', venta.productos);
            console.log('Estructura completa:', venta);
        });
    }
}

export default new VentaService();