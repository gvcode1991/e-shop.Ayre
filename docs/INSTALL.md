# Installation

Guia para instalar el template de e-commerce en un entorno local.

## Requisitos

- Node.js 20 LTS o superior.
- npm 10 o superior.
- Git.
- Cuenta en MongoDB Atlas.
- Cuenta en Cloudinary.
- Cuenta en Resend.

## Instalar dependencias

Desde la raiz del proyecto:

```bash
npm install
```

## Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

En Windows tambien podes duplicar `.env.example` y renombrarlo como `.env`.

Completar las variables necesarias para la tienda:

- `MONGODB_URI`: conexion de MongoDB Atlas.
- `CLOUDINARY_CLOUD_NAME`: nombre del cloud de Cloudinary.
- `CLOUDINARY_API_KEY`: API key de Cloudinary.
- `CLOUDINARY_API_SECRET`: API secret de Cloudinary.
- `RESEND_API_KEY`: API key de Resend.
- `RESEND_FROM_EMAIL`: remitente usado para emails transaccionales.
- `JWT_SECRET`: clave privada para tokens de usuario.
- `ADMIN_JWT_SECRET`: clave privada para tokens admin.
- `ADMIN_EMAIL`: email inicial del administrador.
- `ADMIN_PASSWORD`: password inicial del administrador.
- `PUBLIC_APP_URL`: URL publica de la tienda.
- `CLIENT_ORIGIN`: origen permitido del frontend.
- `VITE_API_URL`: URL de la API usada por el frontend.

## MongoDB Atlas

1. Crear un cluster en MongoDB Atlas.
2. Crear un usuario de base de datos.
3. Habilitar IP Access List para el entorno local o proveedor de deploy.
4. Copiar la connection string y colocarla en `MONGODB_URI`.

## Cloudinary

1. Crear una cuenta en Cloudinary.
2. Copiar `cloud name`, `api key` y `api secret`.
3. Cargar esos valores en `.env`.
4. Las imagenes subidas desde admin se guardan como URLs de Cloudinary en MongoDB.

## Resend

1. Crear una cuenta en Resend.
2. Crear una API key.
3. Configurar `RESEND_API_KEY`.
4. Configurar `RESEND_FROM_EMAIL` con un remitente valido.

## Ejecutar en desarrollo

Frontend:

```bash
npm run dev
```

API local:

```bash
npm run dev:api
```

## Build de produccion

```bash
npm run build
```

## Servidor de produccion

```bash
npm start
```
