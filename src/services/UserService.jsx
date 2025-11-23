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
}

export default new UserService();