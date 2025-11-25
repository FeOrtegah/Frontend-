// src/utils/userUtils.js
export const userUtils = {
    // 🔥 MÉTODO MEJORADO: Extraer ID de usuario de CUALQUIER estructura
    extractUserId(usuarioData) {
        console.log('🕵️‍♂️ BUSCANDO ID EN:', usuarioData);
        
        if (!usuarioData) {
            console.error('❌ Datos de usuario son null/undefined');
            return null;
        }

        // Lista de posibles ubicaciones del ID
        const posiblesPaths = [
            // Estructura directa
            () => usuarioData.id,
            () => usuarioData.userId,
            () => usuarioData.usuarioId,
            
            // Estructuras anidadas
            () => usuarioData.usuario?.id,
            () => usuarioData.user?.id,
            () => usuarioData.data?.id,
            () => usuarioData.data?.usuario?.id,
            () => usuarioData.data?.user?.id,
            
            // Para respuestas de API
            () => usuarioData.response?.id,
            () => usuarioData.result?.id,
            
            // Buscar en cualquier propiedad que contenga 'id'
            () => {
                for (let key in usuarioData) {
                    if (key.toLowerCase().includes('id') && usuarioData[key]) {
                        console.log(`📌 Encontrado ID en propiedad: ${key} = ${usuarioData[key]}`);
                        return usuarioData[key];
                    }
                }
                return null;
            }
        ];

        // Probar todas las posibles ubicaciones
        for (let getPath of posiblesPaths) {
            try {
                const id = getPath();
                if (this.isValidUserId(id)) {
                    console.log('✅ ID ENCONTRADO:', id);
                    return Number(id);
                }
            } catch (error) {
                continue;
            }
        }

        console.error('❌ NO SE ENCONTRÓ ID VÁLIDO EN NINGUNA UBICACIÓN');
        console.log('🔍 Estructura completa del objeto:', JSON.stringify(usuarioData, null, 2));
        return null;
    },

    // 🔥 VALIDACIÓN MEJORADA
    isValidUserId(userId) {
        if (userId === null || userId === undefined) return false;
        if (typeof userId === 'string') {
            if (userId === 'N/A' || userId === 'null' || userId === 'undefined' || userId.trim() === '') {
                return false;
            }
        }
        
        const num = Number(userId);
        return !isNaN(num) && num > 0 && num < 1000000; // Límite razonable
    },

    // 🔥 OBTENER USUARIO DE TODAS LAS FUENTES POSIBLES
    getUserFromAllSources(userProp) {
        console.log('🔍 BUSCANDO USUARIO EN TODAS LAS FUENTES...');
        
        const sources = [
            { name: 'Props', data: userProp },
            { name: 'LocalStorage', data: JSON.parse(localStorage.getItem('user') || 'null') },
            { name: 'SessionStorage', data: JSON.parse(sessionStorage.getItem('usuarioActivo') || 'null') },
            { name: 'AuthContext', data: JSON.parse(localStorage.getItem('authUser') || 'null') }
        ];

        for (let source of sources) {
            console.log(`📦 Revisando ${source.name}:`, source.data);
            if (source.data && typeof source.data === 'object') {
                const userId = this.extractUserId(source.data);
                if (userId) {
                    console.log(`✅ USUARIO ENCONTRADO en ${source.name} con ID: ${userId}`);
                    return {
                        ...source.data,
                        id: userId // 🔥 Aseguramos que el ID sea válido
                    };
                }
            }
        }

        console.error('❌ NO SE ENCONTRÓ USUARIO EN NINGUNA FUENTE');
        return null;
    }
};
