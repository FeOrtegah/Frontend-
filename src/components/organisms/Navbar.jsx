import React from "react";
import { Link, useNavigate } from "react-router-dom";

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

  // Componente Logo 3D con tu imagen
  const Logo3D = () => (
    <div 
      className="logo-3d-container"
      onClick={handleLogoClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer'
      }}
    >
      {/* Contenedor del logo 3D */}
      <div 
        className="logo-3d-wrapper"
        style={{
          width: '50px',
          height: '50px',
          position: 'relative',
          perspective: '500px'
        }}
      >
        {/* Logo con efecto 3D giratorio */}
        <div 
          className="logo-3d-rotating"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            animation: 'rotateLogo3D 15s infinite linear',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Capa frontal del logo */}
          <div 
            className="logo-layer front"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/img/logo.webp")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
              transform: 'translateZ(10px)'
            }}
          />
          
          {/* Capa trasera del logo (para profundidad) */}
          <div 
            className="logo-layer back"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/img/logo.webp")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'brightness(0.5) blur(1px)',
              opacity: '0.7',
              transform: 'translateZ(-10px) rotateY(180deg)'
            }}
          />
          
          {/* Efecto de brillo 3D */}
          <div 
            className="logo-glow"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              opacity: '0.5',
              transform: 'translateZ(5px)'
            }}
          />
        </div>
      </div>
      
      {/* Texto del logo */}
      <div className="logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
        <span 
          className="main-text"
          style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: '1.1',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          EFA STORE
        </span>
        <span 
          className="sub-text"
          style={{
            fontSize: '0.65rem',
            color: '#666',
            fontWeight: '500',
            letterSpacing: '0.5px',
            lineHeight: '1'
          }}
        >
          Performance & Style
        </span>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>
        {`
          @keyframes rotateLogo3D {
            0% {
              transform: rotateY(0deg) rotateX(0deg);
            }
            25% {
              transform: rotateY(90deg) rotateX(5deg);
            }
            50% {
              transform: rotateY(180deg) rotateX(0deg);
            }
            75% {
              transform: rotateY(270deg) rotateX(-5deg);
            }
            100% {
              transform: rotateY(360deg) rotateX(0deg);
            }
          }
          
          .logo-3d-container:hover .logo-3d-rotating {
            animation-play-state: paused;
            transform: rotateY(20deg) rotateX(10deg) scale(1.1);
          }
          
          .logo-3d-container:hover .logo-layer.front {
            filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.8));
          }
          
          @media (max-width: 768px) {
            .logo-3d-wrapper {
              width: 40px;
              height: 40px;
            }
            .main-text {
              font-size: 1.1rem !important;
            }
            .sub-text {
              font-size: 0.55rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .logo-3d-container {
              gap: 8px !important;
            }
            .logo-3d-wrapper {
              width: 35px;
              height: 35px;
            }
            .main-text {
              font-size: 1rem !important;
            }
            .sub-text {
              font-size: 0.5rem !important;
            }
          }
        `}
      </style>
    </div>
  );

  return (
    <>
      <nav className="navbar bg-white border-bottom py-2">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          {/* Botón menú hamburguesa */}
          <button
            className="btn p-1"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LOGO 3D con tu imagen */}
          <div className="navbar-brand p-0">
            <Logo3D />
          </div>

          {/* Iconos derecha */}
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

      {/* Offcanvas Menu - TODO MANTENIDO IGUAL */}
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
