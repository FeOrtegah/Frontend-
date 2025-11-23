<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext' // ← Importar el Provider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider> {/* ← ENVOLVER LA APP CON EL PROVIDER */}
        <App />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
=======
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
>>>>>>> 117f769bce0402b3d4c3cc178c29a8febc55edc9
