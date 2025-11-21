class UserService {
    login(usuario) {
        return axios.post(`${BASE_URL}/usuarios/login`, usuario);
    }
    createUser(usuario) {
        return axios.post(`${BASE_URL}/usuarios`, usuario);
    }
    verifyToken(token) {
        return axios.get(`${BASE_URL}/usuarios/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
    logout(token) {
        return axios.post(`${BASE_URL}/usuarios/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}