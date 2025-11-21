import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';

class ProductService {
    async getAllProducts() {
        try {
            const response = await axios.get(`${BASE_URL}/productos`);
            
            const productsMapped = response.data.map(product => ({
                id: product.id,
                name: product.nombre,
                price: product.precio,
                descripcion: product.descripcion,
                categoria: product.categorias?.nombre,
                image: "/img/placeholder.jpg",
                stock: product.stock,
                tipo: "general"
            }));
            
            return { data: productsMapped };
            
        } catch (error) {
            console.error("Error cargando productos:", error);
            return { data: [] };
        }
    }

    async getProductById(id) {
        try {
            const response = await axios.get(`${BASE_URL}/productos/${id}`);
            const product = response.data;
            

            return { 
                data: {
                    id: product.id,
                    name: product.nombre,
                    price: product.precio,
                    descripcion: product.descripcion,
                    categoria: product.categorias?.nombre,
                    image: "/img/placeholder.jpg",
                    stock: product.stock
                }
            };
            
        } catch (error) {
            console.error("Error cargando producto:", error);
            return { data: null };
        }
    }
}

export default new ProductService();