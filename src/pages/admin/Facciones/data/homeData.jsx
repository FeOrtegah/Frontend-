// src/data/homeData.js
export const homeData = [
    {
        type: "text",
        text: [
            { id: 1, content: "Bienvenido a la edición de facciones", variant: "h1", className: "text-4xl font-bold text-center" },
            { id: 2, content: "aquí podrás editar las facciones de una galaxia muy muy lejana ", variant: "p", className: "text-lg text-gray-600 text-center mt-2" },
        ],
    },
    {
        type: "table",
        title: "Facciones Activas",
        columns: ["ID", "Nombre", "descripcion", "logo"],
        data: [], 
        service: "facciones",
        className: "my-8",
    },
];

export default homeData;