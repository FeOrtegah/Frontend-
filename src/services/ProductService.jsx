import axios from 'axios';

const BASE_URL = 'https://backend-fullstack-v3.onrender.com/api/v1/productos';

class ProductService {

    getAllProducts() {
        return axios.get(BASE_URL);
    }

    getProductById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
}

export default new ProductService();
