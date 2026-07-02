# Architecture

Descripcion general de la arquitectura actual del template.

## Frontend

El frontend esta construido con React y Vite.

### `src/components/`

Contiene componentes visuales reutilizables. Esta separado por dominio:

- `layout/`: header, hero, footer y estructura visual.
- `products/`: tarjetas, grillas y vistas de producto.
- `cart/`: carrito lateral y controles del carrito.
- `checkout/`: formulario y pasos de compra.
- `admin/`: panel de administracion y formularios de productos.
- `account/`: cuenta de usuario.
- `orders/`: listas y vistas de pedidos.

### `src/hooks/`

Contiene logica reutilizable separada de los componentes:

- Productos.
- CRUD admin de productos.
- Subida de imagenes.
- Checkout.
- Usuarios.
- Sesion admin.

### `src/contexts/`

Contiene estado global compartido:

- Carrito.
- Usuario.
- Admin.
- Configuracion de tienda.

### `src/services/`

Centraliza llamadas a la API. Los componentes no deberian llamar `fetch` directamente.

- `apiClient.js`: cliente base.
- `productsApi.js`: productos.
- `usersApi.js`: usuarios.
- `ordersApi.js`: pedidos.
- `adminApi.js`: admin.
- `uploadsApi.js`: subida de imagenes.

### `src/config/`

Centraliza datos reutilizables del template:

- Marca y textos comerciales.
- Navegacion.
- Imagenes.
- Colores y tema.
- Configuracion de tienda.

### `src/utils/`

Funciones pequenas y reutilizables:

- Formateo de moneda.
- Calculo y normalizacion de stock.
- Helpers de texto/listas.

## Backend

El backend esta construido con Express y Node.js.

### `server/app.js`

Configura la aplicacion Express, middlewares y rutas principales.

### `server/index.js`

Punto de entrada del servidor.

### `server/routes/`

Carpeta esperada para separar rutas por dominio cuando el backend siga creciendo.

### `server/services/`

Contiene integraciones y logica de servicios externos, por ejemplo emails, uploads o reglas de negocio compartidas.

### `server/models/`

Modelos de MongoDB/Mongoose:

- Productos.
- Usuarios.
- Pedidos.

### `server/config/`

Configuracion del backend basada en variables de entorno y valores por defecto del template.

### `server/data/`\n\nCapa de compatibilidad para exponer datos seed al backend.\n\n### `seeds/`\n\nCatalogos de ejemplo para desarrollo o primera carga de una tienda nueva.

## Flujo principal

1. React consume productos desde la API.
2. Express consulta MongoDB Atlas.
3. El panel admin sube imagenes al backend.
4. El backend envia imagenes a Cloudinary.
5. Cloudinary devuelve una URL.
6. MongoDB guarda la URL en el producto.
7. El checkout crea pedidos y actualiza stock.
8. Resend envia emails transaccionales cuando corresponde.


