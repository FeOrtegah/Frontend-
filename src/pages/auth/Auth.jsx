import { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });

  const toggleMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          "https://backend-fullstackv1.onrender.com/api/v1/usuarios/login",
          {
            correo: form.correo,
            contrasena: form.contrasena,
          }
        );

        localStorage.setItem("usuario", JSON.stringify(res.data));

        window.location.href = "/micuenta";
      } else {
        await axios.post(
          "https://backend-fullstackv1.onrender.com/api/v1/usuarios",
          form
        );

        alert("Cuenta creada correctamente");
        setIsLogin(true);
      }
    } catch {
      alert(isLogin ? "Correo o contraseña incorrectos" : "Error al crear la cuenta");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div className="card p-4 shadow" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-3">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              className="form-control"
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              className="form-control"
              type="password"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#d60000",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {isLogin ? "Ingresar" : "Registrarme"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={toggleMode}>
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
