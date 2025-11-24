// Configuración centralizada de la API
const API_CONFIG = {
    BASE_URL: 'https://backend-fullstackv1.onrender.com/api/v1',
    TIMEOUT: 15000,
    ENDPOINTS: {
        PRODUCTS: '/productos',
        PRODUCT_BY_ID: '/productos/:id',
        CATEGORIES: '/categorias',
        USERS: '/usuarios',
        AUTH: '/auth',
        ORDERS: '/pedidos'
    },
    getUrl: function(endpoint, params = {}) {
        let url = `${this.BASE_URL}${this.ENDPOINTS[endpoint]}`;
        
        // Reemplazar parámetros en la URL
        Object.keys(params).forEach(key => {
            url = url.replace(`:${key}`, params[key]);
        });
        
        return url;
    }
};

export default API_CONFIG;