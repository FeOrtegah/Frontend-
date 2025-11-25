import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductService from "/src/services/ProductService";
import './global.css';

const Products = ({ categoria, tipo, carrito, setCarrito }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => {
        const matchCategoria = !categoria || product.categoria === categoria;
        const matchTipo = !tipo || tipo === "todo" || product.tipo === tipo;
        return matchCategoria && matchTipo;
      });
      setFilteredProducts(filtered);
    }
  }, [products, categoria, tipo]);
  const getTitle = () => {
    if (tipo === "todo") {
      return `Todos los productos para ${categoria}`;
    }
    if (tipo && categoria) {
      return `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} para ${categoria}`;
    }
    if (categoria) {
      return `Ropa ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;
    }
    return "Todos los Productos";
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Error al cargar productos</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info">
          <h4>No se encontraron productos</h4>
          <p>
            {categoria || tipo 
              ? `No hay productos disponibles para ${categoria || tipo}`
              : "No hay productos disponibles en este momento"
            }
          </p>
          <Link to="/">
            <Button variant="primary">Ver todos los productos</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>{getTitle()}</h2>
        <p className="text-muted">
          Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id || product._id}>
            <Card className="h-100 text-center shadow-sm hover-shadow">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ 
                    height: "250px", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                  className="card-img-hover"
                />
                {/* Badges para ofertas y categorías */}
                <div className="position-absolute top-0 start-0 p-2">
                  {product.oferta && (
                    <Badge bg="danger" className="me-1">
                      OFERTA
                    </Badge>
                  )}
                  <Badge bg="secondary" className="text-capitalize">
                    {product.categoria}
                  </Badge>
                </div>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="flex-grow-0">
                  {product.name}
                </Card.Title>
                
                <div className="mb-2 flex-grow-0">
                  {product.originalPrice ? (
                    <div>
                      <span className="text-danger fw-bold fs-5">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-muted text-decoration-line-through ms-2">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-danger fw-bold fs-5">
                      ${product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Tipo de producto */}
                {product.tipo && (
                  <div className="mb-2">
                    <Badge bg="outline-dark" variant="outline" className="text-dark border">
                      {product.tipo}
                    </Badge>
                  </div>
                )}

                {/* Descripción corta */}
                {product.descripcion && (
                  <Card.Text className="text-muted small flex-grow-1">
                    {product.descripcion.length > 100 
                      ? `${product.descripcion.substring(0, 100)}...` 
                      : product.descripcion
                    }
                  </Card.Text>
                )}

                {/* SOLO BOTÓN VER DETALLES */}
                <div className="flex-grow-0">
                  <Link to={`/producto/${product.id || product._id}`}>
                    <Button variant="dark" className="w-100">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CSS para efecto hover */}
      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
        .card-img-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
    </Container>
  );
};

export default Products;
