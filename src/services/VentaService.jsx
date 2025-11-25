// src/services/VentaService.jsx
const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1/ventas';

class VentaService {
    // Obtener todas las ventas de un usuario
    async obtenerVentasPorUsuario(usuarioId) {
        try {
            const response = await fetch(`${BASE_URL}/usuario/${usuarioId}`);
            if (!response.ok) throw new Error('Error al obtener ventas');
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: 'Error al obtener las ventas' };
        }
    }

    // Obtener una venta por su ID
    async obtenerVentaPorId(id) {
        try {
            const response = await fetch(`${BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Error al obtener la venta');
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: 'Error al obtener la venta' };
        }
    }

    // Crear una nueva venta
    async crearVenta(ventaData) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ventaData)
            });
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: 'Error al procesar la venta' };
        }
    }

    // Calcular el total de una venta
    calcularTotalVenta(venta) {
        if (!venta) return 0;

        if (venta.total != null) return Number(venta.total);

        const arrays = ['items', 'productoVenta', 'productos'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                return venta[key].reduce((sum, item) => {
                    const precio = item.precio || item.precioUnitario || 0;
                    const cantidad = item.cantidad || 0;
                    const subtotal = item.subtotal || (precio * cantidad);
                    return sum + Number(subtotal);
                }, 0);
            }
        }

        return 0;
    }

    // Calcular la cantidad de productos en una venta
    calcularCantidadProductos(venta) {
        if (!venta) return 0;

        const arrays = ['items', 'productoVenta', 'productos'];
        for (let key of arrays) {
            if (venta[key]?.length > 0) {
                return venta[key].reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
            }
        }

        return 0;
    }

    // Procesar un array de ventas, agregando campos calculados
    procesarVentas(ventas) {
        if (!Array.isArray(ventas)) return [];

        return ventas.map(venta => ({
            ...venta,
            totalCalculado: this.calcularTotalVenta(venta),
            cantidadProductos: this.calcularCantidadProductos(venta)
        }));
    }
}

// Exportar una instancia única del servicio
const ventaService = new VentaService();
export default ventaService;
