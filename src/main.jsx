import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext' // Importar el Provider
import './index.css'

// Importa el modulo de observabilidad: instala los interceptores de axios
// que propagan el identificador de correlacion hacia el backend. Debe
// ejecutarse antes que cualquier peticion de la aplicacion.
import './services/observability.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider> {/* ENVOLVER LA APP CON EL PROVIDER */}
        <App />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
