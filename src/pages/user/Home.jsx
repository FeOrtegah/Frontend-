import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductService from "/src/services/ProductService"; // Ajusta la ruta

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllProducts();
        setProducts(response.data);
      } catch (err) {
        setError("Error cargando productos: " + err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productosOferta = products.filter(product => product.oferta);

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
            style={{ height: "2000px" }} 
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
          
          {productosOferta.length === 0 ? (
            <div className="text-center py-4">
              <p>No hay ofertas disponibles en este momento</p>
            </div>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {productosOferta.map((product) => (
                <Col key={product.id || product._id}>
                  <Card className="h-100 text-center position-relative">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                      OFERTA
                    </Badge>
                    
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Card.Text className="text-danger fw-bold fs-5 mb-0">
                          ${product.price.toLocaleString()}
                        </Card.Text>
                        {product.originalPrice && (
                          <Card.Text className="text-muted text-decoration-line-through mb-0">
                            ${product.originalPrice.toLocaleString()}
                          </Card.Text>
                        )}
                      </div>
                      {product.originalPrice && (
                        <Badge bg="success" className="mt-1">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}

                      <div className="mt-3">
                        <Link to={`/producto/${product.id || product._id}`}>
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
};

{/* para actualizar*/}

export default Home;