import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();

  const closeOffcanvas = () => {
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

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <nav className="navbar bg-white border-bottom py-2">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          <button
            className="btn p-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon" style={{ fontSize: '0.8rem' }}></span>
          </button>

          <Link to="/" className="navbar-brand p-0">
            <img 
              src="/img/logo.webp" 
              alt="EFA" 
              style={{ height: '35px', width: 'auto', maxWidth: '100px' }}
            />
          </Link>

          <div className="iconos-derecha d-flex align-items-center">
            <Link to="/auth" className="btn p-1 me-2"> 
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>perm_identity</span>
            </Link>

            <Link to="/carrito" className="btn p-1 position-relative">
              <span className="material-icons" style={{ fontSize: '1.2rem' }}>shopping_cart</span>
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {carrito.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS - BOTONES MÁS COMPACTOS */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header py-3">
          <h5 className="offcanvas-title fs-6" id="offcanvasMenuLabel">
            Menú Principal
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        
        <div className="offcanvas-body d-grid gap-1 p-3">
          
          {/* BOTONES MÁS COMPACTOS */}
          <button
            className="btn btn-outline-secondary text-start py-1 px-2 fs-6"
            onClick={() => handleNavigation("/hombre")}
          >
            Hombre
          </button>

          <button
            className="btn btn-outline-secondary text-start py-1 px-2 fs-6"
            onClick={() => handleNavigation("/mujer")}
          >
            Mujer
          </button>

          <button
            className="btn btn-outline-secondary text-start py-1 px-2 fs-6"
            onClick={() => handleNavigation("/infantil")}
          >
            Infantil
          </button>
          
          <hr className="my-2" />

          <button
            className="btn btn-outline-secondary text-start py-1 px-2 fs-6"
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
