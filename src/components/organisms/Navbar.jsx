import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();

  const closeOffcanvas = () => {
    // Intenta obtener la instancia de Offcanvas de Bootstrap para cerrarla.
    const offcanvas = document.getElementById('offcanvasMenu');
    if (offcanvas && window.bootstrap && window.bootstrap.Offcanvas) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  };

  const handleNavigation = (path) => {
    closeOffcanvas();
    navigate(path);
  };

  const buttonStyle = {
    backgroundColor: "red",
    color: "white",
    fontWeight: "bold",
    border: "none"
  };

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <nav className="navbar bg-white border-bottom">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          <button
            className="btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className="navbar-brand">
            <img 
              src="/img/logo.webp" 
              alt="EFA" 
              style={{ height: '40px', width: 'auto', maxWidth: '120px' }}
            />
          </Link>

          <div className="iconos-derecha d-flex align-items-center">
            <Link to="/auth" className="btn me-3"> 
              <span className="material-icons">perm_identity</span>
            </Link>

            <Link to="/carrito" className="btn position-relative">
              <span className="material-icons">shopping_cart</span>
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carrito.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            Menú Principal
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        
        <div className="offcanvas-body d-grid gap-3">
          
          {/* BOTÓN HOMBRE (ROJO) */}
          <button
            className="btn py-2"
            style={buttonStyle}
            onClick={() => handleNavigation("/hombre")}
          >
            Hombre
          </button>

          {/* BOTÓN MUJER (ROJO) */}
          <button
            className="btn py-2"
            style={buttonStyle}
            onClick={() => handleNavigation("/mujer")}
          >
            Mujer
          </button>

          {/* BOTÓN INFANTIL (ROJO) */}
          <button
            className="btn py-2"
            style={buttonStyle}
            onClick={() => handleNavigation("/infantil")}
          >
            Infantil
          </button>
          
          <hr />

          {/* BOTÓN MI CUENTA (REDIRECCIÓN AUTOMÁTICA) */}
          <button
            className="btn btn-outline-secondary py-2"
            onClick={() => handleNavigation("/micuenta")}
          >
            Ver mi cuenta
          </button>
          
        </div>
      </div>
    </>
  );
};

export default Navbar;
