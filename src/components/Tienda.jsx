import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products.js';
import Carrito from './Carrito.jsx';
import Contacto from './Contacto.jsx';
import '../Estyles/Tienda.css';

export default function Tienda() {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem('carrito') || '[]'));
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const navigate = useNavigate();

  // Leer sesión activa desde localStorage al cargar la página
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoEnCarrito = carritoActual.find((item) => item.id === producto.id);

      if (productoEnCarrito) {
        return carritoActual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelCarrito = (productoId) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== productoId));
  };

  const cantidadEnCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

  const descargarCatalogo = async () => {
    const XLSX = await import('@e965/xlsx');
    const filas = products.map(({ name, category, price }) => ({
      Nombre: name,
      Categoría: category,
      Precio: price,
    }));
    const hoja = XLSX.utils.json_to_sheet(filas);
    hoja['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 14 }];
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, 'Catálogo');
    XLSX.writeFile(libro, 'catalogo-productos.xlsx');
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    setUsuario(null);
  };

  return (
    <div>
      <header>
        <div className="logo">
          <h1>MiTienda</h1>
        </div>
        <nav>
          <ul>
            <li id="usuarioEstado">
              {usuario ? (
                <>
                  <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                    Hola, {usuario.nombre}
                  </span>
                  <button className="btn-nav" onClick={handleCerrarSesion} style={{ background: '#e74c3c' }}>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button className="btn-nav" onClick={() => navigate('/registro')}>
                  Registrarse / Iniciar Sesión
                </button>
              )}
              <button
                className="btn-nav"
                type="button"
                onClick={() => setCarritoAbierto(true)}
                aria-label={`Ver carrito, ${cantidadEnCarrito} productos`}
              >
                Carrito ({cantidadEnCarrito})
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="inicio">
          <h2>{usuario ? `¡Bienvenido de nuevo, ${usuario.nombre}!` : 'Novedades y Estilo a tu Alcance'}</h2>
          <p>Descubre nuestra colección exclusiva con envíos a todo el país.</p>
        </section>

        <section className="descarga-catalogo">
          <h2>Descargar Excel del catálogo</h2>
          <p>Descarga los nombres, categorías y precios de nuestros productos.</p>
          <button type="button" className="btn-principal" onClick={descargarCatalogo}>
            Descargar Excel de catálogo
          </button>
        </section>

        <section id="productos">
          <h2>Productos Destacados</h2>
          <div className="grid-productos">
            {products.map((producto) => (
              <article key={producto.id} className="tarjeta-tienda">
                <img src={producto.img} alt={producto.name} loading="lazy" />
                <h3>{producto.name}</h3>
                <p>{producto.category}</p>
                <p>{producto.desc}</p>
                <span>{producto.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
                <button
                  className="btn-principal"
                  type="button"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Añadir al carrito
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="nosotros">
          <h2>Sobre Nosotros</h2>
          <p>Ofrecemos productos duraderos y de diseño único para nuestros clientes.</p>
        </section>
        
        <details> 
          <summary id="blog" className="letra">Blog</summary>
          <section id="blog-content">
            <h2 className="letra">Últimas Publicaciones</h2>
            <article>
              <h3 className="letra">Cómo elegir el producto ideal</h3>
              <p className="letra">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Nam a lacus imperdiet, convallis sem id, scelerisque lorem. 
Curabitur rhoncus augue ut felis facilisis, id pellentesque ipsum vestibulum.
Nullam porta cursus risus, et tincidunt quam interdum non.
Phasellus venenatis varius maximus. Morbi placerat faucibus turpis, a gravida orci porttitor in. 
Fusce porta nibh sit amet urna consequat posuere. Morbi cursus non diam efficitur porta. Proin justo tellus, pulvinar eget est eget, dignissim tempor nulla.
Maecenas imperdiet condimentum pharetra. Quisque vitae lectus ipsum. Nulla in nibh ut sapien laoreet aliquam.
Nullam efficitur diam nec ante finibus congue.
Maecenas metus erat, faucibus sit amet ligula tincidunt, rutrum elementum libero. 
Fusce a gravida dui. Donec gravida ornare orci, ac consequat ligula pulvinar sed. 
Duis fringilla justo quis justo feugiat ultricies. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. 
Nam rhoncus blandit lacus, ac rutrum erat malesuada sed. Integer aliquet dolor et libero tempus, ac interdum libero volutpat. 
Nullam a fermentum velit, id volutpat velit. Aliquam erat volutpat.
Vestibulum a efficitur eros. S.</p>
            </article>
          </section>
        </details> 

        <Contacto />
      </main>

      <Carrito
        abierto={carritoAbierto}
        carrito={carrito}
        onCerrar={() => setCarritoAbierto(false)}
        onAgregar={agregarAlCarrito}
        onQuitar={quitarDelCarrito}
        onEliminar={eliminarDelCarrito}
      />

      <footer>
        <p>&copy; 2026 Muki. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}