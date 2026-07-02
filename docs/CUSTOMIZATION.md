# Customization

Guia para adaptar el template a otra tienda sin tocar componentes principales.

## Nombre de tienda

Modificar:

- `src/config/storeConfig.js`
- `.env`

Valores habituales:

- `store.name`
- `store.slogan`
- `store.shortDescription`
- `STORE_NAME`
- `STORE_CONTACT_EMAIL`

## Logo

Modificar:

- `src/config/images.js`

Buscar las claves relacionadas con logo, por ejemplo:

- `logo`
- `logoMark`
- `footerLogo`
- `ogImage`

Usar URLs absolutas de Cloudinary para que el proyecto no dependa de imagenes locales.

## Imagenes

Modificar:

- `src/config/images.js`

Ahi deben vivir las imagenes estaticas de la tienda:

- Hero desktop.
- Hero mobile.
- Logos.
- Banners.
- Imagenes de categorias.
- Imagen para compartir en redes.

Los productos no se deben cargar desde `images.js` si vienen de MongoDB. Los productos usan la URL guardada en la base de datos.

## Colores

Modificar:

- `src/config/themeConfig.js`

Centralizar ahi:

- Color principal.
- Color secundario.
- Color de acento.
- Fondos.
- Colores de texto.

## Categorias

Modificar:

- `src/config/storeConfig.js`
- `src/config/navigation.js`

Usar `storeConfig.js` para categorias de catalogo y `navigation.js` para links visibles de navegacion.

## Hero

Modificar:

- `src/config/storeConfig.js`
- `src/config/images.js`

Cambiar:

- Texto superior.
- Titulo.
- Subtitulo.
- Texto de boton.
- Imagen desktop.
- Imagen mobile.

## Navegacion

Modificar:

- `src/config/navigation.js`

Ahi se definen links principales, links del menu mobile y textos de navegacion.

## WhatsApp

Modificar:

- `src/config/storeConfig.js`
- `.env`

Variables sugeridas:

- `STORE_WHATSAPP_NUMBER`
- `STORE_WHATSAPP_MESSAGE`

## Redes sociales

Modificar:

- `src/config/storeConfig.js`

Valores habituales:

- Instagram.
- Facebook.
- TikTok si se agrega mas adelante.

## Datos SEO

Modificar:

- `index.html`
- `src/config/storeConfig.js`
- `src/config/images.js`
- `public/sitemap.xml`
- `public/robots.txt`

Revisar titulo, descripcion, Open Graph y URLs publicas antes de publicar una tienda nueva. En `public/sitemap.xml` y `public/robots.txt`, reemplazar `https://your-domain.com` por el dominio real.

