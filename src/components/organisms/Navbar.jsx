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

  // Componente Logo3D con tu imagen
  const Logo3D = () => (
    <div 
      className="logo-3d-container"
      onClick={handleLogoClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer',
        padding: '5px',
        perspective: '1000px'
      }}
    >
      {/* Cubo 3D con tu imagen */}
      <div 
        className="logo-cube-3d"
        style={{
          width: '60px',
          height: '60px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'rotateCube 15s infinite linear',
          transition: 'transform 0.3s'
        }}
      >
        {/* Cara frontal - Tu logo */}
        <div 
          className="cube-face front"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'url("/img/logo.webp")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: 'white',
            border: '2px solid #667eea',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transform: 'translateZ(30px)'
          }}
        />
        
        {/* Cara trasera */}
        <div 
          className="cube-face back"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#764ba2',
            border: '2px solid #764ba2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
            transform: 'rotateY(180deg) translateZ(30px)'
          }}
        >
          EFA
        </div>
        
        {/* Cara derecha */}
        <div 
          className="cube-face right"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f093fb',
            border: '2px solid #f093fb',
            borderRadius: '8px',
            transform: 'rotateY(90deg) translateZ(30px)'
          }}
        />
        
        {/* Cara izquierda */}
        <div 
          className="cube-face left"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#4facfe',
            border: '2px solid #4facfe',
            borderRadius: '8px',
            transform: 'rotateY(-90deg) translateZ(30px)'
          }}
        />
        
        {/* Cara superior */}
        <div 
          className="cube-face top"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#43e97b',
            border: '2px solid #43e97b',
            borderRadius: '8px',
            transform: 'rotateX(90deg) translateZ(30px)'
          }}
        />
        
        {/* Cara inferior */}
        <div 
          className="cube-face bottom"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fa709a',
            border: '2px solid #fa709a',
            borderRadius: '8px',
            transform: 'rotateX(-90deg) translateZ(30px)'
          }}
        />
      </div>
      
      {/* Texto del logo */}
      <div className="logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
        <span 
          className="main-text"
          style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: '1.1'
          }}
        >
          EFA STORE
        </span>
        <span 
          className="sub-text"
          style={{
            fontSize: '0.7rem',
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
          @keyframes rotateCube {
            0% {
              transform: rotateX(-10deg) rotateY(0deg);
            }
            25% {
              transform: rotateX(10deg) rotateY(90deg);
            }
            50% {
              transform: rotateX(20deg) rotateY(180deg);
            }
            75% {
              transform: rotateX(10deg) rotateY(270deg);
            }
            100% {
              transform: rotateX(-10deg) rotateY(360deg);
            }
          }
          
          .logo-3d-container:hover .logo-cube-3d {
            animation-play-state: paused;
            transform: rotateX(20deg) rotateY(20deg) scale(1.1);
          }
          
          @media (max-width: 768px) {
            .logo-cube-3d {
              width: 50px;
              height: 50px;
            }
            .cube-face {
              transform: translateZ(25px) !important;
            }
            .main-text {
              font-size: 1.1rem !important;
            }
            .sub-text {
              font-size: 0.6rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .logo-3d-container {
              gap: 10px !important;
            }
            .logo-cube-3d {
              width: 45px;
              height: 45px;
            }
            .cube-face {
              transform: translateZ(22px) !important;
            }
            .main-text {
              font-size: 1rem !important;
            }
            .sub-text {
              font-size: 0.55rem !important;
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
