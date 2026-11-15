// =============================================================================
// Configuracion de observabilidad del frontend
//
// Este modulo instala un interceptor global de axios que:
//   1. Genera un identificador de correlacion por peticion.
//   2. Lo envia al backend en la cabecera "X-Correlation-Id".
//   3. Lo registra en la consola del navegador.
//
// El backend reutiliza ese identificador y lo escribe en el MDC, de modo que
// aparece en todas las lineas de log de la peticion. Con el identificador
// se puede pasar de "el usuario reporto un error" a la linea exacta del log
// del backend que lo produjo.
//
// Se aplica sobre la instancia global de axios, que es la que usan todos los
// servicios (ProductService, UserService, OrderService, VentaService), de
// modo que ningun servicio tiene que recordar la cabecera.
//
// Referencia: docs/OBSERVABILITY.md del repositorio del backend.
// =============================================================================
import axios from 'axios'

/**
 * Genera un identificador de correlacion unico.
 * @returns {string} Identificador hexadecimal de 32 caracteres.
 */
const generateCorrelationId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().replace(/-/g, '')
    }
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

// --- Interceptor de salida ---------------------------------------------------
// Se agrega la cabecera antes de enviar la peticion.
axios.interceptors.request.use((config) => {
    const correlationId = config.headers?.['X-Correlation-Id'] || generateCorrelationId()

    config.headers['X-Correlation-Id'] = correlationId
    config.metadata = { ...(config.metadata || {}), correlationId }

    return config
})

// --- Interceptor de respuesta ------------------------------------------------
// Se registra la peticion con su identificador y el codigo de estado.
axios.interceptors.response.use(
    (response) => {
        const correlationId = response.config?.metadata?.correlationId
        const status = response.status

        if (status >= 500) {
            console.error(
                `[efa] ${response.config?.method?.toUpperCase()} ${response.config?.url} -> ${status}`,
                { correlationId }
            )
        } else if (status >= 400) {
            console.warn(
                `[efa] ${response.config?.method?.toUpperCase()} ${response.config?.url} -> ${status}`,
                { correlationId }
            )
        } else {
            console.debug(
                `[efa] ${response.config?.method?.toUpperCase()} ${response.config?.url} -> ${status}`,
                { correlationId }
            )
        }

        return response
    },
    (error) => {
        const correlationId = error.config?.metadata?.correlationId

        console.error(
            `[efa] Error de red en ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            { correlationId, mensaje: error.message }
        )

        return Promise.reject(error)
    }
)

export default axios
