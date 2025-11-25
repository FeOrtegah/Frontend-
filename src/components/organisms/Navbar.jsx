import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();
  
  const [subMenu, setSubMenu] = useState({
    hombre: false,
    mujer: false,
    infantil: false,
    cuenta: false,
  });

  const toggleSubMenu = (menu) => {
    setSubMenu((prevSubMenu) => ({ 
        ...prevSubMenu, 
        [menu]: !prevSubMenu[menu] 
    }));
  };
  
  const closeOffcanvas = () => {
    // Código para cerrar el offcanvas de Bootstrap
    const offcanvas = document.getElementById('offcanvasMenu');
    if (offcanvas) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas) || new window.bootstrap.Offcanvas(offcanvas);
        bsOffcanvas.hide();
    }
  };

  const handleSubMenuClick = (path) => {
    closeOffcanvas();
    navigate(path);
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
          {/* HOMBRE */}
          <div className="menu-category" onClick={() => toggleSubMenu("hombre")}>
            <button 
                className="btn w-100 mb-2" 
                style={{ backgroundColor: "red", color: "white", fontWeight: "bold" }}
            >
                Hombre
            </button>
          </div>
          {subMenu.hombre && (
            <div className="submenu ms-3 mb-2">
              <Link to="/hombre?categoria=poleras" className="d-block" onClick={() => handleSubMenuClick("/hombre?categoria=poleras")}>Poleras</Link>
              <Link to="/hombre?categoria=pantalones" className="d-block" onClick={() => handleSubMenuClick("/hombre?categoria=pantalones")}>Pantalones</Link>
              <Link to="/hombre?categoria=chaquetas" className="d-block" onClick={() => handleSubMenuClick("/hombre?categoria=chaquetas")}>Chaquetas</Link>
              <Link to="/hombre?categoria=todo" className="d-block" onClick={() => handleSubMenuClick("/hombre?categoria=todo")}>Ver todo</Link>
            </div>
          )}

          {/* MUJER */}
          <div className="menu-category" onClick={() => toggleSubMenu("mujer")}>
            <button 
                className="btn w-100 mb-2" 
                style={{ backgroundColor: "red", color: "white", fontWeight: "bold" }}
            >
                Mujer
            </button>
          </div>
          {subMenu.mujer && (
            <div className="submenu ms-3 mb-2">
              <Link to="/mujer?categoria=poleras" className="d-block" onClick={() => handleSubMenuClick("/mujer?categoria=poleras")}>Poleras</Link>
              <Link to="/mujer?categoria=pantalones" className="d-block" onClick={() => handleSubMenuClick("/mujer?categoria=pantalones")}>Pantalones</Link>
              <Link to="/mujer?categoria=chaquetas" className="d-block" onClick={() => handleSubMenuClick("/mujer?categoria=chaquetas")}>Chaquetas</Link>
              <Link to="/mujer?categoria=todo" className="d-block" onClick={() => handleSubMenuClick("/mujer?categoria=todo")}>Ver todo</Link>
            </div>
          )}

          {/* INFANTIL */}
          <div className="menu-category" onClick={() => toggleSubMenu("infantil")}>
            <button 
                className="btn w-100 mb-2" 
                style={{ backgroundColor: "red", color: "white", fontWeight: "bold" }}
            >
                Infantil
            </button>
          </div>
          {subMenu.infantil && (
            <div className="submenu ms-3 mb-2">
              <Link to="/infantil?categoria=poleras" className="d-block" onClick={() => handleSubMenuClick("/infantil?categoria=poleras")}>Poleras</Link>
              <Link to="/infantil?categoria=pantalones" className="d-block" onClick={() => handleSubMenuClick("/infantil?categoria=pantalones")}>Pantalones</Link>
              <Link to="/infantil?categoria=chaquetas" className="d-block" onClick={() => handleSubMenuClick("/infantil?categoria=chaquetas")}>Chaquetas</Link>
              <Link to="/infantil?categoria=todo" className="d-block" onClick={() => handleSubMenuClick("/infantil?categoria=todo")}>Ver todo</Link>
            </div>
          )}

          {/* CUENTA */}
          <div className="menu-category mt-3" onClick={() => toggleSubMenu("cuenta")}>
            <button 
                className="btn w-100 mb-2 btn-outline-dark" 
            >
                Ver mi cuenta
            </button>
          </div>
          {subMenu.cuenta && (
            <div className="submenu ms-3 mb-2">
              <Link to="/micuenta" className="d-block" onClick={() => handleSubMenuClick("/micuenta")}>Mi cuenta</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
