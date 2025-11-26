import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Forms from '../../components/templates/Forms';
import { generarMensaje } from '../../utils/GenerarMensaje';
import UserService from '../../services/UserService';

const CreateUser = ({ setUser }) => {
    const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre || !form.correo || !form.contrasena) {
            generarMensaje('Completa todos los campos', 'warning');
            return;
        }

        const dominiosPermitidos = ["gmail.com", "duocuc.cl", "profesor.duoc.cl"];
        const dominio = form.correo.split("@")[1];
        if (!dominiosPermitidos.includes(dominio)) {
            generarMensaje('Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.duoc.cl', 'warning');
            return;
        }

        if (form.contrasena.length < 6) {
            generarMensaje('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        setLoading(true);

        try {
            const usuario = {
                "nombre": form.nombre,
                "correo": form.correo,
                "contrasena": form.contrasena,
                rol: {
                    "id": 3
                }
            }
            
            const response = await UserService.createUser(usuario);
            
            if (!response.success) {
                throw new Error(response.error?.message || response.error || 'Error al crear usuario');
            }

            generarMensaje('¡Usuario creado exitosamente!', 'success');

            try {
                const loginResponse = await UserService.login({
                    correo: form.correo,
                    contrasena: form.contrasena
                });

                if (loginResponse.success) {
                    const usuarioData = loginResponse.data;
                    
                    const userDataNormalizado = {
                        id: usuarioData.id || usuarioData.usuario?.id || usuarioData.data?.id,
                        nombre: usuarioData.nombre || usuarioData.usuario?.nombre,
                        correo: usuarioData.correo || usuarioData.email || form.correo,
                        email: usuarioData.email || usuarioData.correo || form.correo,
                        rol: usuarioData.rol || usuarioData.usuario?.rol,
                        telefono: usuarioData.telefono || '',
                        token: usuarioData.token || "mock-token-createuser"
                    };
                    
                    sessionStorage.setItem("usuarioActivo", JSON.stringify(userDataNormalizado));
                    localStorage.setItem("user", JSON.stringify(userDataNormalizado));
                    
                    if (setUser) {
                        setUser(userDataNormalizado);
                    }
                    
                    generarMensaje(`¡Bienvenido ${userDataNormalizado.nombre}!`, 'success');

                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    throw new Error(loginResponse.error || 'Error en login automático');
                }
            } catch (loginError) {
                generarMensaje('Cuenta creada. Por favor inicia sesión manualmente.', 'success');
                setTimeout(() => {
                    navigate('/auth');
                }, 1500);
            }

        } catch (error) {
            const errorMessage = error.message;
            generarMensaje(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const Login = [
        {
            type: "text",
            text: [
                {
                    content: "Crear usuario",
                    variant: "h1",
                    className: "text-center text-4xl font-medium mb-10 text-white",
                }
            ]
        },
        {
            type: "inputs",
            inputs: [
                {
                    type: "text",
                    placeholder: "Nombre usuario",
                    name: "nombre",
                    value: form.nombre,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "off",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4",
                },
                {
                    type: "email",
                    placeholder: "Correo Electrónico",
                    name: "correo",
                    value: form.correo,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "off",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4",
                },
                {
                    type: "password",
                    placeholder: "Contraseña",
                    name: "contrasena",
                    value: form.contrasena,
                    onChange: handleChange,
                    required: true,
                    autoComplete: "current-password",
                    className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500",
                },
            ],
            className: "space-y-8"
        },
        {           
            type: "button",
            text: loading ? "Creando..." : "Crear usuario",
            onClick: handleSubmit,
            disabled: loading,
            className: `transform w-full mt-4 mb-4 rounded-sm py-2 font-bold duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-400'
            }`
        },
        {
            type: "text",
            text: [
                {
                    content: (
                        <Link
                            to="/auth"
                            className="text-indigo-400 hover:text-indigo-300 underline transition"
                        >
                            Ya tengo un usuario
                        </Link>
                    ),
                    variant: "p",
                    className: "text-center text-lg",
                },
            ],
        },
    ];
    
    return (
        <>
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-orange-800 p-4">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-10 rounded-2xl bg-white/10 p-10 backdrop-blur-xl shadow-2xl">
                    <Forms content={Login} />
                </form>
            </main>
        </>
    );
};

export default CreateUser;
