import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Alert, Spinner, Modal } from "react-bootstrap";
import UserService from "/src/services/UserService"; // Ajusta la ruta según tu estructura

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ titulo: "", texto: "" });

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setLoading(true);
        
        // Verificar si hay usuario en sessionStorage
        const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
        
        if (usuarioActivo && usuarioActivo.token) {
          // Aquí podrías validar el token con el backend
          // const userData = await UserService.verifyToken(usuarioActivo.token);
          setUsuario(usuarioActivo);
        } else {
          showMessage("Información", "No hay ningún usuario iniciado");
          setTimeout(() => navigate('/registro'), 2000);
        }
      } catch (err) {
        setError("Error verificando sesión: " + err.message);
        showMessage("Error", "Sesión inválida. Por favor inicie sesión nuevamente.");
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [navigate]);

  const cerrarSesion = async () => {
    try {
    
      sessionStorage.removeItem("usuarioActivo");
      localStorage.removeItem("carrito");
      
      showMessage("Sesión cerrada", "Has cerrado sesión correctamente");
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      sessionStorage.removeItem("usuarioActivo");
      showMessage("Sesión cerrada", "Sesión cerrada localmente");
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const showMessage = (titulo, texto) => {
    setModalContent({ titulo, texto });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalContent.titulo === "Sesión cerrada") {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Verificando sesión...</p>
      </Container>
    );
  }

  if (error && !usuario) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Ir al Login
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <h4>No hay usuario activo</h4>
          <p>Redirigiendo al registro...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>Mi Cuenta</h2>
        <p className="text-muted">Gestiona tu información personal</p>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Datos del Usuario</h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nombre:</strong></p>
              <p><strong>Email:</strong></p>
              <p><strong>ID de Usuario:</strong></p>
            </div>
            <div className="col-md-6">
              <p>{usuario.nombre || "No disponible"}</p>
              <p>{usuario.email || "No disponible"}</p>
              <p className="text-muted">{usuario.id || usuario._id || "N/A"}</p>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
          >
            Seguir Comprando
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={cerrarSesion}
          >
            Cerrar Sesión
          </Button>
        </Card.Footer>
      </Card>

      {/* Sección adicional para futuras funcionalidades */}
      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h6 className="mb-0">Mis Pedidos</h6>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            {usuario.pedidos && usuario.pedidos.length > 0 
              ? `Tienes ${usuario.pedidos.length} pedidos realizados`
              : "Aún no has realizado ningún pedido"}
          </p>
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => navigate('/pedidos')}
            disabled={!usuario.pedidos || usuario.pedidos.length === 0}
          >
            Ver Mis Pedidos
          </Button>
        </Card.Body>
      </Card>

      {/* Modal de Bootstrap */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.texto}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            {modalContent.titulo === "Sesión cerrada" ? "Ir a la Tienda" : "Cerrar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MiCuenta;