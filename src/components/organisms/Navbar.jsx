import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ carrito }) => {
  const [subMenu, setSubMenu] = useState({
    hombre: false,
    mujer: false,
    infantil: false,
    cuenta: false,
  });

  const toggleSubMenu = (menu) => {
    setSubMenu({ ...subMenu, [menu]: !subMenu[menu] });
  };

  return (
    <>
      {/* NAVBAR PRINCIPAL - EXACTAMENTE COMO EL HTML ORIGINAL */}
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
<<<<<<< HEAD
            <Link to="/" className="navbar-brand">
              <img 
                src="/img/logo.webp" 
                alt="EFA" 
                style={{ 
                  height: '40px', 
                  width: 'auto',
                  maxWidth: '120px'
                }}
              />
            </Link>
=======

          <Link to="/" className="navbar-brand mx-auto">
            <img 
              src="/img/logo.webp" 
              alt="Logo EFA" 
              className="logo-efa" 
            />
          </Link>

>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
          <div className="iconos-derecha d-flex align-items-center">
            <Link to="/registro" className="btn me-3">
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
            Hombre
          </div>
          {subMenu.hombre && (
            <div className="submenu">
              <Link to="/hombre?categoria=poleras" className="d-block">Poleras</Link>
              <Link to="/hombre?categoria=pantalones" className="d-block">Pantalones</Link>
              <Link to="/hombre?categoria=chaquetas" className="d-block">Chaquetas</Link>
              <Link to="/hombre?categoria=todo" className="d-block">Ver todo</Link>
            </div>
          )}

          {/* MUJER */}
          <div className="menu-category mt-3" onClick={() => toggleSubMenu("mujer")}>
            Mujer
          </div>
          {subMenu.mujer && (
            <div className="submenu">
              <Link to="/mujer?categoria=poleras" className="d-block">Poleras</Link>
              <Link to="/mujer?categoria=pantalones" className="d-block">Pantalones</Link>
              <Link to="/mujer?categoria=chaquetas" className="d-block">Chaquetas</Link>
              <Link to="/mujer?categoria=todo" className="d-block">Ver todo</Link>
            </div>
          )}

          {/* INFANTIL */}
          <div className="menu-category mt-3" onClick={() => toggleSubMenu("infantil")}>
            Infantil
          </div>
          {subMenu.infantil && (
            <div className="submenu">
              <Link to="/infantil?categoria=poleras" className="d-block">Poleras</Link>
              <Link to="/infantil?categoria=pantalones" className="d-block">Pantalones</Link>
              <Link to="/infantil?categoria=chaquetas" className="d-block">Chaquetas</Link>
              <Link to="/infantil?categoria=todo" className="d-block">Ver todo</Link>
            </div>
          )}

          {/* CUENTA */}
          <div className="menu-category mt-3" onClick={() => toggleSubMenu("cuenta")}>
            Ver mi cuenta
          </div>
          {subMenu.cuenta && (
            <div className="submenu">
              <Link to="/micuenta" className="d-block">Mi cuenta</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;