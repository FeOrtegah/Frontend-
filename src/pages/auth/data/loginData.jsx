const loginData = [
    {
        type: "text",
        text: [
            {
                content: "Inicio de Sesión",
                variant: "h1",
                className: "text-center text-4xl font-medium mb-10 text-white",
            }
        ]
    },
    {
        type: "inputs",
        inputs: [
            {
                type: "email",
                placeholder: "Correo Electrónico",
                name: "correo",
                required: true,
                autoComplete: "off",
                className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500 mb-4",
            },
            {
                type: "password",
                placeholder: "Contraseña",
                name: "contrasena",
                required: true,
                autoComplete: "current-password",
                className: "w-full border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500",
            },
        ],
        className: "space-y-8"
    },
    {           
        type: "button",
        text: "Iniciar Sesión",
        className: "transform w-full mt-4 mb-4 rounded-sm py-2 font-bold duration-300 bg-indigo-600 hover:bg-indigo-400",
    },
    {
        type: "text",
        text: [
            {
                content: (
                    <button
                        type="button"
                        onClick={() => window.location.href = '/create-user'} 
                        className="text-indigo-400 hover:text-indigo-300 underline transition"
                    >
                        Crear usuario
                    </button>
                ),
                variant: "p",
                className: "text-center text-lg",
            },
        ],
    },
];

export default loginData;