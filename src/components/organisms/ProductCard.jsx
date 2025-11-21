import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Col>
    <Card className="h-100 text-center">
      <Card.Img variant="top" src={product.image} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text> 
        <Card.Text className="text-danger fw-bold">${product.price.toLocaleString()}</Card.Text>
        <Link to={`/producto/${product.id}`}>
          <Button variant="dark">Ver detalle</Button>
        </Link>
      </Card.Body>
    </Card>
  </Col>
);

export default ProductCard;
