import { useState } from 'react';

export default function Contacto() {
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formulario = event.currentTarget;
    const datos = new FormData(formulario);
    const nombre = String(datos.get('nombre') || '').trim();
    const correo = String(datos.get('correo') || '').trim().toLowerCase();
    const mensaje = String(datos.get('mensaje') || '').trim();
    const regexDominios = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|duoc\.cl)$/i;

    if (!nombre || !correo || !mensaje) {
      setError('Completa todos los campos.');
      return;
    }

    if (!regexDominios.test(correo)) {
      setError('Usa un correo válido de Gmail o DuocUC (@gmail.com, @duocuc.cl o @duoc.cl).');
      return;
    }

    setError('');
    formulario.reset();
    alert('Formulario enviado');
  };

  return (
    <section id="contacto">
      <h2>Contáctanos</h2>
      <form className="form-grupo" onSubmit={handleSubmit} noValidate>
        <input type="text" name="nombre" placeholder="Nombre" required />
        <input type="email" name="correo" placeholder="Correo Electrónico" required />
        <textarea name="mensaje" rows="4" placeholder="Mensaje" required></textarea>
        {error && <p className="registro-error" role="alert">{error}</p>}
        <button type="submit" className="btn-principal">Enviar Mensaje</button>
      </form>
    </section>
  );
}
