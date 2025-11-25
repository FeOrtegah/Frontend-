import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();

  return (
    <>
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
            <Link to="/auth">
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

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            Categorías
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>

        <div className="offcanvas-body">
          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => navigate("/hombre")}
          >
            Hombre
          </button>

          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => navigate("/mujer")}
          >
            Mujer
          </button>

          <button
            className="btn btn-outline-primary w-100"
            onClick={() => navigate("/infantil")}
          >
            Infantil
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
