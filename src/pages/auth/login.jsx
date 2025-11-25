import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Forms from '../../components/templates/Forms';
import { generarMensaje } from '../../utils/GenerarMensaje';
import UserService from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';
import loginData from './data/loginData';

const userDataNormalizado = {
    id: usuario.id || usuario.usuario?.id || usuario.data?.id,
    nombre: usuario.nombre || usuario.usuario?.nombre,
    correo: usuario.correo || usuario.email || form.correo,
    email: usuario.email || usuario.correo || form.correo,
    rol: usuario.rol || usuario.usuario?.rol,
    telefono: usuario.telefono || '',
    token: usuario.token || "mock-token-login"
};
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.correo || !form.contrasena) {
            generarMensaje('Completa todos los campos', 'warning');
            return;
        }

        setLoading(true);

        try {
            console.log('🚀 Iniciando proceso de login...');
            const response = await UserService.login(form);
            
            // VERIFICAR SI LA RESPUESTA FUE EXITOSA
            if (!response.success) {
                throw new Error(response.error?.message || response.error || 'Error en el login');
            }

            const usuario = response.data;
            console.log('👤 Usuario recibido del servicio:', usuario);

            // 🔥🔥🔥 CORREGIDO: Normalizar y guardar de forma CONSISTENTE
            const userDataNormalizado = {
                id: usuario.id || usuario.usuario?.id || usuario.data?.id,
                nombre: usuario.nombre || usuario.usuario?.nombre,
                correo: usuario.correo || usuario.email,
                email: usuario.email || usuario.correo,
                rol: usuario.rol || usuario.usuario?.rol,
                telefono: usuario.telefono || ''
            };

            console.log('💾 Guardando usuario normalizado:', userDataNormalizado);

            // GUARDAR EN TODAS LAS UBICACIONES
            localStorage.setItem('user', JSON.stringify(userDataNormalizado));
            sessionStorage.setItem('usuarioActivo', JSON.stringify(userDataNormalizado));

            // USA EL CONTEXTO
            if (login) {
                login(userDataNormalizado);
                console.log('✅ Contexto de auth actualizado');
            }

            generarMensaje(`¡Bienvenido ${userDataNormalizado.nombre}!`, 'success');

            setTimeout(() => {
                if (userDataNormalizado.rol?.id === 1 || userDataNormalizado.rol?.id === 2) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error) {
            console.error('💥 Error completo en login:', error);
            const errorMessage = error.message;
            generarMensaje(errorMessage, 'error');
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
