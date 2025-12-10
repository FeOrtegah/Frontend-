
const camposImagen = [
    'imagen_url',   // Campo principal para Cloudinary
    'imagenUrl',    // Alternativa común
    'url_imagen',   // Otra alternativa
    'imagen',       // Campo simple
    'image',        // Campo en inglés
    'photo_url',    // URL de foto
    'foto',         // Foto simple
    'img_url',      // URL de imagen
    'imagenPrincipal', // Imagen principal
    'mainImage',    // Imagen principal en inglés
    'thumbnail',    // Miniatura
    'urlImagen',    // Camel case
    'urlImage'      // Camel case en inglés
];

/**
 * Obtiene la imagen de un producto, buscando en todos los campos posibles
 * @param {Object} product - Objeto del producto
 * @returns {string} URL de la imagen o placeholder por defecto
 */
export const obtenerImagenProducto = (product) => {
    // Validación básica
    if (!product) {
        console.warn('⚠️ Producto nulo o indefinido');
        return '/img/placeholder.jpg';
    }

    const nombreProducto = product.name || product.nombre || 'Producto';
    console.log(`🔍 Buscando imagen para: "${nombreProducto}"`);

    // DEBUG: Mostrar todos los campos de imagen disponibles
    const camposDisponibles = camposImagen.filter(campo => product[campo]);
    if (camposDisponibles.length > 0) {
        console.log(`📋 Campos de imagen disponibles para "${nombreProducto}":`, 
            camposDisponibles.map(campo => ({ campo, valor: product[campo] }))
        );
    } else {
        console.warn(`⚠️ No se encontraron campos de imagen para "${nombreProducto}"`);
        console.log('🔍 Todos los campos del producto:', Object.keys(product));
    }

    // Buscar en todos los campos de imagen
    for (const campo of camposImagen) {
        const url = product[campo];
        
        if (url && typeof url === 'string' && url.trim() !== '') {
            const urlLimpia = url.trim();
            
            // Si es una URL completa (http/https), devolverla directamente
            if (urlLimpia.startsWith('http://') || urlLimpia.startsWith('https://')) {
                if (urlLimpia.includes('cloudinary.com')) {
                    console.log(`☁️ ✅ URL DE CLOUDINARY encontrada en campo "${campo}" para "${nombreProducto}":`, urlLimpia);
                } else {
                    console.log(`✅ URL de imagen encontrada en campo "${campo}" para "${nombreProducto}":`, urlLimpia);
                }
                return urlLimpia;
            }
            
            // Si es una ruta local que comienza con /, agregar el dominio base si es necesario
            if (urlLimpia.startsWith('/')) {
                console.log(`📁 Ruta local encontrada en campo "${campo}" para "${nombreProducto}":`, urlLimpia);
                return urlLimpia;
            }
        }
    }

    // Si no se encontró ninguna imagen válida
    console.warn(`❌ No se encontró imagen válida para "${nombreProducto}", usando placeholder`);
    return '/img/placeholder.jpg';
};

/**
 * Maneja errores de carga de imágenes
 * @param {Event} e - Evento de error
 * @param {string} nombreProducto - Nombre del producto para logging
 */
export const handleImageError = (e, nombreProducto = 'Producto') => {
    console.warn(`⚠️ Error cargando imagen para "${nombreProducto}"`, e.target.src);
    e.target.src = '/img/placeholder.jpg';
    e.target.alt = `Imagen no disponible - ${nombreProducto}`;
    e.target.title = `No se pudo cargar la imagen de ${nombreProducto}`;
    
    // Agregar estilos para imágenes no cargadas
    e.target.style.backgroundColor = '#f8f9fa';
    e.target.style.border = '1px dashed #dee2e6';
    e.target.style.padding = '5px';
};

/**
 * Extrae todos los campos de imagen de un producto para debugging
 * @param {Object} product - Objeto del producto
 * @returns {Object} Objeto con todos los campos de imagen encontrados
 */
export const obtenerTodosLosCamposDeImagen = (product) => {
    const campos = {};
    camposImagen.forEach(campo => {
        if (product[campo]) {
            campos[campo] = product[campo];
        }
    });
    return campos;
};
