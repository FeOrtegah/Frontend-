import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext' // ← Importar el Provider
import './index.css'
import './global.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider> {/* ← ENVOLVER LA APP CON EL PROVIDER */}
        <App />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
