import axios from 'axios';
<<<<<<< HEAD
import localProducts from "../data/Products";
import API_CONFIG from './apiService';

// Configuración global de axios
axios.defaults.timeout = API_CONFIG.TIMEOUT;
=======

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1';
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9

class ProductService {
    async getAllProducts() {
        try {
<<<<<<< HEAD
            const url = API_CONFIG.getUrl('PRODUCTS');
            const response = await axios.get(url);
            
            const raw = Array.isArray(response.data)
                ? response.data
                : (response.data && Array.isArray(response.data.data))
                    ? response.data.data
                    : [];

            const productsMapped = this.mapProducts(raw);
            return { data: productsMapped, success: true };
            
        } catch (error) {
            console.error("Error cargando productos desde backend, usando datos locales como fallback:", error);
            return { data: localProducts, success: false, error: error.message };
=======
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
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
        }
    }

    async getProductById(id) {
        try {
<<<<<<< HEAD
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            const response = await axios.get(url);
            
            const raw = response.data && (response.data.product || response.data.data || response.data);
            const product = Array.isArray(raw) ? raw[0] : raw;

            if (!product) {
                return { data: null, success: false, error: "Producto no encontrado" };
            }

            const mappedProduct = this.mapSingleProduct(product);
            return { data: mappedProduct, success: true };
            
        } catch (error) {
            console.error("Error cargando producto, intento con datos locales:", error);
            const fallback = localProducts.find(p => String(p.id) === String(id));
            return { 
                data: fallback || null, 
                success: false, 
                error: error.message,
                fallback: !!fallback 
            };
        }
    }

    async createProduct(productData) {
        try {
            const url = API_CONFIG.getUrl('PRODUCTS');
            const response = await axios.post(url, productData);
            return { data: response.data, success: true };
        } catch (error) {
            console.error("Error creando producto:", error);
            return { data: null, success: false, error: error.message };
        }
    }

    async updateProduct(id, productData) {
        try {
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            const response = await axios.put(url, productData);
            return { data: response.data, success: true };
        } catch (error) {
            console.error("Error actualizando producto:", error);
            return { data: null, success: false, error: error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            await axios.delete(url);
            return { success: true, message: "Producto eliminado correctamente" };
        } catch (error) {
            console.error("Error eliminando producto:", error);
            return { success: false, error: error.message };
        }
    }

    // Métodos auxiliares para mapear datos
    mapProducts(products) {
        return products.map(product => this.mapSingleProduct(product));
    }

    mapSingleProduct(product) {
        return {
            id: product.id || product._id,
            name: product.nombre || product.name,
            price: product.precio || product.price || 0,
            descripcion: product.descripcion || product.description || "",
            categoria: product.categorias?.nombre || product.categoria || product.category,
            image: product.image || "/img/placeholder.jpg",
            stock: product.stock || 0,
            tipo: product.tipo || "general",
            oferta: product.oferta || false,
            originalPrice: product.originalPrice || null,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }

    // Método para obtener productos por categoría
    async getProductsByCategory(category) {
        try {
            const allProducts = await this.getAllProducts();
            if (allProducts.success) {
                const filtered = allProducts.data.filter(product => 
                    product.categoria?.toLowerCase() === category.toLowerCase()
                );
                return { data: filtered, success: true };
            }
            return allProducts;
        } catch (error) {
            console.error("Error filtrando productos por categoría:", error);
            return { data: [], success: false, error: error.message };
=======
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
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
        }
    }
}

export default new ProductService();