# E-commerce template

Base profesional reutilizable para crear tiendas online con React y Express. El proyecto queda preparado como punto de partida configurable: marca, textos, navegacion, imagenes, colores, variables sensibles y productos seed se pueden adaptar sin tocar los componentes principales.

## Caracteristicas

- Catalogo de productos con busqueda, categorias y detalle de producto.
- Carrito lateral con seleccion de talle/color, cantidades, pasos de compra y persistencia local.
- Flujo de checkout con validaciones, registro de pedidos y actualizacion de stock.
- Registro e inicio de sesion de usuarios, favoritos, preferencias y compras guardadas.
- Panel admin para ABM de productos.
- Subida de imagenes de productos a Cloudinary desde el panel admin.
- Emails transaccionales preparados con Resend.
- Frontend responsive para mobile y desktop.
- Configuracion centralizada de marca, navegacion, imagenes y textos para reutilizar la base en nuevas tiendas.

## Stack

- React + Vite
- Express + Node.js
- MongoDB Atlas + Mongoose
- Cloudinary
- Resend
- Render

## Comandos

Instalar dependencias:

```bash
npm install
```

Levantar el frontend:

```bash
npm run dev
```

Levantar la API local:

```bash
npm run dev:api
```

Generar build de produccion:

```bash
npm run build
```

Ejecutar servidor de produccion:

```bash
npm start
```

## Configuracion

Usar `.env.example` como referencia para completar las variables necesarias:

- MongoDB Atlas
- Cloudinary
- Resend
- JWT y claves privadas
- URLs publicas de frontend/API
- WhatsApp o telefono de administracion

Los principales archivos para adaptar la tienda son:

- `src/config/storeConfig.js`
- `src/config/themeConfig.js`
- `src/config/navigation.js`
- `src/config/images.js`
- `.env`

## Documentation

- `docs/INSTALL.md`
- `docs/DEPLOY.md`
- `docs/CUSTOMIZATION.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/CHECKLIST.md`

## Version

Version actual: `1.0.0`.

Esta version deja el proyecto preparado como release candidate del template reutilizable de e-commerce.
