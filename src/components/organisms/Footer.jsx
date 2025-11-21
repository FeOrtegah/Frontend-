import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (  
    <footer className="page-footer bg-dark text-white pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-start">
            <h5>Nosotros</h5>
            <p>Suscríbete para estar al tanto de nuevas actualizaciones</p>
            <ul className="ps-0 list-unstyled">
              <li><a className="text-white" href="https://www.instagram.com">Instagram</a></li>
              <li><a className="text-white" href="https://www.facebook.com">Facebook</a></li>
              <li><a className="text-white" href="https://www.tiktok.com">TikTok</a></li>
              <li><a className="text-white" href="https://www.x.com">X</a></li>
              {/*  Agregamos el enlace interno al blog */}
            </ul>
          </div>
          <div className="col-md-6">
          <ul className="ps-0 list-unstyled">
            <li><Link to="/blog" className="text-white">Ver Blog</Link></li>
            <li><Link to="/ayuda" className="text-white">Centro de Ayuda:</Link></li>
            <li className="text-white">
              Aquí podrás encontrar toda la información sobre servicio al cliente, 
              tiendas físicas, compras online con Click&Collect, políticas de privacidad 
              y contacto directo con nuestro equipo de soporte.
            </li>
            <li><Link to="/noticias" className="text-white">Noticias</Link></li>
          </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright border-top pt-3 pb-2" style={{ background: "#222" }}>
        <div className="container-fluid d-flex flex-column flex-md-row align-items-start justify-content-between">
          <div>
            <span className="efa">©EFA</span>
            <ul className="ps-0 list-unstyled">
              <li>Enfatiza la exclusividad, la calidad del diseño y la originalidad de las marcas seleccionadas</li>
              <li>El contenido de esta página web está protegido por copyright y es propiedad de EFA Antonio, Felipe & Esteban</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
