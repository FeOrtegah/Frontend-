import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Table, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrderService from "/src/services/OrderService";

const Carrito = ({ carrito, setCarrito }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    
    const nuevoCarrito = carrito.map((item, i) =>
      i === index ? { ...item, cantidad: newQuantity } : item
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const getTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = item.price || item.precio || 0;
      return total + (precio * (item.cantidad || 1));
    }, 0);
  };

  const handleProceedToPayment = async () => {
    if (carrito.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      navigate('/pago');
    } catch (err) {
      setError("Error al procesar el carrito: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos para continuar</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          className="mt-3"
        >
          Seguir Comprando
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Tu Carrito de Compras</h2>
      
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      
      <Table responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talla</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item, index) => {
            const precio = item.price || item.precio || 0;
            const subtotal = precio * (item.cantidad || 1);
            
            return (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      className="me-3"
                    />
                    <div>
                      <strong>{item.name}</strong>
                      {item.oferta && (
                        <Badge bg="danger" className="ms-2">OFERTA</Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td>{item.talla || "N/A"}</td>
                <td>${precio.toLocaleString()}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, (item.cantidad || 1) - 1)}
                    >
                      -
                    </Button>
                    <span>{item.cantidad || 1}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, (item.cantidad || 1) + 1)}
                      disabled={(item.cantidad || 1) >= 10}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>${subtotal.toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="text-end mt-4">
        <h4>Total: ${getTotal().toLocaleString()}</h4>
        
        <div className="d-flex justify-content-end gap-3 mt-3">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
          >
            Seguir Comprando
          </Button>
          
          <Button 
            variant="success" 
            size="lg" 
            onClick={handleProceedToPayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              'Proceder al Pago'
            )}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Carrito;
