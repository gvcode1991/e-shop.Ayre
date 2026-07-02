# Deploy

Guia para desplegar el template en Render.

## Deploy en Render

1. Crear un Web Service en Render.
2. Conectar el repositorio de GitHub.
3. Seleccionar la rama de produccion.
4. Configurar el entorno como Node.
5. Usar los comandos del proyecto:

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

## Variables necesarias

Configurar en Render las mismas variables usadas localmente en `.env`.

Variables principales:

- `NODE_ENV=production`
- `PORT`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `JWT_SECRET`
- `ADMIN_JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PUBLIC_APP_URL`
- `CLIENT_ORIGIN`
- `VITE_API_URL`
- `STORE_NAME`
- `STORE_CONTACT_EMAIL`
- `STORE_WHATSAPP_NUMBER`

## MongoDB Atlas

Render usa IPs dinamicas. Para desarrollo se puede habilitar `0.0.0.0/0` en IP Access List de Atlas. Para produccion conviene revisar una estrategia mas restrictiva cuando el proyecto crezca.

## Cloudinary

Cloudinary se usa para alojar imagenes de productos y assets estaticos. El backend recibe la imagen desde el panel admin, la sube a Cloudinary y guarda la URL en MongoDB.

## Resend

Resend se usa para emails transaccionales, como confirmacion de cuenta. Para produccion, verificar dominio propio en Resend y usar un remitente del dominio de la tienda.

## Dominio propio

1. Agregar el dominio en Render desde Custom Domains.
2. Configurar DNS segun indique Render.
3. Actualizar `PUBLIC_APP_URL` y `CLIENT_ORIGIN`.
4. Actualizar `VITE_API_URL` si la API usa un subdominio propio.
5. Reemplazar `https://your-domain.com` en `public/sitemap.xml` y `public/robots.txt` por el dominio real de la tienda.

