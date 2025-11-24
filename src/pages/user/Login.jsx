import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await UserService.login({
                correo: formData.correo,
                contrasena: formData.contrasena
            });
            
            if (result.success) {
                // Guardar usuario en sesión
                sessionStorage.setItem('usuarioActivo', JSON.stringify(result.data));
                setUser(result.data);
                navigate('/');
            } else {
                setError(result.error || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.correo}
                                        onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.contrasena}
                                        onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </button>

                                <div className="text-center mt-3">
                                    <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;