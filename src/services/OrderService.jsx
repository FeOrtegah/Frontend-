import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api';

class OrderService {

    checkStock(cartItems) {
        return axios.post(`${BASE_URL}/orders/check-stock`, { items: cartItems });
    }
    createOrder(orderData) {
        return axios.post(`${BASE_URL}/orders`, orderData);
    }
    getUserOrders(userId) {
        return axios.get(`${BASE_URL}/orders/user/${userId}`);
    }
    getOrderById(orderId) {
        return axios.get(`${BASE_URL}/orders/${orderId}`);
    }
    createOrder(orderData) {
        return axios.post(`${BASE_URL}/orders`, orderData);
    }
    checkStock(items) {
        return axios.post(`${BASE_URL}/orders/check-stock`, { items });
    }
    getOrderById(orderId) {
        return axios.get(`${BASE_URL}/orders/${orderId}`);
    }
}

export default new OrderService();