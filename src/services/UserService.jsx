import axios from 'axios';

const BASE_URL = 'https://backend-fullstackv1.onrender.com/api/v1/usuarios';

class UserService {
    async login(usuario) {
        try {
            console.log('🔐 Intentando login con:', { 
                correo: usuario.correo, 
                contrasena: '***' 
            });
            
            const response = await axios.post(`${BASE_URL}/login`, usuario);
            console.log('✅ Login exitoso - Datos recibidos:', response.data);
            return { success: true, data: response.data };
            
        } catch (error) {
            console.error('❌ Error completo en login:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return { 
                success: false, 
                error: error.response?.data || 'Error de conexión en login' 
            };
        }
    }

    async createUser(usuario) {
        try {
            console.log('📤 Creando usuario con datos:', {
                nombre: usuario.nombre,
                correo: usuario.correo,
                contrasena: '***'
            });
            
            const response = await axios.post(BASE_URL, usuario);
            console.log('✅ Usuario creado exitosamente:', response.data);
            return { success: true, data: response.data };
            
        } catch (error) {
            console.error('❌ Error completo creando usuario:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return { 
                success: false, 
                error: error.response?.data || 'Error de conexión al crear cuenta' 
            };
        }
    }

    async verifyToken(token) {
        try {
            const response = await axios.get(`${BASE_URL}/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Error verificando token:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Error verificando token' 
            };
        }
    }

    async logout(token) {
        try {
            const response = await axios.post(`${BASE_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Error en logout:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Error en logout' 
            };
        }
    }
}

export default new UserService();
