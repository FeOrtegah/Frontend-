import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductService from "/src/services/ProductService"; 
import "./styles/global.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]); // ✅ AGREGADO
  const [productosOfertaAleatorios, setProductosOfertaAleatorios] = useState([]);

  // Función para seleccionar 'n' elementos aleatorios de un array
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
        const allProducts = response.data;
        setProducts(allProducts); // ✅ AHORA FUNCIONA

        // 1. Filtrar solo los productos que están en oferta
        const ofertas = allProducts.filter(product => product.oferta);
        
        // 2. Seleccionar hasta 3 ofertas aleatorias
        const randomOffers = selectRandomOffers(ofertas, 3);
        
        setProductosOfertaAleatorios(randomOffers);

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
            style={{ height: "400px", objectFit: "cover" }} // ✅ CORREGIDO
          />
        </div>
      </section>
      
      {/* Ofertas Especiales */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Ofertas Especiales</h2>
            <p>Solo por tiempo limitado</p>
            <p>(Shorts exclusivos disponibles por tiempo limitado)</p>
          </div>
          
          {productosOfertaAleatorios.length === 0 ? (
            <div className="text-center py-4">
              <p>No hay ofertas disponibles en este momento</p>
            </div>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {productosOfertaAleatorios.map((product) => (
                <Col key={product.id}> 
                  <Card className="h-100 text-center position-relative">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      OFERTA
                    </Badge>
                    
                    <Card.Img
                      variant="top"
                      src={product.imagenUrl || '/images/placeholder.jpg'} // ✅ MEJORADO
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{product.nombre}</Card.Title>
                      
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Card.Text className="text-danger fw-bold fs-5 mb-0">
                          ${product.precio ? product.precio.toLocaleString() : 'N/A'}
                        </Card.Text>
                      </div>

                      <div className="mt-3">
                        <Link to={`/producto/${product.id}`}>
                          <button className="btn btn-dark btn-sm">Ver detalle</button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
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
                />
              </div>
            </Col>
            <Col>
              <div className="card border-0">
                <img 
                  src="/img/16.webp" 
                  className="card-img-top" 
                  alt="Modelo 2" 
                />
              </div>
            </Col>
            <Col>
              <div className="card border-0">
                <img 
                  src="/img/WhatsApp Image 2025-09-04 at 21.57.27.webp" 
                  className="card-img-top" 
                  alt="Modelo 3" 
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default Home;
