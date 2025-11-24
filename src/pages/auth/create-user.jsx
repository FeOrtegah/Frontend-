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

        setLoading(true);

        try {
            const nuevoUsuario = {
                nombre: form.nombre,
                correo: form.correo,
                contrasena: form.contrasena,
                rol: { id: 3 }
            };

            const response = await UserService.createUser(nuevoUsuario);

            const usuarioCreado =
                response.data?.user ||
                response.data?.data ||
                response.data ||
                null;

            if (!usuarioCreado) {
                throw new Error("Respuesta inesperada del servidor");
            }

            generarMensaje('¡Cuenta creada!', 'success');

            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioCreado));
            if (setUser) setUser(usuarioCreado);

            navigate('/');

        } catch (error) {
            const msg =
                error.response?.data?.message ||
                error.response?.data ||
                'Error al crear usuario';
            generarMensaje(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const formData = [
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
            disabled: loading,
            className: "transform w-full mt-4 mb-4 rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
        },
        {
            type: "text",
            text: [
                {
                    c
