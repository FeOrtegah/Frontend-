import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaInfantil = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  const imagenesProductos = {
    // Poleras infantiles
    "Polera infantil estampada": "https://ficcus.vtexassets.com/arquivos/ids/307505/24103560801_1.jpg?v=638260838879930000",
    "Polera con dibujos": "https://cdnx.jumpseller.com/estampados-bettoskys/image/27997770/resize/255/255?1665441695",
    "Polera infantil con estampados divertidos": "https://fashionspark.com/cdn/shop/files/67f01e22a25f0e414a86ae0639ec56.jpg?v=1746722956",
    
    // Pantalones infantiles
    "Pantalón jeans infantil": "https://colgramcl.vtexassets.com/arquivos/ids/782266-800-auto?v=638968579272270000&width=800&height=auto&aspect=true",
    "Pantalón jeans para niños": "https://colgramcl.vtexassets.com/arquivos/ids/782266-800-auto?v=638968579272270000&width=800&height=auto&aspect=true",
    
    // Chaquetas infantiles
    "Chaqueta infantil": "https://www.hellyhansenchile.cl/media/catalog/product/cache/bd8b7f832b1c63fb97fb3daad23d0528/4/1/41773-1_drjkotrcam6u1ifk.jpg",
    "Chaqueta con capucha": "https://http2.mlstatic.com/D_NQ_NP_611098-CBT87050282971_072025-O-chaqueta-de-plumon-con-capucha-para-ninos-a-la-moda-con-aisl.webp"
  };

  const obtenerImagenProducto = (product) => {
    if (!product) {
      return 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Producto+Infantil';
    }

    const nombreProducto = product.name || product.nombre;
    if (nombreProducto && imagenesProductos[nombreProducto]) {
      return imagenesProductos[nombreProducto];
    }

    if (nombreProducto) {
      const nombreLower = nombreProducto.toLowerCase();
      
      // Poleras infantiles
      if (nombreLower.includes('polera') && nombreLower.includes('infantil')) {
        return "https://images.unsplash.com/photo-1622295028116-2c8c4b2e14b5?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('polera') && nombreLower.includes('dibujos')) {
        return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('polera') || nombreLower.includes('camiseta')) {
        return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
      }
      
      // Pantalones infantiles
      if (nombreLower.includes('pantalon') && nombreLower.includes('jeans')) {
        return "https://images.unsplash.com/photo-1600243873592-b7948e7b3bf3?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('pantalon') && nombreLower.includes('infantil')) {
        return "https://images.unsplash.com/photo-1600243873592-b7948e7b3bf3?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('pantalon')) {
        return "https://images.unsplash.com/photo-1600243873592-b7948e7b3bf3?w=300&h=300&fit=crop";
      }
      
      // Chaquetas infantiles
      if (nombreLower.includes('chaqueta') && nombreLower.includes('capucha')) {
        return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('chaqueta') && nombreLower.includes('infantil')) {
        return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
      }
      if (nombreLower.includes('chaqueta')) {
        return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
      }
    }

    // Si el producto ya tiene una imagen válida, usarla
    if (product.image && product.image !== '/img/placeholder.jpg' && !product.image.includes('placeholder')) {
      return product.image;
    }

    // Fallback genérico por tipo
    const textoBusqueda = `${product.name} ${product.descripcion}`.toLowerCase();
    if (textoBusqueda.includes('polera') || textoBusqueda.includes('camiseta')) {
      return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
    }
    if (textoBusqueda.includes('jeans') || textoBusqueda.includes('pantalon')) {
      return "https://images.unsplash.com/photo-1600243873592-b7948e7b3bf3?w=300&h=300&fit=crop";
    }
    if (textoBusqueda.includes('chaqueta')) {
      return "https://images.unsplash.com/photo-1622295350161-2cb3a7dcdd41?w=300&h=300&fit=crop";
    }

    // Último fallback
    return `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name || 'Producto Infantil')}`;
  };

  const subcategorias = [
    { id: 'poleras', nombre: 'Poleras' },
    { id: 'pantalones', nombre: 'Pantalones' },
    { id: 'chaquetas', nombre: 'Chaquetas' }
  ];

  const productosFiltrados = useMemo(() => {
    let filtered = products.filter(product => 
      product.categoria?.toLowerCase() === 'infantil'
    );

    if (subcategoria) {
      filtered = filtered.filter(product => {
        const textoBusqueda = `${product.name} ${product.descripcion}`.toLowerCase();
        
        if (subcategoria === 'poleras') {
          return textoBusqueda.includes('polera') || 
                 textoBusqueda.includes('camiseta') ||
                 textoBusqueda.includes('remera');
        }
        if (subcategoria === 'pantalones') {
          return textoBusqueda.includes('pantalon') || 
                 textoBusqueda.includes('jean');
        }
        if (subcategoria === 'chaquetas') {
          return textoBusqueda.includes('chaqueta') || 
                 textoBusqueda.includes('jacket');
        }
        return true;
      });
    }

    if (filtroOferta) {
      filtered = filtered.filter(product => product.oferta);
    }

    if (filtroPrecio) {
      switch (filtroPrecio) {
        case 'menor-8000':
          filtered = filtered.filter(product => product.price < 8000);
          break;
        case '8000-12000':
          filtered = filtered.filter(product => product.price >= 8000 && product.price <= 12000);
          break;
        case 'mayor-12000':
          filtered = filtered.filter(product => product.price > 12000);
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
      return subcatInfo ? `${subcatInfo.nombre} Infantil` : 'Productos Infantiles';
    }
    return 'Ropa Infantil';
  };

  // DEBUG para ver las imágenes asignadas
  React.useEffect(() => {
    if (products.length > 0 && productosFiltrados.length > 0) {
      console.log('🎯 Asignación de imágenes infantiles:');
      productosFiltrados.forEach(product => {
        const imagenAsignada = obtenerImagenProducto(product);
        console.log(`👶 "${product.name}" → ${imagenAsignada}`);
      });
    }
  }, [productosFiltrados]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p className="mt-3">Cargando productos infantiles...</p>
      </div>
    );
  }

  const titulo = generarTitulo();
  const productosInfantil = products.filter(product => 
    product.categoria?.toLowerCase() === 'infantil'
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
            <Link to="/infantil">Infantil</Link>
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
                    to="/infantil" 
                    className={`list-group-item list-group-item-action ${!subcategoria ? 'active' : ''}`}
                  >
                    Todas
                  </Link>
                  {subcategorias.map(subcat => (
                    <Link 
                      key={subcat.id}
                      to={`/infantil/${subcat.id}`}
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
                {productosFiltrados.length} de {productosInfantil.length} productos
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
                {productosFiltrados.map(product => (
                  <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 product-card">
                      <img 
                        src={obtenerImagenProducto(product)}
                        className="card-img-top" 
                        alt={product.name}
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          console.log('❌ Error cargando imagen infantil para:', product.name);
                          e.target.src = `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name)}`;
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text small text-muted flex-grow-1">
                          {product.descripcion}
                        </p>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="h6 text-primary mb-0">
                              ${product.price?.toLocaleString('es-CL') || '0'}
                            </span>
                            {product.oferta && (
                              <span className="badge bg-danger">Oferta</span>
                            )}
                          </div>
                          {product.oferta && product.originalPrice && (
                            <small className="text-muted text-decoration-line-through">
                              ${product.originalPrice.toLocaleString('es-CL')}
                            </small>
                          )}
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
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RopaInfantil;
