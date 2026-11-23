import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tienda from './components/Tienda.jsx';
import Registro from './components/Registro.jsx';
import Admin from './components/Admin.jsx';

function RutaProtegidaAdmin({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  const token = sessionStorage.getItem('apiToken');
  if (!token || usuario?.rol !== 'admin') {
    return <Navigate to="/Tienda" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto redirige a la tienda */}
        <Route path="/" element={<Navigate to="/Tienda" />} />
        <Route path="/Tienda" element={<Tienda />} />
        <Route path="/Registro" element={<Registro />} />
        <Route
          path="/Admin"
          element={
            <RutaProtegidaAdmin>
              <Admin />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
