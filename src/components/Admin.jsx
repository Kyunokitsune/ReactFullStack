import { useState, useEffect } from 'react';
import { products } from '../data/products.js';
import '../Estyles/Admin.css';

const productosCatalogo = products.map(({ id, name, price, category }) => ({
  id,
  nombre: name,
  precio: price,
  categoria: category,
}));

const usuariosIniciales = [
  { id: 1, nombre: "admin1", correo: "adminduoc@duoc.cl", rol: "Administrador" },
  { id: 2, nombre: "juan_perez", correo: "juan.perez@gmail.com", rol: "Cliente" }
];

export default function Admin() {
  const [pestanaActiva, setPestanaActiva] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estados para formularios
  const [formProd, setFormProd] = useState({ id: '', nombre: '', precio: '', categoria: '' });
  const [formUser, setFormUser] = useState({ id: '', nombre: '', correo: '', rol: 'Cliente' });

  // Inicializar datos equivalentes a la función inicializarDatos() de amin.js
  useEffect(() => {
    const prodsLocales = JSON.parse(localStorage.getItem('productos'));
    const usersLocales = JSON.parse(localStorage.getItem('usuarios'));
    const catalogoGamerIntegrado = localStorage.getItem('catalogoGamerIntegrado') === 'true';

    if (!prodsLocales) {
      localStorage.setItem('productos', JSON.stringify(productosCatalogo));
      localStorage.setItem('catalogoGamerIntegrado', 'true');
      setProductos(productosCatalogo);
    } else {
      let productosActualizados = prodsLocales;

      if (!catalogoGamerIntegrado) {
        const productosActualizadosPorId = new Map(
          productosCatalogo.map((producto) => [producto.id, producto])
        );
        const productosPersonalizados = prodsLocales.filter(
          (producto) => !productosActualizadosPorId.has(producto.id) && producto.id !== 101 && producto.id !== 102
        );
        productosActualizados = [...productosPersonalizados, ...productosCatalogo];
        localStorage.setItem('productos', JSON.stringify(productosActualizados));
        localStorage.setItem('catalogoGamerIntegrado', 'true');
      }

      setProductos(productosActualizados);
    }

    if (!usersLocales) {
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
      setUsuarios(usuariosIniciales);
    } else {
      setUsuarios(usersLocales);
    }
  }, []);

  // --- LÓGICA DE PRODUCTOS ---
  const guardarProducto = (e) => {
    e.preventDefault();
    let nuevosProductos = [...productos];

    if (formProd.id) {
      nuevosProductos = nuevosProductos.map(p => p.id === formProd.id ? { ...formProd, id: Number(formProd.id), precio: Number(formProd.precio) } : p);
    } else {
      nuevosProductos.push({ ...formProd, id: Date.now(), precio: Number(formProd.precio) });
    }

    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setFormProd({ id: '', nombre: '', precio: '', categoria: '' });
  };

  const cargarEdicionProducto = (prod) => setFormProd(prod);
  
  const eliminarProducto = (id) => {
    const filtrados = productos.filter(p => p.id !== id);
    setProductos(filtrados);
    localStorage.setItem('productos', JSON.stringify(filtrados));
  };

  // --- LÓGICA DE USUARIOS ---
  const guardarUsuario = (e) => {
    e.preventDefault();

    // Validación de dominios extraída de tu amin.js
    const regexDominios = /^[a-zA-Z0-9._%+-]+@(gmail\.com|duocuc\.cl|duoc\.cl)$/;
    if (!regexDominios.test(formUser.correo)) {
      alert("Por favor, ingresa un correo institucional de DuocUC o Gmail.");
      return;    
    }

    let nuevosUsuarios = [...usuarios];
    if (formUser.id) {
      nuevosUsuarios = nuevosUsuarios.map(u => u.id === formUser.id ? { ...formUser, id: Number(formUser.id) } : u);
    } else {
      nuevosUsuarios.push({ ...formUser, id: Date.now() });
    }

    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    setFormUser({ id: '', nombre: '', correo: '', rol: 'Cliente' });
  };

  const cargarEdicionUsuario = (user) => setFormUser(user);

  const eliminarUsuario = (id) => {
    const filtrados = usuarios.filter(u => u.id !== id);
    setUsuarios(filtrados);
    localStorage.setItem('usuarios', JSON.stringify(filtrados));
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      {/* Navegación entre pestañas */}
      <div className="nav-tabs">
        <button className={`tab-btn ${pestanaActiva === 'productos' ? 'active' : ''}`} onClick={() => setPestanaActiva('productos')}>
          Productos
        </button>
        <button className={`tab-btn ${pestanaActiva === 'usuarios' ? 'active' : ''}`} onClick={() => setPestanaActiva('usuarios')}>
          Usuarios
        </button>
      </div>

      {/* Sección Productos */}
      {pestanaActiva === 'productos' && (
        <div className="section active">
          <h2>Gestión de Productos</h2>
          <form onSubmit={guardarProducto}>
            <input type="text" placeholder="Nombre Producto" value={formProd.nombre} onChange={e => setFormProd({...formProd, nombre: e.target.value})} required />
            <input type="number" placeholder="Precio" value={formProd.precio} onChange={e => setFormProd({...formProd, precio: e.target.value})} required />
            <input type="text" placeholder="Categoría" value={formProd.categoria} onChange={e => setFormProd({...formProd, categoria: e.target.value})} required />
            <button type="submit">{formProd.id ? 'Actualizar Producto' : 'Guardar Producto'}</button>
            <button type="button" onClick={() => setFormProd({ id: '', nombre: '', precio: '', categoria: '' })} style={{ background: '#6c757d' }}>Cancelar</button>
          </form>

          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.nombre}</td><td>${p.precio}</td><td>{p.categoria}</td>
                  <td>
                    <button className="btn-warning" onClick={() => cargarEdicionProducto(p)} style={{ marginRight: '5px' }}>Editar</button>
                    <button className="btn-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sección Usuarios */}
      {pestanaActiva === 'usuarios' && (
        <div className="section active">
          <h2>Gestión de Usuarios</h2>
          <form onSubmit={guardarUsuario}>
            <input type="text" placeholder="Nombre de usuario" value={formUser.nombre} onChange={e => setFormUser({...formUser, nombre: e.target.value})} required />
            <input type="email" placeholder="Correo electrónico" value={formUser.correo} onChange={e => setFormUser({...formUser, correo: e.target.value})} required />
            <select value={formUser.rol} onChange={e => setFormUser({...formUser, rol: e.target.value})} required>
              <option value="Cliente">Cliente</option>
              <option value="Administrador">Administrador</option>
            </select>
            <button type="submit">{formUser.id ? 'Actualizar Usuario' : 'Guardar Usuario'}</button>
            <button type="button" onClick={() => setFormUser({ id: '', nombre: '', correo: '', rol: 'Cliente' })} style={{ background: '#6c757d' }}>Cancelar</button>
          </form>

          <table>
            <thead>
              <tr><th>ID</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td>
                  <td>
                    <button className="btn-warning" onClick={() => cargarEdicionUsuario(u)} style={{ marginRight: '5px' }}>Editar</button>
                    <button className="btn-danger" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}