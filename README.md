# ReactFullStack

Tienda de productos gamer creada con React, Vite y Bootstrap. Incluye catálogo,
carrito, descarga del catálogo en Excel, registro y administración de productos.

## Requisitos

- Node.js y npm

## Instalación y ejecución

En la carpeta del proyecto, ejecuta:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que muestra Vite (normalmente
`http://localhost:5173`).

En Windows PowerShell también puedes usar `npm.cmd` si la política de ejecución
bloquea `npm.ps1`.

## Comandos útiles

- `npm run build`: genera la versión de producción en `dist`.
- `npm run preview`: sirve localmente la versión generada.
- `npm run lint`: revisa el código con Oxlint.

La guía `explicacion-codigo.txt` describe la estructura y el funcionamiento de
los componentes principales.

## Imágenes de productos

Guarda las imágenes en `public/productos/` con estos nombres:

- `mouse-gamer.webp`
- `teclado-gamer.webp`
- `headset-gamer.webp`
- `monitor-gamer.webp`
- `silla-gamer.webp`
- `microfono-gamer.webp`
- `control-gamer.webp`
- `mousepad-gamer.webp`

Las rutas y los datos de cada producto se editan en `src/data/products.js`.
