import { useState } from "react";
import axios from "axios";

const API_URL = "https://backend-fullstackv1.onrender.com/api/v1/usuarios";

export default function Auth({ setUsuarioLogeado }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contrasena: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!isLogin) {
                // ---------- REGISTRO ----------
                const res = await axios.post(API_URL, formData);

                // Login automático después de crear la cuenta
                const loginRes = await axios.post(`${API_URL}/login`, {
                    correo: formData.correo,
                    contrasena: formData.contrasena
                });

                localStorage.setItem("usuario", JSON.stringify(loginRes.data));
                setUsuarioLogeado(loginRes.data);
                return;
            }

            // ---------- LOGIN ----------
            const loginRes = await axios.post(`${API_URL}/login`, {
                correo: formData.correo,
                contrasena: formData.contrasena
            });

            localStorage.setItem("usuario", JSON.stringify(loginRes.data));
            setUsuarioLogeado(loginRes.data);

        } catch (error) {
            alert(
                !isLogin
                    ? "Error al crear la cuenta. El correo puede estar en uso."
                    : "Correo o contraseña incorrectos."
            );
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        onChange={handleChange}
                        required
                    />
                )}

                <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="contrasena"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {isLogin ? "Entrar" : "Registrarme"}
                </button>
            </form>

            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
                {isLogin
                    ? "¿No tienes cuenta? Crear cuenta"
                    : "¿Ya tienes cuenta? Inicia sesión"}
            </p>
        </div>
    );
}
