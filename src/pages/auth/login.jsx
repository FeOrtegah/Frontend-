import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Forms from '../../components/templates/Forms';
import { generarMensaje } from '../../utils/GenerarMensaje';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import loginData from './data/loginData';

const Login = () => {
    const [form, setForm] = useState({ correo: "", contrasena: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.correo || !form.contrasena) {
            generarMensaje('Completa todos los campos', 'warning');
            return;
        }

        setLoading(true);

        try {
            const response = await UserService.login(form);
            const usuario = response.data; // YA ES EL USUARIO COMPLETO

            // GUARDA SOLO user (SIN token)
            localStorage.setItem('user', JSON.stringify({
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }));

            // USA EL CONTEXTO
            login({
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            });

            generarMensaje(`¡Bienvenido ${usuario.nombre}!`, 'success');

            setTimeout(() => {
                if (usuario.rol.id === 1 || usuario.rol.id === 2) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error) {
            const msg = error.response?.data || 'Credenciales inválidas';
            generarMensaje(msg, 'error');
        } finally {
            setLoading(false);
            setForm({ correo: "", contrasena: "" });
        }
    };

    const formDataWithHandlers = loginData.map((item, index) => {
        if (item.type === "inputs") {
            return {
                ...item,
                inputs: item.inputs.map(input => ({
                    ...input,
                    value: form[input.name] || "",
                    onChange: handleChange,
                }))
            };
        }

        if (item.type === "button") {
            return {
                ...item,
                key: index,
                onClick: handleSubmit,
                disabled: loading,
                text: loading ? "Iniciando..." : item.text,
            };
        }

        if (item.type === "text" && item.text[0].content === "create-user-link") {
            return {
                ...item,
                key: index,
                text: [
                    {
                        ...item.text[0],
                        content: (
                            <button
                                type="button"
                                onClick={() => navigate('/create-user')}
                                className="text-indigo-400 hover:text-indigo-300 underline transition"
                            >
                                Crear usuario
                            </button>
                        )
                    }
                ]
            };
        }

        return { ...item, key: index };
    });

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-orange-800 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-10 rounded-2xl bg-white/10 p-10 backdrop-blur-xl shadow-2xl">
                <Forms content={formDataWithHandlers} />
            </form>
        </main>
    );
};

export default Login;