const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';

class VentaService {

    async obtenerVentasPorUsuario(usuarioId) {
        try {
            console.log(`Obteniendo ventas para usuario: ${usuarioId}`);
            

            const response = await fetch(`${BASE_URL}/ventas?usuarioId=${usuarioId}`);
            
            console.log(`Response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Ventas obtenidas por query:`, data);
                return { success: true, data };
            }
            
            console.log('Intentando obtener todas las ventas...');
            const allVentasResponse = await fetch(`${BASE_URL}/ventas`);
            
            if (!allVentasResponse.ok) {
                throw new Error(`Error ${allVentasResponse.status} al obtener ventas`);
            }
            
            const todasLasVentas = await allVentasResponse.json();
            

            const ventasUsuario = todasLasVentas.filter(venta => 
                venta.usuario && venta.usuario.id === parseInt(usuarioId)
            );
            
            console.log(` Ventas filtradas para usuario ${usuarioId}:`, ventasUsuario);
            return { success: true, data: ventasUsuario };
            
        } catch (error) {
            console.error('💥Error en obtenerVentasPorUsuario:', error);
            return { 
                success: false, 
                error: error.message || 'Error al obtener las ventas' 
            };
        }
    }

    // Obtener una venta por su ID
    async obtenerVentaPorId(id) {
        try {
            console.log(`🔄 Obteniendo venta ID: ${id}`);
            const response = await fetch(`${BASE_URL}/ventas/${id}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(` Error ${response.status}:`, errorText);
                throw new Error(`Error ${response.status} al obtener la venta`);
            }
            
            const data = await response.json();
            console.log(`Venta obtenida:`, data);
            return { success: true, data };
        } catch (error) {
            console.error('💥 Error en obtenerVentaPorId:', error);
            return { 
                success: false, 
                error: error.message || 'Error al obtener la venta' 
            };
        }
    }


    async crearVenta(ventaData) {
        try {
            console.log('🔄 Creando nueva venta:', ventaData);
            
            const response = await fetch(`${BASE_URL}/ventas`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });
            
            console.log(`Response status: ${response.status}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Error ${response.status}:`, errorText);
                throw new Error(`Error ${response.status} al crear venta: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Venta creada exitosamente:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('Error en crearVenta:', error);
            return { 
                success: false, 
                error: error.message || 'Error al procesar la venta' 
            };
        }
    }


    calcularTotalVenta(venta) {
        if (!venta) return 0;

        if (venta.total != null) return Number(venta.total);


        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                const total = venta[key].reduce((sum, item) => {
                    const precio = item.precio || item.precioUnitario || item.price || 0;
                    const cantidad = item.cantidad || item.quantity || 0;
                    const subtotal = item.subtotal || (precio * cantidad);
                    return sum + Number(subtotal);
                }, 0);
                
                console.log(`💰 Total calculado para venta ${venta.id}:`, total);
                return total;
            }
        }

        console.log(`⚠️ No se pudo calcular total para venta ${venta.id}`);
        return 0;
    }

    calcularCantidadProductos(venta) {
        if (!venta) return 0;

        const arrays = ['items', 'productoVenta', 'productos', 'detalles'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                const cantidad = venta[key].reduce((sum, item) => 
                    sum + (Number(item.cantidad) || Number(item.quantity) || 0), 0);
                console.log(`📦 Cantidad productos venta ${venta.id}:`, cantidad);
                return cantidad;
            }
        }

        return 0;
    }

    procesarVentas(ventas) {
        if (!Array.isArray(ventas)) {
            console.warn(' procesarVentas recibió datos no válidos:', ventas);
            return [];
        }

        console.log(`Procesando ${ventas.length} ventas`);
        const ventasProcesadas = ventas.map(venta => ({
            ...venta,
            totalCalculado: this.calcularTotalVenta(venta),
            cantidadProductos: this.calcularCantidadProductos(venta)
        }));

        console.log(' Ventas procesadas:', ventasProcesadas);
        return ventasProcesadas;
    }

    async obtenerTodasLasVentas() {
        try {
            console.log('🔄 Obteniendo todas las ventas');
            const response = await fetch(`${BASE_URL}/ventas`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Error ${response.status}:`, errorText);
                throw new Error(`Error ${response.status} al obtener todas las ventas`);
            }
            
            const data = await response.json();
            console.log(`✅ Todas las ventas obtenidas:`, data);
            return { success: true, data };
        } catch (error) {
            console.error('💥 Error en obtenerTodasLasVentas:', error);
            return { 
                success: false, 
                error: error.message || 'Error al obtener todas las ventas' 
            };
        }
    }
}


const ventaService = new VentaService();
export default ventaService;
