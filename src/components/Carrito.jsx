export default function Carrito({
  abierto,
  carrito,
  onCerrar,
  onAgregar,
  onQuitar,
  onEliminar,
}) {
  if (!abierto) {
    return null;
  }

  const totalCarrito = carrito.reduce((total, item) => total + item.price * item.cantidad, 0);

  return (
    <div
      className="carrito-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCerrar();
      }}
    >
      <section className="carrito-panel" role="dialog" aria-modal="true" aria-labelledby="titulo-carrito">
        <div className="carrito-encabezado">
          <h2 id="titulo-carrito">Tu carrito</h2>
          <button type="button" className="carrito-cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="lista-carrito">
              {carrito.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      {' '}× {item.cantidad}
                    </span>
                  </div>
                  <div className="carrito-acciones">
                    <button
                      type="button"
                      aria-label={`Quitar una unidad de ${item.name}`}
                      onClick={() => onQuitar(item.id)}
                    >
                      −
                    </button>
                    <button type="button" onClick={() => onAgregar(item)}>
                      +
                    </button>
                    <button
                      type="button"
                      className="carrito-eliminar"
                      onClick={() => onEliminar(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="carrito-total">
              Total: {totalCarrito.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
