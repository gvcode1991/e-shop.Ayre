import { productFallbackImages } from "./images";

export const appVersion = "1.6.0";

export const storageKeys = {
  cart: "ayre-cart",
  userToken: "ayre-user-token",
  adminToken: "ayre-admin-token",
};

export const storeInfo = {
  name: "AyRe",
  legalName: "AyRe",
  slogan: "Prendas y accesorios para tu estilo diario",
  shortDescription: "Remeras de selecciones, conjuntos deportivos y relojes seleccionados para completar tu look.",
  contactEmail: "ventas@ayre.com.ar",
  whatsappFallback: "5491123456789",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  storeLocationText: "Tienda online con envios a todo el pais",
};

export const heroContent = {
  eyebrow: "AyRe indumentaria",
  title: storeInfo.slogan,
  description: storeInfo.shortDescription,
  primaryAction: "Ver catalogo",
  secondaryAction: `Conocer ${storeInfo.name}`,
};

export const categories = ["Todos", "Conjuntos", "Camisetas", "Selecciones", "Clubes", "Accesorios"];
export const visibleCategoryShortcuts = [
  { label: "Catalogo completo", value: "Todos" },
  { label: "Remeras de selecciones", value: "Selecciones" },
  { label: "Conjuntos deportivos", value: "Conjuntos" },
  { label: "Relojes y accesorios", value: "Accesorios" },
];

export const showcaseCategories = [
  { label: "Camisetas mundialistas", value: "Camisetas", imageKey: "camisetas", featured: true },
  { label: "Conjuntos deportivos", value: "Conjuntos", imageKey: "conjuntos" },
  { label: "Selecciones", value: "Selecciones", imageKey: "selecciones" },
];

export const introHighlights = [
  { number: "01", title: "Remeras de selecciones", text: "Modelos elegidos para vestir comodo, sumar identidad y armar looks casuales." },
  { number: "02", title: "Conjuntos deportivos", text: "Prendas practicas para uso diario, entrenar o moverte con estilo." },
  { number: "03", title: "Accesorios y relojes", text: "Detalles seleccionados para completar tu outfit y renovar tu coleccion." },
];

export const shippingTickerItems = ["Envios a todo el pais", "Medios de pago disponibles", "Envios a todo el pais", "Medios de pago disponibles"];

export const homeCarouselContent = {
  eyebrow: "Nuevos ingresos",
  title: "Lo mas buscado",
  viewAllText: "Ver todo",
};

export const catalogContent = {
  eyebrow: "Catalogo",
  title: "Productos destacados",
  emptyMessage: "No encontramos productos con esos filtros.",
};

export const contactSection = {
  eyebrow: "Envios",
  title: "Compras desde cualquier punto del pais",
  description: "Preparamos tu pedido y coordinamos la entrega por WhatsApp para que recibas tus prendas y accesorios de forma simple.",
  note: "Despacho coordinado y seguimiento del pedido.",
};

export const currencyConfig = {
  locale: "es-AR",
  currency: "ARS",
};

export const availableSizes = ["4", "6", "8", "10", "12", "14", "S", "M", "L", "XL"];
export const freeShippingThreshold = 60000;
export const shippingCost = 4500;

export const deliveryMethods = ["Retiro en tienda", "Envio a domicilio", "Coordinar por WhatsApp"];
export const paymentMethods = ["Efectivo", "Transferencia", "Mercado Pago", "Coordinar"];
export const paymentHelpText = {
  Transferencia: "Al confirmar, guardamos el pedido y te pasamos los datos de transferencia por WhatsApp.",
  "Mercado Pago": "Dejamos el pedido reservado y te enviamos el link de Mercado Pago para completar el pago.",
  Efectivo: "Pagas al retirar o al coordinar la entrega.",
  Coordinar: "Te contactamos para elegir el metodo de pago mas comodo.",
};

export const checkoutDefaults = {
  delivery: deliveryMethods[0],
  payment: paymentMethods[0],
};

export const checkoutContent = {
  fields: {
    name: { label: "Nombre", placeholder: "Nombre y apellido" },
    phone: { label: "Telefono", placeholder: "WhatsApp" },
    email: { label: "Email registrado", placeholder: "tu@email.com" },
    delivery: { label: "Entrega" },
    address: { label: "Direccion", placeholder: "Calle, numero, localidad" },
    payment: { label: "Pago" },
    notes: { label: "Comentarios", placeholder: "Nombre en camiseta, colores o cualquier detalle del pedido" },
  },
  notifyLabel: "Enviarme confirmacion y novedades al email",
};

export const cartContent = {
  eyebrow: "Compra",
  title: "Carrito",
  closeLabel: "Cerrar carrito",
  steps: ["1. Productos", "2. Datos", "3. Confirmar"],
  sizeLabel: "Talle",
  colorLabel: "Color",
  chooseOption: "Elegir",
  subtractLabel: "Restar",
  addLabel: "Sumar",
  emptyMessage: "Tu carrito esta vacio.",
  clearLabel: "Vaciar carrito",
  reviewTitle: "Revisar pedido",
  summary: {
    subtotal: "Subtotal",
    shipping: "Envio",
    total: "Total",
    freeShippingMessage: "Te faltan {amount} para envio gratis.",
    freeShippingValue: "Sin cargo",
  },
  whatsappLabel: "Consultar por WhatsApp",
  previousStep: "Volver",
  nextStep: "Continuar",
  finish: "Finalizar compra",
  loading: "Enviando pedido...",
};

export const orderMessages = {
  createError: "No pudimos crear el pedido.",
  success: "Pedido recibido: {orderId}. Carrito vaciado y stock actualizado.",
  apiErrorSuffix: "Revisa que la API este corriendo.",
};

export const accountContent = {
  register: {
    eyebrow: "Cuenta",
    title: "Crear cuenta",
    note: "Registrate para recibir el email de activacion. Necesitas activar la cuenta antes de comprar.",
    marketingLabel: "Recibir novedades por email",
    submitLabel: "Crear cuenta y enviar confirmacion",
    pendingTitle: "Activacion por email",
    pendingText: `Despues de registrarte, abri el email de ${storeInfo.name} y confirma tu cuenta para habilitar compras.`,
    activeStatus: "Cuenta activa",
    pendingStatus: "Pendiente de activacion",
  },
  account: {
    eyebrow: "Mi cuenta",
    title: "Administracion de cuenta",
    note: "Inicia sesion para consultar tus preferencias, favoritos y compras.",
    loginTitle: "Iniciar sesion",
    emailLabel: "Email registrado",
    passwordLabel: "Contrasena",
    loginButton: "Entrar",
    emptyTitle: "Cuenta",
    emptyText: "Ingresa con tu email y contrasena para ver tus compras y preferencias.",
    activeState: "activa",
    pendingState: "pendiente de confirmacion",
    notificationsLabel: "Recibir notificaciones al mail",
    favoritesLabel: "Favoritos",
    purchasesLabel: "Compras realizadas",
  },
};

export const footerContent = {
  navigationTitle: "Navegacion",
  contactTitle: "Contactanos",
  copyright: `Copyright ${storeInfo.legalName} - 2026. Todos los derechos reservados.`,
};

export const adminContent = {
  panelEyebrow: "Gestion",
  panelTitle: "Panel admin",
  panelNote: "Alta, baja y modificacion de productos del catalogo.",
  newProductButton: "Nuevo producto",
  accessTitle: "Acceso admin",
  emailLabel: "Email admin",
  emailPlaceholder: `admin@${storeInfo.name.toLowerCase()}.com`,
  passwordLabel: "Contrasena admin",
  passwordPlaceholder: "Contrasena privada",
  unlockButton: "Desbloquear panel",
  product: {
    tagsPlaceholder: "Producto destacado, Categoria, Marca",
    imagePlaceholder: "URL de imagen principal",
    galleryPlaceholder: "Una URL por linea. El panel las agrega automaticamente.",
    uploadFormats: "JPG, PNG o WebP hasta 5 MB.",
    uploadButton: "Subir imagen",
    uploadLoading: "Subiendo...",
    descriptionPlaceholder: "Descripcion corta para el catalogo",
  },
};

export const fallbackProducts = [
  { id: "set-boca-nino", name: "Set Boca nino", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Camiseta, short y medias para chicos.", price: 42900, image: productFallbackImages.setBocaNino, badge: "Club" },
  { id: "conjunto-boca-azul", name: "Conjunto Boca azul", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera con capucha y pantalon deportivo.", price: 54900, image: productFallbackImages.conjuntoBocaAzul, badge: "Nuevo" },
  { id: "set-river-nino", name: "Set River nino", category: "Conjuntos", tags: ["Clubes", "River"], description: "Kit completo con camiseta, short y medias.", price: 42900, image: productFallbackImages.setRiverNino, badge: "Club" },
  { id: "conjunto-boca-blanco", name: "Conjunto Boca blanco", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera clara y pantalon con detalles.", price: 54900, image: productFallbackImages.conjuntoBocaBlanco, badge: "Invierno" },
  { id: "set-racing-nino", name: "Set Racing nino", category: "Conjuntos", tags: ["Clubes", "Racing"], description: "Kit completo celeste, blanco y azul.", price: 42900, image: productFallbackImages.setRacingNino, badge: "Club" },
  { id: "set-al-nassr-nino", name: "Set Al Nassr nino", category: "Conjuntos", tags: ["Clubes", "Al Nassr"], description: "Kit amarillo con short y medias.", price: 42900, image: productFallbackImages.setAlNassrNino, badge: "Global" },
  { id: "camiseta-argentina-10", name: "Camiseta Argentina 10", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo titular con detalles dorados.", price: 34900, image: productFallbackImages.camisetaArgentina10, badge: "Seleccion" },
  { id: "camiseta-argentina-negra", name: "Camiseta Argentina negra", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo alternativo con graficas azules.", price: 34900, image: productFallbackImages.camisetaArgentinaNegra, badge: "Seleccion" },
  { id: "camiseta-argentina-stock", name: "Camiseta Argentina stock", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Pack disponible con etiqueta.", price: 34900, image: productFallbackImages.camisetaArgentinaStock, badge: "Stock" },
  { id: "camiseta-portugal-7", name: "Camiseta Portugal 7", category: "Camisetas", tags: ["Selecciones", "Portugal"], description: "Modelo rojo con detalles verdes.", price: 34900, image: productFallbackImages.camisetaPortugal7, badge: "Seleccion" },
  { id: "reloj-negro", name: "Reloj negro", category: "Accesorios", tags: ["Relojes"], description: "Reloj negro para completar tu look diario.", price: 29900, image: productFallbackImages.relojNegro, badge: "Accesorio" },
  { id: "reloj-gold", name: "Reloj gold", category: "Accesorios", tags: ["Relojes"], description: "Reloj dorado con terminacion elegante.", price: 29900, image: productFallbackImages.relojGold1, images: [productFallbackImages.relojGold1, productFallbackImages.relojGold2, productFallbackImages.relojGold3], badge: "Accesorio" },
  { id: "reloj-silver", name: "Reloj silver", category: "Accesorios", tags: ["Relojes"], description: "Reloj plateado versatil para todos los dias.", price: 29900, image: productFallbackImages.relojSilver1, images: [productFallbackImages.relojSilver1, productFallbackImages.relojSilver2], badge: "Accesorio" },
].map((product) => ({
  ...product,
  images: product.images || [product.image],
  stock: [
    { size: "8", quantity: 4 },
    { size: "10", quantity: 4 },
    { size: "12", quantity: 4 },
    { size: "S", quantity: 3 },
    { size: "M", quantity: 3 },
  ],
  colors: [],
}));
