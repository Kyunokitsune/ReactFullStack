import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';
import '../Estyles/Admin.css';

const productoVacio = { nombre: '', precio: '', categoria: '', imagen: '', descripcion: '' };
const usuarioVacio = { nombre: '', correo: '', rol: 'CLIENTE', password: '' };

export default function Admin() {
  const [pestanaActiva, setPestanaActiva] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formProd, setFormProd] = useState(productoVacio);
  const [formUser, setFormUser] = useState(usuarioVacio);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([apiRequest('/productos'), apiRequest('/usuarios')])
      .then(([listaProductos, listaUsuarios]) => {
        setProductos(listaProductos);
        setUsuarios(listaUsuarios);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setCargando(false));
  }, []);

  const guardarProducto = async (event) => {
    event.preventDefault();
    setError('');
    const editar = Boolean(formProd.id);
    const { id, ...datosProducto } = formProd;
    try {
      const producto = await apiRequest(editar ? `/productos/${id}` : '/productos', {
        method: editar ? 'PUT' : 'POST',
        body: JSON.stringify({ ...datosProducto, precio: Number(datosProducto.precio) }),
      });
      setProductos((actuales) => editar
        ? actuales.map((item) => (item.id === producto.id ? producto : item))
        : [...actuales, producto]);
      setFormProd(productoVacio);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const eliminarProducto = async (id) => {
    setError('');
    try {
      await apiRequest(`/productos/${id}`, { method: 'DELETE' });
      setProductos((actuales) => actuales.filter((producto) => producto.id !== id));
      if (formProd.id === id) setFormProd(productoVacio);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const guardarUsuario = async (event) => {
    event.preventDefault();
    setError('');
    const editar = Boolean(formUser.id);
    const { id, ...datosUsuario } = formUser;
    try {
      const usuario = await apiRequest(editar ? `/usuarios/${id}` : '/usuarios', {
        method: editar ? 'PUT' : 'POST',
        body: JSON.stringify(datosUsuario),
      });
      setUsuarios((actuales) => editar
        ? actuales.map((item) => (item.id === usuario.id ? usuario : item))
        : [...actuales, usuario]);
      setFormUser(usuarioVacio);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const eliminarUsuario = async (id) => {
    setError('');
    try {
      await apiRequest(`/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== id));
      if (formUser.id === id) setFormUser(usuarioVacio);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="nav-tabs">
        <button className={`tab-btn ${pestanaActiva === 'productos' ? 'active' : ''}`} onClick={() => setPestanaActiva('productos')}>
          Productos
        </button>
        <button className={`tab-btn ${pestanaActiva === 'usuarios' ? 'active' : ''}`} onClick={() => setPestanaActiva('usuarios')}>
          Usuarios
        </button>
      </div>

      {error && <p role="alert" className="registro-error">{error}</p>}
      {cargando ? <p>Cargando registros...</p> : (
        <>
          {pestanaActiva === 'productos' && (
            <section className="section active">
              <h2>Gestión de Productos</h2>
              <form onSubmit={guardarProducto}>
                <input placeholder="Nombre del producto" value={formProd.nombre} onChange={(event) => setFormProd({ ...formProd, nombre: event.target.value })} required />
                <input type="number" min="0.01" step="0.01" placeholder="Precio" value={formProd.precio} onChange={(event) => setFormProd({ ...formProd, precio: event.target.value })} required />
                <input placeholder="Categoría" value={formProd.categoria} onChange={(event) => setFormProd({ ...formProd, categoria: event.target.value })} required />
                <input placeholder="Ruta de imagen (opcional)" value={formProd.imagen || ''} onChange={(event) => setFormProd({ ...formProd, imagen: event.target.value })} />
                <input placeholder="Descripción (opcional)" value={formProd.descripcion || ''} onChange={(event) => setFormProd({ ...formProd, descripcion: event.target.value })} />
                <button type="submit">{formProd.id ? 'Actualizar Producto' : 'Guardar Producto'}</button>
                <button type="button" onClick={() => setFormProd(productoVacio)} style={{ background: '#6c757d' }}>Cancelar</button>
              </form>

              <table>
                <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr></thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>{Number(producto.precio).toLocaleString('es-CL')}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        <button className="btn-warning" onClick={() => setFormProd({ ...producto, precio: String(producto.precio) })} style={{ marginRight: '5px' }}>Editar</button>
                        <button className="btn-danger" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {pestanaActiva === 'usuarios' && (
            <section className="section active">
              <h2>Gestión de Usuarios</h2>
              <form onSubmit={guardarUsuario}>
                <input placeholder="Nombre de usuario" value={formUser.nombre} onChange={(event) => setFormUser({ ...formUser, nombre: event.target.value })} required />
                <input type="email" placeholder="Correo electrónico" value={formUser.correo} onChange={(event) => setFormUser({ ...formUser, correo: event.target.value })} required />
                <select value={formUser.rol} onChange={(event) => setFormUser({ ...formUser, rol: event.target.value })} required>
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <input
                  type="password"
                  placeholder={formUser.id ? 'Nueva contraseña (opcional)' : 'Contraseña (mínimo 8 caracteres)'}
                  value={formUser.password}
                  onChange={(event) => setFormUser({ ...formUser, password: event.target.value })}
                  minLength="8"
                  required={!formUser.id}
                />
                <button type="submit">{formUser.id ? 'Actualizar Usuario' : 'Guardar Usuario'}</button>
                <button type="button" onClick={() => setFormUser(usuarioVacio)} style={{ background: '#6c757d' }}>Cancelar</button>
              </form>

              <table>
                <thead><tr><th>ID</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</td>
                      <td>
                        <button className="btn-warning" onClick={() => setFormUser({ ...usuario, password: '' })} style={{ marginRight: '5px' }}>Editar</button>
                        <button className="btn-danger" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </div>
  );
}
