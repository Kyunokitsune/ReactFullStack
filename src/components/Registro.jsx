import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Estyles/Tienda.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const nombreNormalizado = nombre.trim();
    const correoNormalizado = correo.trim().toLowerCase();
    const regexDominios = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|duoc\.cl)$/i;

    if (!nombreNormalizado) {
      setError('Ingresa tu nombre.');
      return;
    }

    if (!correoNormalizado.includes('@')) {
      setError('El correo debe incluir el símbolo @.');
      return;
    }

    if (!regexDominios.test(correoNormalizado)) {
      setError('Usa un correo válido de Gmail o DuocUC (@gmail.com, @duocuc.cl o @duoc.cl).');
      return;
    }

    if (!password.trim()) {
      setError('Ingresa tu contraseña.');
      return;
    }

    setError('');

    if (nombreNormalizado === 'Admin123' && correoNormalizado === 'adminduoc@duoc.cl' && password === 'Administrador2026') {
      localStorage.setItem('usuarioActivo', JSON.stringify({ nombre: nombreNormalizado, correo: correoNormalizado, rol: 'admin' }));
      navigate('/admin'); // Reemplaza window.location.href = 'Home.admin.html'
    } else {
      const usuario = { nombre: nombreNormalizado, correo: correoNormalizado };
      localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
      navigate('/Tienda'); // Reemplaza window.location.href = 'Home_tienda.html'
    }
  };

  return (
    <div className="contenedor-registro">
      <h2>Crear Cuenta</h2>
      <p>Ingresa tus datos para acceder a la tienda.</p>

      <form id="formRegistro" className="form-grupo" onSubmit={handleSubmit} noValidate>
        <input 
          type="text" 
          placeholder="Nombre completo" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          autoComplete="name"
        />
        <input 
          type="text" 
          inputMode="email"
          autoComplete="email"
          placeholder="Correo electrónico" 
          value={correo} 
          onChange={(e) => setCorreo(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          autoComplete="new-password"
        />
        {error && <p className="registro-error" role="alert">{error}</p>}
        <button type="submit" className="btn-principal">Registrarse e Ingresar</button>
      </form>
    </div>
  );
}