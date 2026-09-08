import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const Registro = ({ setUser }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // 1. CREAR USUARIO
            const usuarioParaEnviar = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim(),
                contrasena: formData.contrasena
            };

            console.log('📤 Creando usuario...');
            const resultadoRegistro = await UserService.createUser(usuarioParaEnviar);
            
            if (!resultadoRegistro.success) {
                setError(resultadoRegistro.error || 'Error al crear la cuenta');
                setLoading(false);
                return;
            }

            console.log('✅ Usuario creado exitosamente!');
            
            // ASIGNAR ROL "usuario" POR DEFECTO
            const usuarioCreado = {
                ...resultadoRegistro.data,
                id: resultadoRegistro.data.id || resultadoRegistro.data._id,
                nombre: resultadoRegistro.data.nombre,
                correo: resultadoRegistro.data.correo,
                rol: 'usuario' // ← ROL CORREGIDO
            };

            // Guardar en sessionStorage
            sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarioCreado));
            setUser(usuarioCreado);
            
            setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('💥 Error inesperado:', err);
            setError('Error inesperado. Intenta nuevamente.');
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
                            <h2 className="text-center mb-4">Crear Cuenta</h2>
                            
                            {error && (
                                <div className="alert alert-danger">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    <strong>Éxito:</strong> {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        minLength="6"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirmar contraseña *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmarContrasena"
                                        value={formData.confirmarContrasena}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                </button>

                                <div className="text-center mt-3">
                                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;