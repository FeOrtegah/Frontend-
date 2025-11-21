import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api';

class ProductService {

    getAllProducts() {
        return axios.get(`${BASE_URL}/products`);
    }
    getProductById(id) {
        return axios.get(`${BASE_URL}/products/${id}`);
    }
    getProductsOnSale() {
        return axios.get(`${BASE_URL}/products?oferta=true`);
    }
    createProduct(product) {
        return axios.post(`${BASE_URL}/products`, product);
    }
    updateProduct(id, product) {
        return axios.put(`${BASE_URL}/products/${id}`, product);
    }
    deleteProduct(id) {
        return axios.delete(`${BASE_URL}/products/${id}`);
    }
    getAllProducts() {
        return axios.get(`${BASE_URL}/products`);
    }
    getProductsByCategory(category) {
        return axios.get(`${BASE_URL}/products?categoria=${category}`);
    }
    getProductsByType(type) {
        return axios.get(`${BASE_URL}/products?tipo=${type}`);
    }
}

export default new ProductService();