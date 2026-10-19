import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'

const usuarios = JSON.parse(
  localStorage.getItem('usuarios') || '[]'
);

const existeAdmin = usuarios.some(
  usuario => usuario.correo === 'admin@milsabores.cl'
);

if (!existeAdmin) {
  usuarios.push({
    nombre: 'Administrador',
    apellido: 'Sistema',
    correo: 'admin@milsabores.cl',
    contrasena: 'Admin123',
    tipo: 'admin'
  });

  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
