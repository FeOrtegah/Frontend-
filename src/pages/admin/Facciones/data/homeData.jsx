export const homeData = [
    {
        type: "text",
        text: [
            { 
                id: 1, 
                content: "Panel de Administración EFA Store", 
                variant: "h1", 
                className: "text-4xl font-bold text-center mb-4" 
            },
            { 
                id: 2, 
                content: "Gestiona los productos de tu tienda desde aquí", 
                variant: "p", 
                className: "text-lg text-gray-600 text-center mb-8" 
            },
        ],
    },
    {
        type: "stats",
        stats: [
            { title: "Total Productos", value: 0, color: "primary", key: "total" },
            { title: "En Oferta", value: 0, color: "success", key: "ofertas" },
            { title: "Hombre", value: 0, color: "info", key: "hombre" },
            { title: "Mujer", value: 0, color: "warning", key: "mujer" },
        ],
        className: "mb-6",
    },
    {
        type: "table",
        title: "Productos de la Tienda",
        columns: ["Imagen", "Nombre", "Categoría", "Tipo", "Precio", "Stock", "Oferta", "Acciones"],
        data: [], 
        service: "productos",
        className: "my-8",
    },
    {
        type: "button",
        text: "+ Agregar Producto",
        variant: "primary",
        action: "openModal",
        className: "mb-4",
    }
];

export default homeData;
