import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tabs, Tab } from "react-bootstrap";
import axios from "axios";

const API = "https://backend-fullstackv1.onrender.com/api/v1/usuarios";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const dominiosPermitidos = ["gmail.com", "duocuc.cl", "profesor.duoc.cl"];

  const [formData, setFormData] = useState({
    login: { correo: "", contrasena: "" },
    registro: { 
      nombre: "", 
      correo: "", 
      contrasena: "", 
      confirmarPassword: ""
    },
  });

  const validarEmail = (email) => {
    const dominio = email.split("@")[1];
    return dominiosPermitidos.includes(dominio);
  };

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value }
    }));
    setError(null);
    setSuccess(null);
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const { correo, contrasena } = formData.login;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API}/login`, { correo, contrasena });

      sessionStorage.setItem("usuarioActivo", JSON.stringify(response.data));

      setSuccess("Has iniciado sesión correctamente");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  // REGISTRO
  const handleRegistro = async (e) => {
    e.preventDefault();
    const { nombre, correo, contrasena, confirmarPassword } = formData.registro;

    if (!validarEmail(correo)) {
      setError("Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.duoc.cl");
      return;
    }

    if (contrasena !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await axios.post(API, {
        nombre,
        correo,
        contrasena,
        rol: { id: 2 }
      });
      
      const loginRes = await axios.post(`${API}/login`, {
        correo,
        contrasena
      });

      sessionStorage.setItem("usuarioActivo", JSON.stringify(loginRes.data));

      setSuccess("Cuenta creada correctamente ✔ Iniciando sesión...");

      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setError("Error al crear la cuenta. El correo puede estar en uso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-4">
            <img
              src="/img/logo.png"
              alt="EFA"
              style={{ height: "80px", cursor: "pointer", marginBottom: "1rem" }}
              onClick={() => navigate("/")}
            />
            <h2>Bienvenido a <strong className="text-primary">EFA</strong></h2>
            <p className="text-muted">Tu tienda de moda preferida</p>
          </div>

          <Card className="shadow-lg">
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(tab) => { setActiveTab(tab); setError(null); setSuccess(null); }} className="mb-4" justify>
                
                {/*LOGIN */}
                <Tab eventKey="login" title="Iniciar Sesión">
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control type="email" value={formData.login.correo} required 
                        onChange={(e) => handleInputChange("login", "correo", e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control type="password" value={formData.login.contrasena} required 
                        onChange={(e) => handleInputChange("login", "contrasena", e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                      {loading ? <> <Spinner animation="border" size="sm" /> Iniciando...</> : "Iniciar Sesión"}
                    </Button>
                  </Form>
                </Tab>

                {/*REGISTRO */}
                <Tab eventKey="registro" title="Crear Cuenta">
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form onSubmit={handleRegistro}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control type="text" value={formData.registro.nombre} required
                        onChange={(e) => handleInputChange("registro", "nombre", e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo</Form.Label>
                      <Form.Control type="email" value={formData.registro.correo} required
                        onChange={(e) => handleInputChange("registro", "correo", e.target.value)} />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contraseña</Form.Label>
                          <Form.Control type="password" value={formData.registro.contrasena} required minLength="6"
                            onChange={(e) => handleInputChange("registro", "contrasena", e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmar contraseña</Form.Label>
                          <Form.Control type="password" value={formData.registro.confirmarPassword} required
                            onChange={(e) => handleInputChange("registro", "confirmarPassword", e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="success" type="submit" className="w-100 py-2" disabled={loading}>
                      {loading ? <> <Spinner animation="border" size="sm" /> Creando...</> : "Crear Cuenta"}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Al registrarte, aceptas nuestros <a href="/terminos">Términos</a> y <a href="/privacidad">Privacidad</a>
                </small>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;
