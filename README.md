# AyRe e-shop

Tienda online para AyRe, desarrollada con React y Express. El proyecto combina un frontend responsive con catalogo, carrito, checkout y panel de administracion, mas una API conectada a MongoDB Atlas para productos, usuarios y pedidos.

## Caracteristicas

- Catalogo de indumentaria y accesorios con busqueda, categorias y detalle de producto.
- Carrito lateral con seleccion de talle/color, cantidades, pasos de compra y persistencia local.
- Flujo de checkout con validaciones, registro de pedidos y actualizacion de stock.
- Registro e inicio de sesion de usuarios, favoritos, preferencias y compras guardadas.
- Panel admin para ABM de productos.
- Subida de imagenes de productos a Cloudinary desde el panel admin.
- Emails transaccionales preparados con Resend.
- Frontend responsive para mobile y desktop.
- Configuracion centralizada de marca, navegacion, imagenes y textos para usar AyRe como base reutilizable.

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
- WhatsApp de administracion

## Version

Version actual: `1.6.0`.

Esta version consolida la estructura del frontend en contextos y hooks reutilizables para productos, admin, imagenes, checkout y usuarios, manteniendo la funcionalidad existente.
