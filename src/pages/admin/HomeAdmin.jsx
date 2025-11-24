// src/pages/admin/HomeAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

// Componente Modal simplificado
const ProductModal = ({ show, handleClose, handleSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    categoria: '',
    tipo: '',
    talla: '',
    descripcion: '',
    oferta: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Nombre del producto *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Precio *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Precio"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Precio original (opcional)</Form.Label>
                <Form.Control
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="Precio original"
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>URL de la imagen *</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select 
                  name="categoria" 
                  value={formData.categoria} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona categoría</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="infantil">Infantil</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Select 
                  name="tipo" 
                  value={formData.tipo} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tipo</option>
                  <option value="poleras">Poleras</option>
                  <option value="pantalones">Pantalones</option>
                  <option value="chaquetas">Chaquetas</option>
                  <option value="shorts">Shorts</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Tallas *</Form.Label>
                <Form.Select 
                  name="talla" 
                  value={formData.talla} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tallas</option>
                  <option value="S,M,L,XL">S, M, L, XL</option>
                  <option value="XS,S,M,L,XL">XS, S, M, L, XL</option>
                  <option value="28,30,32,34,36">28, 30, 32, 34, 36</option>
                  <option value="4-6,8-10,12-14">4-6, 8-10, 12-14 (Infantil)</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada del producto"
                />
              </Form.Group>
            </div>

            <div className="col-12">
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="oferta"
                  label="¿Producto en oferta?"
                  checked={formData.oferta}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creando...
              </>
            ) : (
              'Crear Producto'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Función simple para mensajes
const generarMensaje = (mensaje, tipo = 'info') => {
  console.log(`${tipo}: ${mensaje}`);
  alert(`${tipo}: ${mensaje}`);
};

const HomeAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Cargar productos desde localStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        setLoading(true);
        const savedProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
        setProducts(savedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        generarMensaje('Error al cargar productos', 'warning');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Guardar productos en localStorage
  const saveProducts = (newProducts) => {
    localStorage.setItem('adminProducts', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const handleCreateProduct = (formData) => {
    setSubmitLoading(true);
    
    // Simular delay de red
    setTimeout(() => {
      try {
        const newProduct = {
          ...formData,
          id: Date.now(),
          price: parseInt(formData.price),
          originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
          oferta: formData.oferta || false
        };

        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);
        
        setShowModal(false);
        generarMensaje('¡Producto creado con éxito!', 'success');
      } catch (error) {
        console.error('Error creating product:', error);
        generarMensaje('Error al crear el producto', 'warning');
      } finally {
        setSubmitLoading(false);
      }
    }, 1000);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      saveProducts(updatedProducts);
      generarMensaje('Producto eliminado correctamente', 'success');
    }
  };

  const getCategoriaBadge = (categoria) => {
    const variants = {
      hombre: 'primary',
      mujer: 'danger',
      infantil: 'success'
    };
    return <Badge bg={variants[categoria]}>{categoria}</Badge>;
  };

  const getTipoBadge = (tipo) => {
    return <Badge bg="secondary">{tipo}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Panel de Administración</h1>
          <p className="text-muted mb-0">Gestiona los productos de tu tienda</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="px-4 py-2"
        >
          + Agregar Producto
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h5>Total Productos</h5>
              <h2>{products.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body>
              <h5>En Oferta</h5>
              <h2>{products.filter(p => p.oferta).length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info text-white">
            <Card.Body>
              <h5>Hombre</h5>
              <h2>{products.filter(p => p.categoria === 'hombre').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning text-white">
            <Card.Body>
              <h5>Mujer</h5>
              <h2>{products.filter(p => p.categoria === 'mujer').length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de productos */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Productos</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No hay productos registrados</p>
              <Button 
                variant="primary"
                onClick={() => setShowModal(true)}
              >
                Crear Primer Producto
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Oferta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50?text=Imagen+no+disponible';
                          }}
                        />
                      </td>
                      <td>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.descripcion ? product.descripcion.substring(0, 50) + '...' : 'Sin descripción'}
                        </small>
                      </td>
                      <td>{getCategoriaBadge(product.categoria)}</td>
                      <td>{getTipoBadge(product.tipo)}</td>
                      <td>
                        <strong>${product.price?.toLocaleString()}</strong>
                        {product.originalPrice && (
                          <div>
                            <small className="text-muted text-decoration-line-through">
                              ${product.originalPrice?.toLocaleString()}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        {product.oferta ? (
                          <Badge bg="success">Sí</Badge>
                        ) : (
                          <Badge bg="secondary">No</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => generarMensaje('Función de editar próximamente', 'info')}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para crear producto */}
      <ProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleCreateProduct}
        loading={submitLoading}
      />
    </Container>
  );
};

export default HomeAdmin;