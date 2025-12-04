import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaHombre = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  // Función simplificada que PRIMERO usa la imagen de la BD
  const obtenerImagenProducto = (product) => {
    if (!product) {
      return 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Producto+Hombre';
    }

    // 1. PRIMERO: Usar la imagen de la base de datos si existe
    if (product.imagen && product.imagen.startsWith('http')) {
      return product.imagen;
    }
    
    // 2. Si tiene ruta local (/img/...), convertirla
    if (product.imagen && product.imagen.startsWith('/img/')) {
      return `http://localhost:8080${product.imagen}`;
    }
    
    // 3. Si la BD tiene la imagen en otro campo (imagen_url, url_imagen, etc.)
    if (product.imagen_url && product.imagen_url.startsWith('http')) {
      return product.imagen_url;
    }
    if (product.url_imagen && product.url_imagen.startsWith('http')) {
      return product.url_imagen;
    }
    if (product.image && product.image.startsWith('http')) {
      return product.image;
    }

    // 4. Último fallback: placeholder según categoría
    return `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=${encodeURIComponent(product.name || 'Producto')}`;
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
      product.categoria_id === 16 // ID de categoría hombre en tu BD
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
          filtered = filtered.filter(product => product.price < 10000 || product.precio < 10000);
          break;
        case '10000-15000':
          filtered = filtered.filter(product => 
            (product.price >= 10000 && product.price <= 15000) ||
            (product.precio >= 10000 && product.precio <= 15000)
          );
          break;
        case 'mayor-15000':
          filtered = filtered.filter(product => product.price > 15000 || product.precio > 15000);
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

  // DEBUG: Ver qué imágenes están llegando de la BD
  React.useEffect(() => {
    if (products.length > 0) {
      const productosHombre = products.filter(p => 
        p.categoria?.toLowerCase() === 'hombre' || p.categoria_id === 16
      );
      
      console.log('📊 Productos hombre encontrados:', productosHombre.length);
      productosHombre.forEach(product => {
        console.log(`🖼️ "${product.name || product.nombre}":`, {
          imagen: product.imagen,
          imagen_url: product.imagen_url,
          url_imagen: product.url_imagen,
          image: product.image
        });
      });
    }
  }, [products]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
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
          <div className="card">
            <div className="card-header">
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
              <h3>No se encontraron productos</h3>
              <p>No hay productos disponibles con los filtros seleccionados.</p>
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
                  const descripcion = product.descripcion || product.descripcion || '';
                  
                  return (
                    <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 product-card">
                        <img 
                          src={obtenerImagenProducto(product)}
                          className="card-img-top" 
                          alt={nombre}
                          style={{ height: '250px', objectFit: 'cover' }}
                          onError={(e) => {
                            console.log('❌ Error cargando imagen para:', nombre);
                            console.log('Datos del producto:', {
                              imagen: product.imagen,
                              imagen_url: product.imagen_url,
                              url_imagen: product.url_imagen
                            });
                            e.target.src = `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=${encodeURIComponent(nombre)}`;
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title">{nombre}</h6>
                          <p className="card-text small text-muted flex-grow-1">
                            {descripcion}
                          </p>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="h6 text-primary mb-0">
                                ${precio.toLocaleString('es-CL')}
                              </span>
                              {(product.oferta || product.es_oferta) && (
                                <span className="badge bg-danger">Oferta</span>
                              )}
                            </div>
                            <Link 
                              to={`/producto/${product.id}`}
                              className="btn btn-outline-primary w-100 mt-2"
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
