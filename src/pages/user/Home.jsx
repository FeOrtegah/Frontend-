import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductService from "/src/services/ProductService"; 

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [productosOfertaAleatorios, setProductosOfertaAleatorios] = useState([]);
  const [shortsAnd1, setShortsAnd1] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState("");

  // Función para formatear precios de forma segura
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '0';
    const priceNumber = Number(price);
    if (isNaN(priceNumber)) return '0';
    return priceNumber.toLocaleString('es-CL');
  };

  // Función para calcular diferencia de precios
  const calcularAhorro = (precioOriginal, precioOferta) => {
    const original = Number(precioOriginal) || 0;
    const oferta = Number(precioOferta) || 0;
    if (original <= 0 || oferta <= 0 || original <= oferta) return '0';
    return formatPrice(original - oferta);
  };

  // Calcular tiempo restante para la oferta (3 días desde ahora)
  useEffect(() => {
    const calcularTiempoRestante = () => {
      const ahora = new Date();
      const finOferta = new Date();
      finOferta.setDate(ahora.getDate() + 3); // Oferta por 3 días
      
      const diferencia = finOferta - ahora;
      
      if (diferencia <= 0) {
        setTiempoRestante("Oferta finalizada");
        return;
      }
      
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      
      setTiempoRestante(`${dias}d ${horas}h ${minutos}m`);
    };
    
    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 60000); // Actualizar cada minuto
    
    return () => clearInterval(intervalo);
  }, []);

  const selectRandomOffers = (arr, n) => {
    const shuffled = [...arr];
    let i = arr.length;
    
    while (i > 0) {
      i--;
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllProducts();
        const allProducts = response.data || [];
        setProducts(allProducts);

        // Ofertas aleatorias normales - solo productos válidos
        const ofertasValidas = allProducts.filter(product => 
          product && 
          product.oferta && 
          (product.precio || product.price) && 
          product.id
        );
        
        const randomOffers = selectRandomOffers(ofertasValidas, 3);
        setProductosOfertaAleatorios(randomOffers);

        // Filtrar shorts AND1 específicos
        const shortsAnd1Products = allProducts.filter(product => 
          product && 
          product.id &&
          (
            (product.nombre && product.nombre.toLowerCase().includes('and1')) || 
            (product.name && product.name.toLowerCase().includes('and1'))
          )
        );
        
        // Si no hay productos AND1, usar shorts como ejemplo
        if (shortsAnd1Products.length === 0) {
          const shortsEjemplo = allProducts.filter(product => 
            product &&
            product.id &&
            (
              (product.tipo && product.tipo.toLowerCase() === 'shorts') ||
              (product.categoria && product.categoria.toLowerCase() === 'hombre')
            )
          ).slice(0, 2);
          
          // Agregar información de oferta especial a estos productos
          const shortsConOferta = shortsEjemplo.map(short => {
            const precioBase = Number(short.precio || short.price || 0);
            return {
              ...short,
              ofertaEspecial: true,
              precioOriginal: precioBase > 0 ? Math.round(precioBase * 1.3) : 0,
              precioOferta: precioBase,
              descuento: 30,
              limiteTiempo: true
            };
          });
          
          setShortsAnd1(shortsConOferta);
        } else {
          setShortsAnd1(shortsAnd1Products.map(short => {
            const precioBase = Number(short.precio || short.price || 0);
            return {
              ...short,
              ofertaEspecial: true,
              precioOriginal: precioBase > 0 ? Math.round(precioBase * 1.3) : 0,
              precioOferta: precioBase,
              descuento: 30,
              limiteTiempo: true
            };
          }));
        }

      } catch (err) {
        setError("Error cargando productos: " + err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <main className="home">
      {/* Novedades */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Novedades</h2>
          <p>Descubre las últimas tendencias de la temporada</p>
        </div>
        <div className="card border-0 shadow-sm">
          <img 
            src="/img/coño.webp" 
            className="card-img-top" 
            alt="Novedades" 
            style={{ height: "400px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
      </section>
      
      {/* OFERTAS EXCLUSIVAS AND1 - NUEVA SECCIÓN */}
      {shortsAnd1.length > 0 && (
        <section className="mb-5 py-4 bg-gradient" style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)' // Cambiado a negro
        }}>
          <Container>
            <div className="text-center mb-4 text-white">
              <Badge bg="dark" className="mb-2 fs-6 px-3 py-2 border border-light"> {/* Cambiado a negro */}
                ⚡ OFERTA EXCLUSIVA ⚡
              </Badge>
              <h2 className="fw-bold">Shorts AND1 - Edición Limitada</h2>
              <p className="lead">¡Oferta disponible por tiempo limitado!</p>
              
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                <div className="bg-dark text-white rounded p-2 border border-light">
                  <div className="fs-1 fw-bold">{tiempoRestante}</div>
                  <small>Termina la oferta</small>
                </div>
                <div className="bg-danger text-white rounded p-2">
                  <div className="fs-1 fw-bold">{shortsAnd1.length}</div>
                  <small>Modelos exclusivos</small>
                </div>
              </div>
              
              <p className="mb-0">
                <i className="bi bi-lightning-fill me-1"></i>
                Colección deportiva premium - Solo disponibles por 72 horas
              </p>
            </div>
            
            <Row xs={1} md={shortsAnd1.length} className="g-4 justify-content-center">
              {shortsAnd1.map((short, index) => {
                if (!short) return null;
                
                const nombre = short.nombre || short.name || 'Producto sin nombre';
                const descripcion = short.descripcion || short.description || 'Shorts deportivos AND1 de alta calidad';
                const precioOferta = short.precioOferta || short.precio || short.price || 0;
                const precioOriginal = short.precioOriginal;
                const descuento = short.descuento || 30;
                const ahorro = calcularAhorro(precioOriginal, precioOferta);
                
                return (
                  <Col key={short.id || index} className="d-flex">
                    <Card className="h-100 text-center position-relative border-0 shadow-lg flex-grow-1"
                      style={{ 
                        transform: 'translateY(0)',
                        transition: 'transform 0.3s',
                        overflow: 'hidden',
                        backgroundColor: '#f8f9fa'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div className="position-relative">
                        {/* Badges de oferta */}
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2 fs-6 px-3">
                          -{descuento}%
                        </Badge>
                        <Badge bg="dark" className="position-absolute top-0 end-0 m-2 fs-6 px-3 border border-light"> {/* Cambiado a negro */}
                          <i className="bi bi-clock me-1"></i> 72H
                        </Badge>
                        
                        <Card.Img
                          variant="top"
                          src={short.imagenUrl || short.image || '/images/placeholder.jpg'}
                          style={{ 
                            height: "300px", 
                            objectFit: "cover",
                            borderBottom: '3px solid #1a1a1a' // Cambiado a negro
                          }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold">{nombre}</Card.Title>
                        <Card.Text className="text-muted small flex-grow-1">
                          {descripcion}
                        </Card.Text>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <Card.Text className="text-success fw-bold fs-4 mb-0">
                              ${formatPrice(precioOferta)}
                            </Card.Text>
                            {precioOriginal && precioOriginal > precioOferta && (
                              <Card.Text className="text-decoration-line-through text-muted mb-0">
                                ${formatPrice(precioOriginal)}
                              </Card.Text>
                            )}
                          </div>
                          <small className="text-success">
                            <i className="bi bi-arrow-down-circle-fill me-1"></i>
                            Ahorras ${ahorro}
                          </small>
                        </div>
                        
                        <div className="mt-auto">
                          {short.id ? (
                            <Link to={`/producto/${short.id}`}>
                              <button className="btn btn-dark btn-lg w-100 fw-bold border-0" style={{ 
                                backgroundColor: '#000000',
                                color: 'white'
                              }}>
                                <i className="bi bi-bolt-fill me-2"></i>
                                COMPRAR AHORA
                              </button>
                            </Link>
                          ) : (
                            <button className="btn btn-dark btn-lg w-100 fw-bold border-0" disabled style={{ 
                              backgroundColor: '#333333',
                              color: 'white'
                            }}>
                              <i className="bi bi-bolt-fill me-2"></i>
                              NO DISPONIBLE
                            </button>
                          )}
                          <small className="text-muted d-block mt-2">
                            <i className="bi bi-truck me-1"></i>
                            Envío gratis • Stock limitado
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            
            <div className="text-center mt-4 text-white">
              <div className="alert alert-dark d-inline-flex align-items-center border border-light" role="alert" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <i className="bi bi-exclamation-triangle-fill text-light me-2 fs-4"></i> {/* Cambiado a blanco */}
                <div>
                  <strong>¡Última oportunidad!</strong> Esta oferta exclusiva finaliza en <strong>{tiempoRestante}</strong>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}
      
      {/* Ofertas Especiales (originales) */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Ofertas Especiales</h2>
            <p>Solo por tiempo limitado</p>
          </div>
          
          {productosOfertaAleatorios.length === 0 ? (
            <div className="text-center py-4">
              <p>No hay ofertas disponibles en este momento</p>
            </div>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {productosOfertaAleatorios.map((product) => {
                if (!product) return null;
                
                const nombre = product.nombre || product.name || 'Producto sin nombre';
                const precio = product.precio || product.price || 0;
                
                return (
                  <Col key={product.id || Math.random()}> 
                    <Card className="h-100 text-center position-relative">
                      <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                        OFERTA
                      </Badge>
                      
                      <Card.Img
                        variant="top"
                        src={product.imagenUrl || product.image || '/images/placeholder.jpg'}
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                      <Card.Body>
                        <Card.Title>{nombre}</Card.Title>
                        
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <Card.Text className="text-danger fw-bold fs-5 mb-0">
                            ${formatPrice(precio)}
                          </Card.Text>
                        </div>

                        <div className="mt-3">
                          {product.id ? (
                            <Link to={`/producto/${product.id}`}>
                              <button className="btn btn-dark btn-sm border-0" style={{ 
                                backgroundColor: '#000000',
                                color: 'white'
                              }}>
                                Ver detalle
                              </button>
                            </Link>
                          ) : (
                            <button className="btn btn-dark btn-sm border-0" disabled style={{ 
                              backgroundColor: '#333333',
                              color: 'white'
                            }}>
                              No disponible
                            </button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </section>

      {/* Modelos */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Modelos y representantes oficiales de EFA</h2>
            <p>Esteban, Antonio Y Felipe</p>
          </div>
          <Row xs={1} md={3} className="g-4">
            <Col>
              <div className="card border-0">
                <img 
                  src="/img/WhatsApp Image 2025-09-04 at 21.57.27 (2).webp" 
                  className="card-img-top" 
                  alt="Modelo 1" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            </Col>
            <Col>
              <div className="card border-0">
                <img 
                  src="/img/16.webp" 
                  className="card-img-top" 
                  alt="Modelo 2" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            </Col>
            <Col>
              <div className="card border-0">
                <img 
                  src="/img/WhatsApp Image 2025-09-04 at 21.57.27.webp" 
                  className="card-img-top" 
                  alt="Modelo 3" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Contador regresivo flotante */}
      {shortsAnd1.length > 0 && (
        <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1000 }}>
          <div className="card border-0 shadow-lg" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div className="card-body p-3 text-white text-center">
              <div className="small mb-1">
                <i className="bi bi-stopwatch me-1"></i>
                Oferta AND1 termina en
              </div>
              <div className="fw-bold fs-5">{tiempoRestante}</div>
              <small className="d-block mt-1">
                {shortsAnd1.length} productos disponibles
              </small>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
