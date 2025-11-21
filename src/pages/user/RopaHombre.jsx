import React from "react";
import { useLocation } from "react-router-dom";
import Products from "./Products"; // Reutilizamos el componente Products

const RopaHombre = ({ carrito, setCarrito }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipo = searchParams.get("categoria");

  return (
    <Products 
      categoria="hombre" 
      tipo={tipo}
      carrito={carrito} 
      setCarrito={setCarrito} 
    />
  );
};

export default RopaHombre;