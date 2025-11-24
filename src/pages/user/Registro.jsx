import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tabs, Tab } from "react-bootstrap";
import UserService from "../../services/UserService";

const Registro = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    login: { email: "", password: "" },
    registro: { 
      nombre: "", 
      email: "", 
      password: "", 
      confirmarPassword: "",
      telefono: "",
      direccion: ""
    },
  });

  const dominiosPermitidos = ["gmail.com", "duocuc.cl", "profesor.duoc.cl"];

  const validarEmail = (email) => {
    const dominio = email.split("@")[1];
    return dominiosPermitidos.includes(dominio);
  };

  const handleInputChange = (tab, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));

    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData.login;

    try {
      setLoading(true);
      setError(null);

      const response = await UserService.login({
        email: email,
        password: password
      });

      const userData = {
        ...response.data.user,
        token: response.data.token
      };
      
      sessionStorage.setItem("usuarioActivo", JSON.stringify(userData));
      localStorage.setItem("userToken", response.data.token);

      setSuccess("Has iniciado sesión correctamente");
      setFormData((prev) => ({ ...prev, login: { email: "", password: "" } }));
      
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setError("Correo o contraseña incorrectos");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmarPassword, telefono, direccion } = formData.registro;

    if (!validarEmail(email)) {
      setError("Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.duoc.cl");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await UserService.createUser({
        nombre: nombre,
        email: email,
        password: password,
        telefono: telefono || "",
        direccion: direccion || "",
        rol: "cliente"
      });

      setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión");
      setFormData((prev) => ({
        ...prev,
        registro: { 
          nombre: "", 
          email: "", 
          password: "", 
          confirmarPassword: "",
          telefono: "",
          direccion: ""
        },
      }));

      setTimeout(() => setActiveTab("login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la cuenta. El email ya puede estar en uso.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const demoUser = {
        email: "demo@efa.com",
        password: "demo123"
      };

      const response = await UserService.login(demoUser);
      
      const userData = {
        ...response.data.user,
        token: response.data.token
      };
      
      sessionStorage.setItem("usuarioActivo", JSON.stringify(userData));
      localStorage.setItem("userToken", response.data.token);

      setSuccess("Sesión demo iniciada correctamente");
      
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setError("Error al iniciar sesión demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Header con logo */}
          <div className="text-center mb-4">
            <img
              src="/img/logo.png"
              alt="EFA"
              style={{ 
                height: "80px", 
                cursor: "pointer",
                marginBottom: "1rem"
              }}
              onClick={() => navigate("/")}
            />
            <h2>Bienvenido a <strong className="text-primary">EFA</strong></h2>
            <p className="text-muted">Tu tienda de moda preferida</p>
          </div>

          <Card className="shadow-lg">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => {
                  setActiveTab(tab);
                  setError(null);
                  setSuccess(null);
                }}
                className="mb-4"
                justify
              >
                {/* Pestaña de Login */}
                <Tab eventKey="login" title="Iniciar Sesión">
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.login.email}
                        onChange={(e) => handleInputChange("login", "email", e.target.value)}
                        required
                        placeholder="tu@email.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        value={formData.login.password}
                        onChange={(e) => handleInputChange("login", "password", e.target.value)}
                        required
                        placeholder="Tu contraseña"
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Iniciando Sesión...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>
                  </Form>

                  {/* Botón de demo */}
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleDemoLogin}
                      disabled={loading}
                    >
                      Acceso Demo
                    </Button>
                  </div>
                </Tab>

                {/* Pestaña de Registro */}
                <Tab eventKey="registro" title="Crear Cuenta">
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Form onSubmit={handleRegistro}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.registro.nombre}
                        onChange={(e) => handleInputChange("registro", "nombre", e.target.value)}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.registro.email}
                        onChange={(e) => handleInputChange("registro", "email", e.target.value)}
                        required
                        placeholder="tu@email.com"
                      />
                      <Form.Text className="text-muted">
                        Solo se permiten: @gmail.com, @duocuc.cl, @profesor.duoc.cl
                      </Form.Text>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            value={formData.registro.password}
                            onChange={(e) => handleInputChange("registro", "password", e.target.value)}
                            required
                            placeholder="Mínimo 6 caracteres"
                            minLength="6"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmar contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            value={formData.registro.confirmarPassword}
                            onChange={(e) => handleInputChange("registro", "confirmarPassword", e.target.value)}
                            required
                            placeholder="Repite tu contraseña"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono (Opcional)</Form.Label>
                      <Form.Control
                        type="tel"
                        value={formData.registro.telefono}
                        onChange={(e) => handleInputChange("registro", "telefono", e.target.value)}
                        placeholder="+56 9 1234 5678"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Dirección (Opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.registro.direccion}
                        onChange={(e) => handleInputChange("registro", "direccion", e.target.value)}
                        placeholder="Tu dirección completa"
                      />
                    </Form.Group>

                    <Button
                      variant="success"
                      type="submit"
                      className="w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creando Cuenta...
                        </>
                      ) : (
                        'Crear Cuenta'
                      )}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              {/* Información adicional */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Al registrarte, aceptas nuestros{" "}
                  <a href="/terminos" className="text-decoration-none">Términos de Servicio</a>{" "}
                  y nuestra{" "}
                  <a href="/privacidad" className="text-decoration-none">Política de Privacidad</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
};

export default Registro;