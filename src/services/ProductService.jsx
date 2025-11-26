import axios from 'axios';
import API_CONFIG from './apiService';

// Configuración global de axios
axios.defaults.timeout = 30000; // 30 segundos

class ProductService {
    async getAllProducts() {
        try {
            const url = API_CONFIG.getUrl('PRODUCTS');
            console.log('🔍 Cargando productos desde la base de datos:', url);
            
            const response = await axios.get(url);
            console.log('✅ Respuesta de la base de datos:', response.data);
            
            // Procesar respuesta de la base de datos
            let rawProducts = [];
            
            if (Array.isArray(response.data)) {
                rawProducts = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                rawProducts = response.data.data;
            } else if (response.data && response.data.data) {
                rawProducts = [response.data.data];
            }
            
            console.log('📦 Productos crudos de la BD:', rawProducts);
            
            const productsMapped = this.mapProducts(rawProducts);
            console.log('🎯 Productos mapeados:', productsMapped);
            
            return { 
                data: productsMapped, 
                success: true,
                source: 'database'
            };
            
        } catch (error) {
            console.error("❌ Error cargando productos desde la base de datos:", error);
            return { 
                data: [], 
                success: false, 
                error: error.message,
                source: 'error'
            };
        }
    }

    async getProductById(id) {
        try {
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            console.log('🔍 Buscando producto por ID:', id);
            
            const response = await axios.get(url);
            console.log('✅ Respuesta producto por ID:', response.data);
            
            const raw = response.data && (response.data.product || response.data.data || response.data);
            const product = Array.isArray(raw) ? raw[0] : raw;

            if (!product) {
                return { data: null, success: false, error: "Producto no encontrado en la base de datos" };
            }

            const mappedProduct = this.mapSingleProduct(product);
            return { data: mappedProduct, success: true };
            
        } catch (error) {
            console.error("❌ Error cargando producto desde la base de datos:", error);
            return { 
                data: null, 
                success: false, 
                error: error.message
            };
        }
    }

    async createProduct(productData) {
        try {
            const url = API_CONFIG.getUrl('PRODUCTS');
            console.log('🚀 Creando producto en la base de datos:', productData);
            
            const response = await axios.post(url, productData);
            console.log('✅ Producto creado en la BD:', response.data);
            
            return { 
                data: response.data, 
                success: true,
                message: "Producto guardado en la base de datos"
            };
        } catch (error) {
            console.error("❌ Error guardando producto en la base de datos:", error);
            return { 
                data: null, 
                success: false, 
                error: error.response?.data?.message || error.message
            };
        }
    }

    async updateProduct(id, productData) {
        try {
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            console.log('🔄 Actualizando producto en la BD:', id, productData);
            
            const response = await axios.put(url, productData);
            console.log('✅ Producto actualizado en la BD:', response.data);
            
            return { 
                data: response.data, 
                success: true,
                message: "Producto actualizado en la base de datos"
            };
        } catch (error) {
            console.error("❌ Error actualizando producto en la base de datos:", error);
            return { 
                data: null, 
                success: false, 
                error: error.message
            };
        }
    }

    async deleteProduct(id) {
        try {
            const url = API_CONFIG.getUrl('PRODUCT_BY_ID', { id });
            console.log('🗑️ Eliminando producto de la BD:', id);
            
            await axios.delete(url);
            console.log('✅ Producto eliminado de la BD');
            
            return { 
                success: true, 
                message: "Producto eliminado de la base de datos" 
            };
        } catch (error) {
            console.error("❌ Error eliminando producto de la base de datos:", error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // Métodos auxiliares para mapear datos
    mapProducts(products) {
        return products.map(product => this.mapSingleProduct(product));
    }

    mapSingleProduct(product) {
        console.log('🔍 Producto crudo de la BD:', product);
        
        // Mapeo mejorado para la base de datos
        const mappedProduct = {
            // ID
            id: product.id || product._id || product.productoId,
            
            // Información básica
            name: product.nombre || product.name || 'Sin nombre',
            descripcion: product.descripcion || product.description || '',
            
            // Precios
            price: Number(product.precio || product.price || 0),
            originalPrice: product.originalPrice || product.precioOriginal ? 
                          Number(product.originalPrice || product.precioOriginal) : null,
            
            // Categoría y tipo (CRÍTICO para el filtrado)
            categoria: product.categoria || 
                      product.categoría || // con tilde
                      product.category ||
                      product.categorias?.nombre ||
                      product.categoriaNombre ||
                      'sin-categoria',
            
            tipo: product.tipo || 
                  product.type || 
                  product.categoriaTipo ||
                  'general',
            
            // Imagen
            image: product.image || 
                   product.imagen || 
                   product.imageUrl ||
                   "/img/placeholder.jpg",
            
            // Stock y oferta
            stock: Number(product.stock || product.cantidad || 0),
            oferta: Boolean(product.oferta || product.onSale || false),
            
            // Tallas
            talla: product.talla || product.size || 'S,M,L,XL',
            
            // Timestamps
            createdAt: product.createdAt || product.fechaCreacion,
            updatedAt: product.updatedAt || product.fechaActualizacion
        };
        
        console.log('🎯 Producto mapeado:', mappedProduct);
        return mappedProduct;
    }

    // Método para obtener productos por categoría
    async getProductsByCategory(category) {
        try {
            console.log('🔍 Filtrando productos por categoría desde la BD:', category);
            
            const allProducts = await this.getAllProducts();
            console.log('📦 Total de productos desde BD:', allProducts.data?.length);
            
            if (allProducts.success && allProducts.data) {
                const filtered = allProducts.data.filter(product => {
                    const productCategory = product.categoria?.toLowerCase();
                    const searchCategory = category.toLowerCase();
                    
                    console.log(`🔍 Comparando: "${productCategory}" con "${searchCategory}"`);
                    
                    return productCategory === searchCategory;
                });
                
                console.log('✅ Productos filtrados por categoría:', filtered.length);
                console.log('📋 Detalle de productos filtrados:', filtered);
                
                return { 
                    data: filtered, 
                    success: true,
                    total: filtered.length
                };
            }
            
            return allProducts;
        } catch (error) {
            console.error("❌ Error filtrando productos por categoría:", error);
            return { 
                data: [], 
                success: false, 
                error: error.message 
            };
        }
    }

    // Método para obtener productos por categoría y tipo
    async getProductsByCategoryAndType(category, type) {
        try {
            console.log(`🔍 Filtrando productos: ${category} / ${type}`);
            
            const allProducts = await this.getAllProducts();
            
            if (allProducts.success && allProducts.data) {
                const filtered = allProducts.data.filter(product => {
                    const matchesCategory = product.categoria?.toLowerCase() === category.toLowerCase();
                    const matchesType = product.tipo?.toLowerCase() === type.toLowerCase();
                    
                    return matchesCategory && matchesType;
                });
                
                console.log(`✅ Productos ${category}/${type}:`, filtered.length);
                return { 
                    data: filtered, 
                    success: true 
                };
            }
            
            return allProducts;
        } catch (error) {
            console.error("❌ Error filtrando productos:", error);
            return { 
                data: [], 
                success: false, 
                error: error.message 
            };
        }
    }
}

export default new ProductService();
