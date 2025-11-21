
let container = null;

export const generarMensaje = (mensaje, tipo = 'info', duracion = 3000) => {
    // Crear contenedor una sola vez
    if (!container) {
        container = document.createElement('div');
        container.className = 'fixed top-4 left-10 z-50 space-y-3';
        document.body.appendChild(container);
    }

    // Crear toast
    const toast = document.createElement('div');
    toast.className = getToastClasses(tipo);
    toast.textContent = mensaje;

    // Añadir al contenedor
    container.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Auto-eliminar
    setTimeout(() => {
        toast.classList.replace('translate-x-0', 'translate-x-full');
        toast.classList.replace('opacity-100', 'opacity-0');
        toast.addEventListener('transitionend', () => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    }, duracion);
};

// Clases por tipo
const getToastClasses = (tipo) => {
    const base = `
    min-w-80 max-w-sm p-4 rounded-xl shadow-2xl text-white text-sm font-medium
    transform transition-all duration-300 ease-out
    translate-x-full opacity-0
  `;

    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600',
    };

    return `${base} ${colors[tipo] || colors.info}`;
};