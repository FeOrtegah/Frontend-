import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import ProductService from '../../services/ProductService';
import homeData from './HomeData';

const ProductModal = ({ show, handleClose, handleSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    precioOriginal: '',
    image: '',
    categoria: '',
    tipo: '',
    talla: '',
    descripcion: '',
    oferta: false,
    stock: ''
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
    
    const productData = {
      nombre: formData.nombre,
      precio: parseInt(formData.precio),
      precioOriginal: formData.precioOriginal ? parseInt(formData.precioOriginal) : null,
      image: formData.image,
      categoria: formData.categoria,
      tipo: formData.tipo,
      talla: formData.talla,
      descripcion: formData.descripcion,
      oferta: formData.oferta,
      stock: parseInt(formData.stock) || 0
    };

    handleSubmit(productData);
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
                  name="nombre"
                  value={formData.nombre}
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
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  placeholder="Precio"
                  required
                  min="0"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Precio original (opcional)</Form.Label>
                <Form.Control
                  type="number"
                  name="precioOriginal"
                  value={formData.precioOriginal}
                  onChange={handleInputChange}
                  placeholder="Precio original"
                  min="0"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Cantidad en stock"
                  required
                  min="0"
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

const HomeAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const getStats = () => {
    return {
      total: products.length,
      ofertas: products.filter(p => p.oferta).length,
      hombre: products.filter(p => (p.categorias && p.categorias.nombre.toLowerCase() === 'hombre') || p.categoria === 'hombre').length,
      mujer: products.filter(p => (p.categorias && p.categorias.nombre.toLowerCase() === 'mujer') || p.categoria === 'mujer').length
    };
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await ProductService.getAllProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        showAlert('Error al cargar productos: ' + result.error, 'danger');
      }
    } catch (error) {
      showAlert('Error al cargar productos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (productData) => {
    setSubmitLoading(true);
    try {
      const result = await ProductService.createProduct(productData);
      
      if (result.success) {
        showAlert('¡Producto creado con éxito!', 'success');
        setShowModal(false);
        await loadProducts();
      } else {
        showAlert('Error al crear producto: ' + result.error, 'danger');
      }
    } catch (error) {
      showAlert('Error al crear producto', 'danger');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const result = await ProductService.deleteProduct(productId);
        if (result.success) {
          showAlert('Producto eliminado correctamente', 'success');
          await loadProducts();
        } else {
          showAlert('Error al eliminar producto: ' + result.error, 'danger');
        }
      } catch (error) {
        showAlert('Error al eliminar producto', 'danger');
      }
    }
  };

  const getCategoriaBadge = (categoria) => {
    const variants = { hombre: 'primary', mujer: 'danger', infantil: 'success', desconocido: 'warning' };
    const key = categoria ? categoria.toLowerCase() : 'desconocido';
    return <Badge bg={variants[key] || 'secondary'}>{categoria || 'Sin Categoría'}</Badge>;
  };

  const getTipoBadge = (tipo) => <Badge bg="secondary">{tipo || 'N/A'}</Badge>;

  const stats = getStats();

  return (
    <Container fluid className="py-4">
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
          {alert.message}
        </Alert>
      )}

      {homeData.map((section, index) => {
        switch (section.type) {
          case "text":
            return (
              <div key={index} className={section.className}>
                {section.text.map(textItem => (
                  <div key={textItem.id} className={textItem.className}>
                    {textItem.content}
                  </div>
                ))}
              </div>
            );

          case "stats":
            return (
              <Row key={index} className={section.className}>
                {section.stats.map((stat, statIndex) => (
                  <Col md={3} key={statIndex}>
                    <Card className={`bg-${stat.color} text-white`}>
                      <Card.Body>
                        <h5>{stat.title}</h5>
                        <h2>{stats[stat.key]}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            );

          case "button":
            return (
              <div key={index} className={section.className}>
                <Button 
                  variant={section.variant} 
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2"
                >
                  {section.text}
                </Button>
              </div>
            );

          case "table":
            return (
              <Card key={index} className={section.className}>
                <Card.Header>
                  <h5 className="mb-0">{section.title}</h5>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </Spinner>
                      <p className="mt-2">Cargando productos...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">No hay productos registrados</p>
                      <Button variant="primary" onClick={() => setShowModal(true)}>
                        Crear Primer Producto
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            {section.columns.map((column, colIndex) => (
                              <th key={colIndex}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>
                                <img 
                                  src={product.imagenUrl || product.image || 'https://via.placeholder.com/50x50?text=S/I'} 
                                  alt={product.nombre}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  className="rounded"
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=S/I'; }}
                                />
                              </td>
                              <td>
                                <strong>{product.nombre}</strong>
                                <br />
                                <small className="text-muted">
                                  {product.descripcion ? product.descripcion.substring(0, 50) + '...' : 'Sin descripción'}
                                </small>
                              </td>
                              <td>{getCategoriaBadge(product.categorias ? product.categorias.nombre : product.categoria)}</td>
                              <td>{getTipoBadge(product.tipo)}</td>
                              <td>
                                <strong>${product.precio?.toLocaleString()}</strong>
                                {product.precioOriginal && (
                                  <div>
                                    <small className="text-muted text-decoration-line-through">
                                      ${product.precioOriginal?.toLocaleString()}
                                    </small>
                                  </div>
                                )}
                              </td>
                              <td>
                                <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                                  {product.stock}
                                </Badge>
                              </td>
                              <td>{product.oferta ? <Badge bg="success">Sí</Badge> : <Badge bg="secondary">No</Badge>}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button variant="warning" size="sm" onClick={() => showAlert('Función de editar próximamente', 'info')}>
                                    Editar
                                  </Button>
                                  <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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
            );

          default:
            return null;
        }
      })}

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
