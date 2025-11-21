import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/usuarios';

class UserService {
    login(usuario) {
        return axios.post(`${BASE_URL}/login`, usuario);
    }

    createUser(usuario) {
        return axios.post(`${BASE_URL}`, usuario);
    }

    verifyToken(token) {
        return axios.get(`${BASE_URL}/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    logout(token) {
        return axios.post(`${BASE_URL}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

export default new UserService();