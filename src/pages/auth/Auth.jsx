import { useState } from "react";
import axios from "axios";
import "./Auth.css"; // <-- si quieres estilos separados

const API_URL = "https://backend-fullstackv1.onrender.com/api/v1/usuarios";

export default function Auth({ setUsuarioLogeado }) {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (!isLogin) {
                // ============ REGISTRO ============
                await axios.post(API_URL, formData);

                const loginRes = await axios.post(`${API_URL}/login`, {
                    correo: formData.correo,
                    contrasena: formData.contrasena,
                });

                localStorage.setItem("usuario", JSON.stringify(loginRes.data));
                setUsuarioLogeado(loginRes.data);
                return;
            }

            // ============ LOGIN ============
            const loginRes = await axios.post(`${API_URL}/login`, {
                correo: formData.correo,
                contrasena: formData.contrasena,
            });

            localStorage.setItem("usuario", JSON.stringify(loginRes.data));
            setUsuarioLogeado(loginRes.data);

        } catch (err) {
            setError(
                isLogin
                    ? "Correo o contraseña incorrectos."
                    : "No se pudo crear la cuenta. El correo podría estar en uso."
            );
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => setIsLogin(true)}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => setIsLogin(false)}
                    >
                        Crear cuenta
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="auth-group">
                            <label>Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Juan Pérez"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="auth-group">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="correo@ejemplo.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            placeholder="******"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn">
                        {isLogin ? "Entrar" : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}
