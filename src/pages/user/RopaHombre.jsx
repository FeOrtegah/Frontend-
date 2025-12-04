import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaHombre = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  // Configuración de Cloudinary
  const CLOUDINARY_CONFIG = {
    cloudName: 'dotsiqixa', // ← TU CLOUD NAME
    baseTransformations: 'w_400,h_400,c_fill,q_auto,f_auto' // Transformaciones óptimas
  };

  // Mapeo de fallback por si algún producto no tiene URL en BD
  const imagenesFallback = {
    "Polera básica blanca": "https://hmchile.vtexassets.com/arquivos/ids/7515921/Polera-Slim-Fit---Blanco---H-M-CL.jpg?v=638902878705900000",
    "Polera oversize negra": "https://http2.mlstatic.com/D_NQ_NP_829589-MLC70612698490_072023-O-polera-hombre-oversize-fit-negra-super-fuego-para-regalo.webp",
    "Jeans Baggy Negro": "https://image.hm.com/assets/hm/dc/98/dc987f075569a9e8afb546dd6288344c6cc7a614.jpg",
    "Jogger Morado": "https://casadelasbatas.com/33980-large_default/pantalon-sanitario-jogger-morado-de-microfibra-flex-gary-s.jpg",
    "Chaqueta jean clásica": "https://lsjsas.com/cdn/shop/files/chaqueta-jean-clasica-hombre-azul-industrial-jpg.jpg?v=1761091893",
    "Short AND1": "https://m.media-amazon.com/images/I/61ClsB7n+OL._AC_SL1000_.jpg",
    "Short AND1 modelo premium": "https://www.manelsanchez.com/uploads/media/images/1ac_copia_copia8.jpg",
    "Polera Boxy": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "oscar": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop"
  };

  // Función optimizada para obtener imágenes
  const obtenerImagenProducto = (product) => {
    if (!product) {
      return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=Producto&txtsize=24&txtclr=ffffff&bg=4A90E2';
    }

    const nombreProducto = product.name || product.nombre || 'Producto';
    
    console.log('🔍 Buscando imagen para:', nombreProducto);

    // 1. PRIMERO: Buscar URL en la base de datos (campo imagen_url)
    if (product.imagen_url && product.imagen_url.trim() !== '') {
      const url = product.imagen_url.trim();
      console.log(`✅ URL encontrada en BD: ${url}`);
      
      // Verificar si es URL de Cloudinary
      if (url.includes('cloudinary.com')) {
        // Optimizar URL de Cloudinary si no tiene transformaciones
        if (!url.includes('/w_') && !url.includes('/c_')) {
          const optimizedUrl = url.replace(
            '/upload/', 
            `/upload/${CLOUDINARY_CONFIG.baseTransformations}/`
          );
          console.log(`⚡ URL optimizada: ${optimizedUrl}`);
          return optimizedUrl;
        }
      }
      return url; // Devolver URL tal como está en la BD
    }

    // 2. Buscar en otros campos posibles
    const camposPosibles = ['image', 'imagen', 'url_imagen', 'foto', 'photo_url'];
    for (const campo of camposPosibles) {
      if (product[campo] && product[campo].trim() !== '') {
        console.log(`📁 Encontrado en campo "${campo}":`, product[campo]);
        return product[campo].trim();
      }
    }

    // 3. Usar fallback si está en el mapeo
    if (imagenesFallback[nombreProducto]) {
      console.log(`🔄 Usando fallback para: ${nombreProducto}`);
      return imagenesFallback[nombreProducto];
    }

    // 4. Último fallback: Unsplash con nombre del producto
    const textoCodificado = encodeURIComponent(nombreProducto.substring(0, 20));
    const fallbackUrl = `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff&bg=4A90E2`;
    console.log(`🆘 Usando fallback Unsplash: ${fallbackUrl}`);
    
    return fallbackUrl;
  };

  const subcategorias = [
    { id: 'poleras', nombre: 'Poleras' },
    { id: 'pantalones', nombre: 'Pantalones' },
    { id: 'chaquetas', nombre: 'Chaquetas' },
    { id: 'shorts', nombre: 'Shorts' }
  ];

  const productosFiltrados = useMemo(() => {
    let filtered = products.filter(product => 
      product.categoria?.toLowerCase() === 'hombre' || 
      product.categoria_id === 16
    );

    if (subcategoria) {
      filtered = filtered.filter(product => {
        const textoBusqueda = `${product.name} ${product.descripcion} ${product.nombre}`.toLowerCase();
        
        if (subcategoria === 'poleras') {
          return textoBusqueda.includes('polera') || 
                 textoBusqueda.includes('camiseta') ||
                 textoBusqueda.includes('remera');
        }
        if (subcategoria === 'pantalones') {
          return textoBusqueda.includes('pantalon') || 
                 textoBusqueda.includes('jeans') ||
                 textoBusqueda.includes('jogger');
        }
        if (subcategoria === 'chaquetas') {
          return textoBusqueda.includes('chaqueta') || 
                 textoBusqueda.includes('jacket');
        }
        if (subcategoria === 'shorts') {
          return textoBusqueda.includes('short');
        }
        return true;
      });
    }

    if (filtroOferta) {
      filtered = filtered.filter(product => product.oferta || product.es_oferta);
    }

    if (filtroPrecio) {
      const getPrecio = (product) => product.price || product.precio || 0;
      
      switch (filtroPrecio) {
        case 'menor-10000':
          filtered = filtered.filter(product => getPrecio(product) < 10000);
          break;
        case '10000-15000':
          filtered = filtered.filter(product => {
            const precio = getPrecio(product);
            return precio >= 10000 && precio <= 15000;
          });
          break;
        case 'mayor-15000':
          filtered = filtered.filter(product => getPrecio(product) > 15000);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, subcategoria, filtroPrecio, filtroOferta]);

  const generarTitulo = () => {
    if (subcategoria) {
      const subcatInfo = subcategorias.find(sub => sub.id === subcategoria);
      return subcatInfo ? `${subcatInfo.nombre} de Hombre` : 'Productos de Hombre';
    }
    return 'Ropa para Hombre';
  };

  // DEBUG: Ver qué productos llegan y sus imágenes
  React.useEffect(() => {
    if (products.length > 0) {
      const productosHombre = products.filter(p => 
        p.categoria?.toLowerCase() === 'hombre' || p.categoria_id === 16
      );
      
      console.log('👨 PRODUCTOS HOMBRE ENCONTRADOS:', productosHombre.length);
      
      productosHombre.forEach(product => {
        console.log(`📋 ${product.id}: ${product.nombre || product.name}`, {
          imagen_url: product.imagen_url,
          image: product.image,
          imagen: product.imagen,
          url_imagen: product.url_imagen
        });
      });
    }
  }, [products]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p className="mt-3">Cargando productos para hombre...</p>
      </div>
    );
  }

  const titulo = generarTitulo();
  const productosHombre = products.filter(product => 
    product.categoria?.toLowerCase() === 'hombre' || 
    product.categoria_id === 16
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">{titulo}</h1>
      
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/hombre">Hombre</Link>
          </li>
          {subcategoria && (
            <li className="breadcrumb-item active" aria-current="page">
              {subcategorias.find(sub => sub.id === subcategoria)?.nombre}
            </li>
          )}
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Filtros</h5>
            </div>
            <div className="card-body">
              
              <div className="mb-4">
                <h6>Categorías</h6>
                <div className="list-group list-group-flush">
                  <Link 
                    to="/hombre" 
                    className={`list-group-item list-group-item-action ${!subcategoria ? 'active' : ''}`}
                  >
                    Todas
                  </Link>
                  {subcategorias.map(subcat => (
                    <Link 
                      key={subcat.id}
                      to={`/hombre/${subcat.id}`}
                      className={`list-group-item list-group-item-action ${subcategoria === subcat.id ? 'active' : ''}`}
                    >
                      {subcat.nombre}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h6>Precio</h6>
                <select 
                  className="form-select"
                  value={filtroPrecio}
                  onChange={(e) => setFiltroPrecio(e.target.value)}
                >
                  <option value="">Todos los precios</option>
                  <option value="menor-10000">Menor a $10.000</option>
                  <option value="10000-15000">$10.000 - $15.000</option>
                  <option value="mayor-15000">Mayor a $15.000</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="filtroOferta"
                    checked={filtroOferta}
                    onChange={(e) => setFiltroOferta(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="filtroOferta">
                    En oferta
                  </label>
                </div>
              </div>

              <div className="small text-muted">
                {productosFiltrados.length} de {productosHombre.length} productos
              </div>

            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="text-muted">No se encontraron productos</h3>
              <p className="text-muted">No hay productos disponibles con los filtros seleccionados.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setFiltroPrecio('');
                  setFiltroOferta(false);
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="mb-0">
                  Mostrando <strong>{productosFiltrados.length}</strong> productos
                  {subcategoria && ` en ${subcategorias.find(sub => sub.id === subcategoria)?.nombre}`}
                </p>
                
                {(filtroPrecio || filtroOferta) && (
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setFiltroPrecio('');
                      setFiltroOferta(false);
                    }}
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="row">
                {productosFiltrados.map(product => {
                  const precio = product.price || product.precio || 0;
                  const nombre = product.name || product.nombre || 'Producto';
                  const descripcion = product.descripcion || '';
                  const imagenSrc = obtenerImagenProducto(product);
                  
                  return (
                    <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 product-card shadow-sm">
                        <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                          <img 
                            src={imagenSrc}
                            className="card-img-top" 
                            alt={nombre}
                            style={{ 
                              height: '100%', 
                              width: '100%', 
                              objectFit: 'cover'
                            }}
                            loading="lazy" // Mejora performance
                            onError={(e) => {
                              console.log('❌ Error cargando imagen, usando fallback:', nombre);
                              // Fallback directo a Unsplash
                              const fallbackUrl = `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=${encodeURIComponent(nombre.substring(0, 15))}&txtsize=20&txtclr=ffffff&bg=4A90E2`;
                              e.target.src = fallbackUrl;
                            }}
                          />
                          {(product.oferta || product.es_oferta) && (
                            <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
                              Oferta
                            </span>
                          )}
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-semibold">{nombre}</h6>
                          <p className="card-text small text-muted flex-grow-1">
                            {descripcion || 'Sin descripción'}
                          </p>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="h5 text-primary mb-0 fw-bold">
                                ${precio.toLocaleString('es-CL')}
                              </span>
                              {product.oferta && product.originalPrice && (
                                <small className="text-muted text-decoration-line-through">
                                  ${product.originalPrice.toLocaleString('es-CL')}
                                </small>
                              )}
                            </div>
                            <Link 
                              to={`/producto/${product.id}`}
                              className="btn btn-outline-primary w-100 mt-2 fw-semibold"
                            >
                              Ver Detalles
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RopaHombre;
