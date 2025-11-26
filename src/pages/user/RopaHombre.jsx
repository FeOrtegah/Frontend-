import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const RopaHombre = () => {
  const { subcategoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroOferta, setFiltroOferta] = useState(false);
  
  const { products, loading } = useProducts();

  const imagenesHombre = {
    poleras: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", // Polera negra
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300&h=300&fit=crop", // Polera blanca
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop",  // Polera gris
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop", // Polera azul
      "https://images.unsplash.com/photo-1594032194509-0056023973b2?w=300&h=300&fit=crop"  // Polera rayas
    ],
    pantalones: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", // Jeans azul
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop", // Pantalón negro
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=300&h=300&fit=crop",  // Jeans claro
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop", // Jeans rotos
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=300&h=300&fit=crop"  // Chinos
    ],
    chaquetas: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", // Chaqueta denim
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop", // Chaqueta cuero
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",  // Chaqueta invierno
      "https://images.unsplash.com/photo-1591047530581-26786778c238?w=300&h=300&fit=crop", // Chaqueta bomber
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e5?w=300&h=300&fit=crop"  // Parka
    ],
    shorts: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop", // Shorts deportivos
      "https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=300&h=300&fit=crop", // Shorts jean
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop"  // Shorts casual
    ]
  };

  const subcategorias = [
    { id: 'poleras', nombre: 'Poleras' },
    { id: 'pantalones', nombre: 'Pantalones' },
    { id: 'chaquetas', nombre: 'Chaquetas' },
    { id: 'shorts', nombre: 'Shorts' }
  ];

  const obtenerImagenProducto = (product) => {
    if (!product) {
      return 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Producto+Hombre';
    }

    if (product.image && product.image !== '/img/placeholder.jpg' && !product.image.includes('placeholder')) {
      return product.image;
    }

    let tipoProducto = 'poleras'; 
    
    if (product.tipo) {
      tipoProducto = product.tipo.toLowerCase();
    } 
    else if (product.name || product.descripcion) {
      const textoBusqueda = `${product.name} ${product.descripcion}`.toLowerCase();
      
      if (textoBusqueda.includes('pantalon') || textoBusqueda.includes('jeans')) {
        tipoProducto = 'pantalones';
      } else if (textoBusqueda.includes('chaqueta') || textoBusqueda.includes('jacket')) {
        tipoProducto = 'chaquetas';
      } else if (textoBusqueda.includes('short')) {
        tipoProducto = 'shorts';
      }
    }

    const imagenesTipo = imagenesHombre[tipoProducto] || imagenesHombre.poleras;
    
    const imagenIndex = product.id ? (product.id % imagenesTipo.length) : 0;
    
    return imagenesTipo[imagenIndex];
  };

  const productosFiltrados = useMemo(() => {
    let filtered = products.filter(product => 
      product.categoria?.toLowerCase() === 'hombre'
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
                 textoBusqueda.includes('jeans');
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
      filtered = filtered.filter(product => product.oferta);
    }

    if (filtroPrecio) {
      switch (filtroPrecio) {
        case 'menor-10000':
          filtered = filtered.filter(product => product.price < 10000);
          break;
        case '10000-15000':
          filtered = filtered.filter(product => product.price >= 10000 && product.price <= 15000);
          break;
        case 'mayor-15000':
          filtered = filtered.filter(product => product.price > 15000);
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

  React.useEffect(() => {
    if (products.length > 0 && productosFiltrados.length > 0) {
      console.log('🖼️ Imágenes asignadas a productos:');
      productosFiltrados.slice(0, 3).forEach(product => {
        console.log('📦', {
          nombre: product.name,
          tipo: product.tipo,
          imagenAsignada: obtenerImagenProducto(product),
          imagenOriginal: product.image
        });
      });
    }
  }, [productosFiltrados]);

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
    product.categoria?.toLowerCase() === 'hombre'
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
                {productosFiltrados.map(product => (
                  <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 product-card">
                      <img 
                        src={obtenerImagenProducto(product)}
                        className="card-img-top" 
                        alt={product.name}
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          console.log('❌ Error cargando imagen para:', product.name);
                          e.target.src = `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=${encodeURIComponent(product.name)}`;
                        }}
                        onLoad={() => console.log('Imagen cargada para:', product.name)}
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

export default RopaHombre;
