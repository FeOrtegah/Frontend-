import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Form, Alert, Badge, Spinner } from "react-bootstrap";
import ProductService from "/src/services/ProductService";

const ProductDetail = ({ carrito, setCarrito }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("S");
  const [cantidad, setCantidad] = useState(1);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError("Error cargando producto: " + err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.talla) {
      const tallas = product.talla.split(',');
      if (tallas.length > 0) {
        setTallaSeleccionada(tallas[0].trim());
      }
    }
  }, [product]);

  const handleAddCart = () => {
    if (!product) return;

    const productoConDetalles = {
      ...product,
      talla: tallaSeleccionada,
      cantidad: cantidad
    };

    const existing = carrito.find((item) => 
      item.id === product.id && item.talla === tallaSeleccionada
    );

    let nuevoCarrito;

    if (existing) {
      nuevoCarrito = carrito.map((item) =>
        item.id === product.id && item.talla === tallaSeleccionada
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, productoConDetalles];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const cambiarCantidad = (valor) => {
    const nuevaCantidad = cantidad + valor;
    if (nuevaCantidad >= 1 && nuevaCantidad <= 10) {
      setCantidad(nuevaCantidad);
    }
  };

  const cantidadEnCarrito = carrito
    .filter((item) => item.id === product?.id)
    .reduce((total, item) => total + item.cantidad, 0);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando producto...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">
          <h4>Error al cargar el producto</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h4>Producto no encontrado</h4>
          <p>El producto que buscas no existe o ha sido removido.</p>
        </Alert>
      </Container>
    );
  }

  const tallasDisponibles = product.talla ? product.talla.split(',').map(t => t.trim()) : ['S', 'M', 'L', 'XL'];

  return (
    <Container className="my-5">
      <Row>
        {/* Imagen del producto */}
        <Col md={6}>
          <img 
            src={product.image} 
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "500px", objectFit: "contain", width: "100%" }}
          />
        </Col>

        {/* Información del producto */}
        <Col md={6}>
          <h1 className="fw-bold mb-3">{product.name}</h1>
          
          {/* Categoría y tipo */}
          <div className="mb-2">
            <Badge bg="secondary" className="me-2 text-capitalize">
              {product.categoria}
            </Badge>
            <Badge bg="outline-secondary" className="text-dark border text-capitalize">
              {product.tipo}
            </Badge>
            {product.oferta && (
              <Badge bg="danger" className="ms-2">
                OFERTA
              </Badge>
            )}
          </div>
          
          {/* Precio con descuento si es oferta */}
          <div className="mb-4">
            {product.originalPrice ? (
              <div>
                <span className="text-danger fw-bold fs-3">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-muted text-decoration-line-through ms-2 fs-5">
                  ${product.originalPrice.toLocaleString()}
                </span>
                <Badge bg="success" className="ms-2">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            ) : (
              <span className="text-danger fw-bold fs-3">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Descripción del producto */}
          {product.descripcion && (
            <div className="mb-4">
              <h6 className="fw-bold">Descripción:</h6>
              <p className="text-muted">{product.descripcion}</p>
            </div>
          )}

          {/* Selección de talla */}
          <div className="mb-3">
            <label className="form-label fw-bold">Talla:</label>
            <Form.Select 
              value={tallaSeleccionada}
              onChange={(e) => setTallaSeleccionada(e.target.value)}
              size="lg"
            >
              {tallasDisponibles.map((talla) => (
                <option key={talla} value={talla}>
                  {talla}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Selección de cantidad */}
          <div className="mb-4">
            <label className="form-label fw-bold">Cantidad:</label>
            <div className="input-group" style={{ width: "130px" }}>
              <Button
                variant="outline-secondary"
                onClick={() => cambiarCantidad(-1)}
                disabled={cantidad <= 1}
              >
                -
              </Button>
              <Form.Control 
                type="number" 
                className="text-center" 
                value={cantidad}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 10) setCantidad(value);
                }}
                min="1"
                max="10"
              />
              <Button
                variant="outline-secondary"
                onClick={() => cambiarCantidad(1)}
                disabled={cantidad >= 10}
              >
                +
              </Button>
            </div>
          </div>

          {/* Alerta de producto agregado */}
          {mostrarAlerta && (
            <Alert variant="success" className="text-center">
              <strong>¡{product.name} agregado al carrito!</strong>
            </Alert>
          )}

          {/* Botón agregar al carrito con precio total */}
          <div className="mb-3">
            <Button
              variant="dark"
              size="lg"
              onClick={handleAddCart}
              className="w-100 py-3"
              disabled={!product}
            >
              <strong>Agregar al carrito - ${(product.price * cantidad).toLocaleString()}</strong>
            </Button>
          </div>

          {/* Información en carrito */}
          {cantidadEnCarrito > 0 && (
            <Alert variant="info" className="text-center">
              <strong>En tu carrito:</strong> {cantidadEnCarrito} unidad(es) de este producto
            </Alert>
          )}

          {/* Información adicional del producto */}
          <div className="mt-4">
            <h6 className="fw-bold">Características:</h6>
            <ul className="text-muted">
              <li>Material premium de alta calidad</li>
              <li>Diseño exclusivo EFA</li>
              <li>Entrega rápida y segura</li>
              <li>Garantía de satisfacción</li>
            </ul>
            
            <h6 className="fw-bold mt-3">Tallas disponibles:</h6>
            <p className="text-muted">{tallasDisponibles.join(', ')}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
