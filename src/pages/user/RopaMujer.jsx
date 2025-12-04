import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaMujer = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  const imagenesProductos = {
    // Poleras
    "Polera deportiva Azul": "https://kelme.cl/wp-content/uploads/2025/01/Polera-Deportiva-Mujer-K-Training-Kelme-2-1024x1024.jpg",
    "Polera oversize Roja": "https://hmchile.vtexassets.com/arquivos/ids/6310024/Polera-oversize---Rojo-28---H-M-CL.jpg?v=638586069699400000",
    "Polera deportiva sin mangas": "https://underarmourcl.vtexassets.com/arquivos/ids/609872/1354282-640_QSU_1.jpg?v=638054632238830000",
    
    // Pantalones
    "Pantalón cargo beige": "https://hmchile.vtexassets.com/arquivos/ids/7343997/Pantalon-cargo-holgado---Beige---H-M-CL.jpg?v=638881497626470000",
    "Pantalón skinny negro": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0zYu1raCRz68xe6mEd0TmsHhnq534uJZpMw&s",
    
    // Chaquetas
    "Chaqueta jean clásica": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3JT-TacsaJSYhNcypWv1gLKCldBTZXq8LA&s",
    "Chaqueta negra": "https://static2.goldengoose.com/public/Style/ECOMM/GWP02069.P001619-50866.jpg",
    "Chaqueta deportiva": "https://http2.mlstatic.com/D_NQ_NP_721587-CBT81767108385_012025-O-chaqueta-deportiva-para-mujer-ropa-de-yoga-de-secado-rapido.webp"
  };

  const obtenerImagenProducto = (product) => {
    if (!product) {
      return 'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Producto+Mujer';
    }

    // 1. PRIMERO: Usar la imagen de la base de datos
    if (product.imagen && product.imagen.startsWith('http')) {
      return product.imagen;
    }
    
    if (product.imagen && product.imagen.startsWith('/img/')) {
      return `http://localhost:8080${product.imagen}`;
    }
    
    if (product.imagen_url && product.imagen_url.startsWith('http')) {
      return product.imagen_url;
    }
    if (product.url_imagen && product.url_imagen.startsWith('http')) {
      return product.url_imagen;
    }
    if (product.image && product.image.startsWith('http')) {
      return product.image;
    }

    // 2. SEGUNDO: Usar el mapeo por nombre
    const nombreProducto = product.name || product.nombre;
    if (nombreProducto && imagenesProductos[nombreProducto]) {
      return imagenesProductos[nombreProducto];
    }

    // 3. TERCERO: Búsqueda por palabras clave
    const descripcionProducto = product.descripcion || '';
    const textoCompleto = `${nombreProducto} ${descripcionProducto}`.toLowerCase();

    if (textoCompleto.includes('polera') && textoCompleto.includes('deportiva') && textoCompleto.includes('azul')) {
      return "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('polera') && textoCompleto.includes('oversize') && textoCompleto.includes('roja')) {
      return "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('polera') && textoCompleto.includes('deportiva') && textoCompleto.includes('sin mangas')) {
      return "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('pantalón') && textoCompleto.includes('cargo') && textoCompleto.includes('beige')) {
      return "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('pantalón') && textoCompleto.includes('skinny') && textoCompleto.includes('negro')) {
      return "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('chaqueta') && textoCompleto.includes('jean') && textoCompleto.includes('clásica')) {
      return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('chaqueta') && textoCompleto.includes('negra') && textoCompleto.includes('elegante')) {
      return "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('chaqueta') && textoCompleto.includes('deportiva')) {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop";
    }

    // 4. Fallback genérico
    if (textoCompleto.includes('polera')) {
      return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('pantalón') || textoCompleto.includes('jeans')) {
      return "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=300&fit=crop";
    }
    if (textoCompleto.includes('chaqueta')) {
      return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop";
    }

    // 5. Último fallback
    return `https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=${encodeURIComponent(nombreProducto || 'Producto')}`;
  };

  const subcategorias = [
    { id: 'poleras', nombre: 'Poleras' },
    { id: 'pantalones', nombre: 'Pantalones' },
    { id: 'chaquetas', nombre: 'Chaquetas' }
  ];

  const productosFiltrados = useMemo(() => {
    let filtered = products.filter(product => 
      product.categoria?.toLowerCase() === 'mujer' ||
      product.categoria_id === 17 // ID de categoría mujer en tu BD
    );

    if (subcategoria) {
      filtered = filtered.filter(product => {
        const textoBusqueda = `${product.name} ${product.descripcion} ${product.nombre}`.toLowerCase();
        
        if (subcategoria === 'poleras') {
          return textoBusqueda.includes('polera') || 
                 textoBusqueda.includes('camiseta') ||
                 textoBusqueda.includes('remera') ||
                 textoBusqueda.includes('blusa');
        }
        if (subcategoria === 'pantalones') {
          return textoBusqueda.includes('pantalón') || 
                 textoBusqueda.includes('pantalon') ||
                 textoBusqueda.includes('jeans') ||
                 textoBusqueda.includes('leggings');
        }
        if (subcategoria === 'chaquetas') {
          return textoBusqueda.includes('chaqueta') || 
                 textoBusqueda.includes('jacket') ||
                 textoBusqueda.includes('saco');
        }
        return true;
      });
    }

    if (filtroOferta) {
      filtered = filtered.filter(product => product.oferta || product.es_oferta);
    }

    if (filtroPrecio) {
      const precioProducto = (product) => product.price || product.precio || 0;
      
      switch (filtroPrecio) {
        case 'menor-8000':
          filtered = filtered.filter(product => precioProducto(product) < 8000);
          break;
        case '8000-12000':
          filtered = filtered.filter(product => {
            const precio = precioProducto(product);
            return precio >= 8000 && precio <= 12000;
          });
          break;
        case 'mayor-12000':
          filtered = filtered.filter(product => precioProducto(product) > 12000);
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
      return subcatInfo ? `${subcatInfo.nombre} de Mujer` : 'Productos de Mujer';
    }
    return 'Ropa para Mujer';
  };

  // DEBUG: Ver qué imágenes están llegando de la BD
  React.useEffect(() => {
    if (products.length > 0) {
      const productosMujer = products.filter(p => 
        p.categoria?.toLowerCase() === 'mujer' || p.categoria_id === 17
      );
      
      console.log('📊 Productos mujer encontrados:', productosMujer.length);
      productosMujer.forEach(product => {
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
        <p className="mt-3">Cargando productos para mujer...</p>
      </div>
    );
  }

  const titulo = generarTitulo();
  const productosMujer = products.filter(product => 
    product.categoria?.toLowerCase() === 'mujer' ||
    product.categoria_id === 17
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
            <Link to="/mujer">Mujer</Link>
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
                    to="/mujer" 
                    className={`list-group-item list-group-item-action ${!subcategoria ? 'active' : ''}`}
                  >
                    Todas
                  </Link>
                  {subcategorias.map(subcat => (
                    <Link 
                      key={subcat.id}
                      to={`/mujer/${subcat.id}`}
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
                  <option value="menor-8000">Menor a $8.000</option>
                  <option value="8000-12000">$8.000 - $12.000</option>
                  <option value="mayor-12000">Mayor a $12.000</option>
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
                {productosFiltrados.length} de {productosMujer.length} productos
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
                  const descripcion = product.descripcion || '';
                  
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
                            e.target.src = `https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=${encodeURIComponent(nombre)}`;
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

export default RopaMujer;
