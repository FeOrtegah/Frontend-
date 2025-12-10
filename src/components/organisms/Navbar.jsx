import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo3D from "../Logo3D/Logo3D"; 

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();

  const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));

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

  const handleUserClick = () => {
    if (usuarioActivo) {
      navigate("/micuenta");
    } else {
      navigate("/auth");
    }
  };

  const handleAccountClick = () => {
    closeOffcanvas();
    if (usuarioActivo) {
        navigate("/micuenta");
    } else {
        navigate("/auth");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    closeOffcanvas();
  };

  return (
    <>
      <nav className="navbar bg-white border-bottom py-2">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          {/* Botón menú hamburguesa (MANTENIDO) */}
          <button
            className="btn p-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LOGO 3D - REEMPLAZA LA IMAGEN DEL LOGO */}
          <div 
            className="navbar-brand p-0 d-flex align-items-center cursor-pointer"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <Logo3D />
          </div>

          {/* Iconos derecha (MANTENIDOS) */}
          <div className="iconos-derecha d-flex align-items-center">
            <button 
              onClick={handleUserClick}
              className="btn p-1 me-2 text-dark"
            >
              <span className="material-icons">person</span>
            </button>

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

      {/* Offcanvas Menu (MANTENIDO COMPLETO) */}
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
            >
              <span className="fw-medium">Infantil</span>
              <span className="text-muted">→</span>
            </button>
          </div>

          <div className="border-top p-3 bg-light">
            <button
              className="btn w-100 text-start p-3 text-dark d-flex justify-content-between align-items-center"
              onClick={handleAccountClick} 
              style={{ 
                transition: 'all 0.2s ease',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
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
