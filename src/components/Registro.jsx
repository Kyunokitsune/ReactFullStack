import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, guardarCredenciales } from '../services/api.js';
import '../Estyles/Tienda.css';

export default function Registro() {
  const [modo, setModo] = useState('registro');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nombreNormalizado = nombre.trim();
    const correoNormalizado = correo.trim().toLowerCase();
    const regexDominios = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|duoc\.cl)$/i;

    if (modo === 'registro' && !nombreNormalizado) {
      setError('Ingresa tu nombre.');
      return;
    }

    if (modo === 'registro' && !regexDominios.test(correoNormalizado)) {
      setError('Usa un correo válido de Gmail o DuocUC (@gmail.com, @duocuc.cl o @duoc.cl).');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      if (modo === 'registro') {
        await apiRequest('/usuarios/registro', {
          method: 'POST',
          body: JSON.stringify({ nombre: nombreNormalizado, correo: correoNormalizado, password }),
        });
      }

      const usuario = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ correo: correoNormalizado, password }),
      });

      guardarCredenciales(correoNormalizado, password);
      localStorage.setItem('usuarioActivo', JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol.toLowerCase(),
      }));
      navigate(usuario.rol === 'ADMIN' ? '/Admin' : '/Tienda');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setEnviando(false);
    }
  };

  const cambiarModo = () => {
    setModo((actual) => (actual === 'registro' ? 'login' : 'registro'));
    setError('');
  };

  return (
    <div className="contenedor-registro">
      <h2>{modo === 'registro' ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
      <p>{modo === 'registro' ? 'Ingresa tus datos para crear una cuenta.' : 'Ingresa con tu correo y contraseña.'}</p>

      <form id="formRegistro" className="form-grupo" onSubmit={handleSubmit} noValidate>
        {modo === 'registro' && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            autoComplete="name"
            required
          />
        )}
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={modo === 'registro' ? 'new-password' : 'current-password'}
          required
        />
        {error && <p className="registro-error" role="alert">{error}</p>}
        <button type="submit" className="btn-principal" disabled={enviando}>
          {enviando ? 'Procesando...' : modo === 'registro' ? 'Registrarse e ingresar' : 'Ingresar'}
        </button>
      </form>
      <button type="button" className="btn-principal" onClick={cambiarModo}>
        {modo === 'registro' ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
      </button>
    </div>
  );
}
