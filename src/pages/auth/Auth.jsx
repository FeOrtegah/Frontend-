import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    Tabs,
    Tab
} from "react-bootstrap";
import UserService from '../../services/UserService.jsx';

const Auth = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 🚨 🚨 🚨  SI EL USUARIO YA ESTÁ LOGUEADO → REDIRIGIR A /mi-cuenta
    useEffect(() => {
        const usuario = sessionStorage.getItem("usuarioActivo");
        if (usuario) {
            navigate("/mi-cuenta");
        }
    }, []);

    const dominiosPermitidos = ["gmail.com", "duocuc.cl", "profesor.duoc.cl"];

    const [formData, setFormData] = useState({
        login: { email: "", password: "" },
        registro: {
            nombre: "",
            email: "",
            password: "",
            confirmarPassword: "",
            telefono: "", 
            direccion: "" 
        }
    });

    const validarEmail = (email) => {
        const dominio = email.split("@")[1];
        return dominiosPermitidos.includes(dominio);
    };

    const handleInputChange = (tab, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [tab]: { ...prev[tab], [field]: value }
        }));
        setError(null);
        setSuccess(null);
    };

    // ------------------------- LOGIN -------------------------
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = formData.login;

        try {
            setLoading(true);
            setError(null);

            const result = await UserService.login({ 
                correo: email, 
                contrasena: password 
            });

            if (!result.success) {
                const errorData = result.error;
                const mensaje =
                    errorData?.msg ||
                    "Correo o contraseña incorrectos. Por favor, verifica tus credenciales.";

                setError(mensaje);
                return;
            }

            const userData = {
                ...result.data,
                token: result.data.token || "mock-token-login"
            };

            sessionStorage.setItem("usuarioActivo", JSON.stringify(userData));
            localStorage.setItem("userToken", userData.token);

            setSuccess("Has iniciado sesión correctamente");

            setTimeout(() => navigate("/"), 1200);

        } catch (err) {
            setError("Ocurrió un error inesperado al intentar iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    // ------------------------- REGISTRO -------------------------
    const handleRegistro = async (e) => {
        e.preventDefault();

        const { nombre, email, password, confirmarPassword } = formData.registro;

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

            const registerResult = await UserService.createUser({
                nombre,
                correo: email,
                contrasena: password
            });

            if (!registerResult.success) {
                const errorData = registerResult.error;
                let mensajeError = "Ocurrió un error inesperado al contactar al servidor.";

                if (errorData && typeof errorData === "string" && errorData.includes("El correo ya esta registrado")) {
                    mensajeError = "El correo ya está en uso. Intenta iniciar sesión.";
                } else if (errorData?.message) {
                    mensajeError = errorData.message;
                } else if (errorData?.msg) {
                    mensajeError = errorData.msg;
                }

                setError(mensajeError);
                return;
            }

            setSuccess("Cuenta creada exitosamente. Iniciando sesión...");

            // ---------- AUTO LOGIN DESPUÉS DE REGISTRAR ----------
            const autoLoginResult = await UserService.login({
                correo: email,
                contrasena: password
            });

            if (!autoLoginResult.success) {
                const loginErrorData = autoLoginResult.error;
                const loginMensaje =
                    loginErrorData?.msg ||
                    "Cuenta creada, pero el inicio de sesión automático falló. Inicia sesión manualmente.";

                setError(loginMensaje);
                setSuccess(null);
                return;
            }

            const userData = {
                ...autoLoginResult.data,
                token: autoLoginResult.data.token || "mock-token-registro"
            };

            sessionStorage.setItem("usuarioActivo", JSON.stringify(userData));
            localStorage.setItem("userToken", userData.token);

            setTimeout(() => navigate("/"), 1200);

        } catch (err) {
            setError("Ocurrió un error irrecuperable al procesar el registro.");
        } finally {
            setLoading(false);
        }
    };

    // ------------------------- RENDER -------------------------
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-4">
                        <h2>
                            Bienvenido a <strong style={{ color: "red" }}>EFA</strong>
                        </h2>
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
                                {/* ---------------- LOGIN ---------------- */}
                                <Tab eventKey="login" title="Iniciar Sesión">
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {success && <Alert variant="success">{success}</Alert>}

                                    <Form onSubmit={handleLogin}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={formData.login.email}
                                                required
                                                onChange={(e) => handleInputChange("login", "email", e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={formData.login.password}
                                                required
                                                onChange={(e) => handleInputChange("login", "password", e.target.value)}
                                            />
                                        </Form.Group>

                                        <Button
                                            style={{ backgroundColor: "red", border: "none", fontWeight: "bold" }}
                                            type="submit"
                                            className="w-100 py-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Iniciando...
                                                </>
                                            ) : (
                                                "Iniciar Sesión"
                                            )}
                                        </Button>
                                    </Form>
                                </Tab>

                                {/* ---------------- REGISTRO ---------------- */}
                                <Tab eventKey="registro" title="Crear Cuenta">
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {success && <Alert variant="success">{success}</Alert>}

                                    <Form onSubmit={handleRegistro}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre completo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                required
                                                value={formData.registro.nombre}
                                                onChange={(e) => handleInputChange("registro", "nombre", e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                required
                                                value={formData.registro.email}
                                                onChange={(e) => handleInputChange("registro", "email", e.target.value)}
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Contraseña</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        required
                                                        value={formData.registro.password}
                                                        onChange={(e) =>
                                                            handleInputChange("registro", "password", e.target.value)
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Confirmar</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        required
                                                        value={formData.registro.confirmarPassword}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "registro",
                                                                "confirmarPassword",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button
                                            style={{ backgroundColor: "red", border: "none", fontWeight: "bold" }}
                                            type="submit"
                                            className="w-100 py-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Creando...
                                                </>
                                            ) : (
                                                "Crear Cuenta"
                                            )}
                                        </Button>
                                    </Form>
                                </Tab>
                            </Tabs>

                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    Al registrarte aceptas nuestros{" "}
                                    <a href="/terminos">Términos</a> y{" "}
                                    <a href="/privacidad">Privacidad</a>
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
