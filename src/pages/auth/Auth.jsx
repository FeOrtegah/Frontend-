import React, { useState } from "react";
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

const Auth = ({ setUser }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
                const mensaje = errorData?.msg || "Correo o contrasena incorrectos. Por favor, verifica tus credenciales.";
                setError(mensaje);
                return;
            }

            console.log('🔍 Respuesta completa de login:', result);
            console.log('🔍 Datos del usuario:', result.data);

            const userData = {
                ...result.data,
                token: result.data.token || "mock-token-login"
            };
            
            const normalizedUser = {
                id: userData.id || userData._id || userData.usuarioId || 'N/A',
                nombre: userData.nombre || userData.name || userData.nombreCompleto || 'N/A',
                correo: userData.correo || userData.email || userData.mail || 'N/A',
                rol: userData.rol || userData.role || userData.tipo || 'Cliente',
                token: userData.token
            };

            console.log('✅ Usuario normalizado:', normalizedUser);
            
            sessionStorage.setItem("usuarioActivo", JSON.stringify(normalizedUser));
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            localStorage.setItem("userToken", normalizedUser.token);

            if (setUser) {
                setUser(normalizedUser);
                console.log('✅ Estado global actualizado:', normalizedUser);
            }

            setSuccess("Has iniciado sesion correctamente");

            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            setError("Ocurrio un error inesperado al intentar iniciar sesion.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegistro = async (e) => {
        e.preventDefault();

        const { nombre, email, password, confirmarPassword } = formData.registro;

        if (!validarEmail(email)) {
            setError("Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.duoc.cl");
            return;
        }

        if (password !== confirmarPassword) {
            setError("Las contrasenas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contrasena debe tener al menos 6 caracteres");
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
                let mensajeError = "Ocurrio un error inesperado al contactar al servidor.";
                
                if (errorData && typeof errorData === 'string' && errorData.includes('El correo ya esta registrado')) {
                    mensajeError = "El correo ya esta en uso. Intenta iniciar sesion.";
                } else if (errorData && errorData.message) {
                    mensajeError = errorData.message;
                } else if (errorData && errorData.msg) {
                    mensajeError = errorData.msg;
                }
                
                setError(mensajeError);
                return;
            }

            setSuccess("Cuenta creada exitosamente. Iniciando sesion...");
            
            const autoLoginResult = await UserService.login({ 
                correo: email, 
                contrasena: password 
            });

            if (!autoLoginResult.success) {
                const loginErrorData = autoLoginResult.error;
                const loginMensaje = loginErrorData?.msg || "Cuenta creada, pero el inicio de sesion automatico fallo. Por favor, inicia sesion manualmente.";
                setError(loginMensaje);
                setSuccess(null);
                return;
            }

            console.log('🔍 Respuesta completa de registro:', autoLoginResult);
            console.log('🔍 Datos del usuario:', autoLoginResult.data);

            const userData = {
                ...autoLoginResult.data,
                token: autoLoginResult.data.token || "mock-token-registro"
            };

            const normalizedUser = {
                id: userData.id || userData._id || userData.usuarioId || 'N/A',
                nombre: userData.nombre || userData.name || userData.nombreCompleto || 'N/A',
                correo: userData.correo || userData.email || userData.mail || 'N/A',
                rol: userData.rol || userData.role || userData.tipo || 'Cliente',
                token: userData.token
            };

            console.log('✅ Usuario normalizado:', normalizedUser);

            sessionStorage.setItem("usuarioActivo", JSON.stringify(normalizedUser));
            localStorage.setItem("user", JSON.stringify(normalizedUser));
            localStorage.setItem("userToken", normalizedUser.token);

            if (setUser) {
                setUser(normalizedUser);
                console.log('✅ Estado global actualizado:', normalizedUser);
            }

            setFormData((prev) => ({
                ...prev,
                registro: { 
                    nombre: "",
                    email: "",
                    password: "",
                    confirmarPassword: "",
                    telefono: "",
                    direccion: ""
                }
            }));

            setTimeout(() => navigate("/"), 1200);
            
        } catch (err) {
            setError("Ocurrio un error irrecuperable al procesar el registro.");
        } finally {
            setLoading(false);
        }
    };

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
                                <Tab eventKey="login" title="Iniciar Sesion">
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {success && <Alert variant="success">{success}</Alert>}

                                    <Form onSubmit={handleLogin}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo electronico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={formData.login.email}
                                                required
                                                onChange={(e) =>
                                                    handleInputChange("login", "email", e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Contrasena</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={formData.login.password}
                                                required
                                                onChange={(e) =>
                                                    handleInputChange("login", "password", e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Button
                                            style={{
                                                backgroundColor: "red",
                                                border: "none",
                                                fontWeight: "bold"
                                            }}
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
                                                "Iniciar Sesion"
                                            )}
                                        </Button>
                                    </Form>
                                </Tab>

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
                                                onChange={(e) =>
                                                    handleInputChange("registro", "nombre", e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo electronico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                required
                                                value={formData.registro.email}
                                                onChange={(e) =>
                                                    handleInputChange("registro", "email", e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Contrasena</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        required
                                                        minLength="6"
                                                        value={formData.registro.password}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "registro",
                                                                "password",
                                                                e.target.value
                                                            )
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
                                            style={{
                                                backgroundColor: "red",
                                                border: "none",
                                                fontWeight: "bold"
                                            }}
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
                                    <a href="/terminos">Terminos</a> y{" "}
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
