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
      <nav className="navbar bg-white border-bottom py-2">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          <button
            className="btn p-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className="navbar-brand p-0">
            <img 
              src="/img/logo.webp" 
              alt="EFA" 
              style={{ height: '35px', width: 'auto' }}
            />
          </Link>

          <div className="iconos-derecha d-flex align-items-center">
            <Link to="/auth" className="btn p-1 me-2 text-dark"> 
              <span className="material-icons">person</span>
            </Link>

            <Link to="/carrito" className="btn p-1 position-relative text-dark">
              <span className="material-icons">shopping_cart</span>
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
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
        <div className="offcanvas-header border-bottom py-3">
          <h5 className="offcanvas-title fw-bold text-dark" id="offcanvasMenuLabel">
            Menú Principal
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        
        <div className="offcanvas-body p-0">
          
          {/* CATEGORÍAS PRINCIPALES */}
          <div className="p-3">
            <div className="menu-category fw-semibold text-muted small mb-2">CATEGORÍAS</div>
            
            <button
              className="btn w-100 text-start p-3 border-bottom text-dark d-flex justify-content-between align-items-center"
              onClick={() => handleNavigation("/hombre")}
              style={{ 
                transition: 'all 0.2s ease',
                border: 'none',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span className="fw-medium">Hombre</span>
              <span className="text-muted">→</span>
            </button>

            <button
              className="btn w-100 text-start p-3 border-bottom text-dark d-flex justify-content-between align-items-center"
              onClick={() => handleNavigation("/mujer")}
              style={{ 
                transition: 'all 0.2s ease',
                border: 'none',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span className="fw-medium">Mujer</span>
              <span className="text-muted">→</span>
            </button>

            <button
              className="btn w-100 text-start p-3 text-dark d-flex justify-content-between align-items-center"
              onClick={() => handleNavigation("/infantil")}
              style={{ 
                transition: 'all 0.2s ease',
                border: 'none',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <span className="fw-medium">Infantil</span>
              <span className="text-muted">→</span>
            </button>
          </div>
          <div className="border-top p-3 bg-light">
            <button
              className="btn w-100 text-start p-3 text-dark d-flex justify-content-between align-items-center"
              onClick={() => handleNavigation("/micuenta")}
              style={{ 
                transition: 'all 0.2s ease',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <span className="fw-medium">Ver mi cuenta</span>
              <span className="material-icons text-muted" style={{ fontSize: '1.2rem' }}>person</span>
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Navbar;
