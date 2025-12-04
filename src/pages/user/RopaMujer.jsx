import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaHombre = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  // Mapeo directo de imágenes para productos específicos
  const imagenesDirectas = {
    // HOMBRE - Poleras
    "Polera básica blanca": "https://hmchile.vtexassets.com/arquivos/ids/7515921/Polera-Slim-Fit---Blanco---H-M-CL.jpg?v=638902878705900000",
    "Polera oversize negra": "https://http2.mlstatic.com/D_NQ_NP_829589-MLC70612698490_072023-O-polera-hombre-oversize-fit-negra-super-fuego-para-regalo.webp",
    
    // HOMBRE - Pantalones
    "Jeans Baggy Negro": "https://image.hm.com/assets/hm/dc/98/dc987f075569a9e8afb546dd6288344c6cc7a614.jpg",
    "Jogger Morado": "https://casadelasbatas.com/33980-large_default/pantalon-sanitario-jogger-morado-de-microfibra-flex-gary-s.jpg",
    
    // HOMBRE - Chaquetas
    "Chaqueta jean clásica": "https://lsjsas.com/cdn/shop/files/chaqueta-jean-clasica-hombre-azul-industrial-jpg.jpg?v=1761091893",
    
    // HOMBRE - Shorts
    "Short AND1": "https://m.media-amazon.com/images/I/61ClsB7n+OL._AC_SL1000_.jpg",
    "Short AND1 modelo premium": "https://www.manelsanchez.com/uploads/media/images/1ac_copia_copia8.jpg",
    
    // Otros productos
    "Polera Boxy": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "oscar": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop"
  };

  // Función optimizada para obtener imágenes
  const obtenerImagenProducto = (product) => {
    if (!product) {
      // Placeholder de Unsplash que SIEMPRE funciona
      return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=Producto&txtsize=24&txtclr=ffffff&bg=4A90E2';
    }

    const nombreProducto = product.name || product.nombre || 'Producto';
    const textoCodificado = encodeURIComponent(nombreProducto.substring(0, 20));
    
    // 1. Buscar en campos de imagen de la BD (con todos los nombres posibles)
    const camposImagen = ['imagen_url', 'url_imagen', 'imagen', 'image', 'foto', 'url_foto', 'photo_url', 'img_url'];
    
    for (const campo of camposImagen) {
      if (product[campo] && typeof product[campo] === 'string') {
        const valor = product[campo].trim();
        
        // Si es URL completa
        if (valor.startsWith('http://') || valor.startsWith('https://')) {
          console.log(`✅ Imagen de BD en campo "${campo}":`, valor);
          return valor;
        }
        
        // Si es ruta local
        if (valor.startsWith('/')) {
          const urlCompleta = `http://localhost:8080${valor}`;
          console.log(`✅ Convirtiendo ruta local "${valor}" → ${urlCompleta}`);
          return urlCompleta;
        }
      }
    }

    // 2. Mapeo directo por nombre exacto
    if (nombreProducto && imagenesDirectas[nombreProducto]) {
      console.log(`✅ Imagen directa para "${nombreProducto}"`);
      return imagenesDirectas[nombreProducto];
    }

    // 3. Placeholder inteligente según tipo de producto
    const nombreLower = nombreProducto.toLowerCase();
    
    // Poleras
    if (nombreLower.includes('polera') || nombreLower.includes('camiseta') || nombreLower.includes('remera')) {
      if (nombreLower.includes('blanca')) {
        return `https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
      }
      if (nombreLower.includes('negra')) {
        return `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
      }
      return `https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
    }
    
    // Jeans/Pantalones
    if (nombreLower.includes('jeans') || nombreLower.includes('pantalon') || nombreLower.includes('jogger')) {
      if (nombreLower.includes('negro')) {
        return `https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
      }
      return `https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
    }
    
    // Chaquetas
    if (nombreLower.includes('chaqueta') || nombreLower.includes('jacket')) {
      if (nombreLower.includes('jean')) {
        return `https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
      }
      return `https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
    }
    
    // Shorts
    if (nombreLower.includes('short')) {
      return `https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=20&txtclr=ffffff`;
    }

    // 4. Último fallback: Placeholder genérico de Unsplash
    return `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=${textoCodificado}&txtsize=24&txtclr=ffffff&bg=4A90E2`;
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
      switch (filtroPrecio) {
        case 'menor-10000':
          filtered = filtered.filter(product => 
            (product.price || product.precio || 0) < 10000
          );
          break;
        case '10000-15000':
          filtered = filtered.filter(product => {
            const precio = product.price || product.precio || 0;
            return precio >= 10000 && precio <= 15000;
          });
          break;
        case 'mayor-15000':
          filtered = filtered.filter(product => 
            (product.price || product.precio || 0) > 15000
          );
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

  // DEBUG mejorado
  React.useEffect(() => {
    if (products.length > 0) {
      console.log('🔄 Productos cargados del backend:', products.length);
      
      const productosHombre = products.filter(p => 
        p.categoria?.toLowerCase() === 'hombre' || p.categoria_id === 16
      );
      
      console.log('👨 Productos Hombre filtrados:', productosHombre.length);
      
      // Ver campos disponibles
      productosHombre.slice(0, 3).forEach((product, index) => {
        console.log(`📋 Producto ${index + 1} campos disponibles:`, Object.keys(product));
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
                      <div className="card h-100 product-card shadow-sm hover-shadow">
                        <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                          <img 
                            src={imagenSrc}
                            className="card-img-top" 
                            alt={nombre}
                            style={{ 
                              height: '100%', 
                              width: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onError={(e) => {
                              console.log('🔄 Fallback para:', nombre);
                              // Fallback a Unsplash seguro
                              e.target.src = `https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&h=300&fit=crop&txt=${encodeURIComponent(nombre.substring(0, 15))}&txtsize=20&txtclr=ffffff&bg=4A90E2`;
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
