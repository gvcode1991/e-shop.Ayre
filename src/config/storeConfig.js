import { productFallbackImages } from "./images";

export const appVersion = "1.0.0";

export const storageKeys = {
  cart: "ecommerce-template-cart",
  userToken: "ecommerce-template-user-token",
  adminToken: "ecommerce-template-admin-token",
};

export const storeInfo = {
  name: "Demo Store",
  legalName: "Demo Store",
  slogan: "Products for your everyday store",
  shortDescription: "A reusable catalog with apparel, accessories and sample products ready to customize.",
  contactEmail: "sales@example.com",
  whatsappFallback: "5490000000000",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  storeLocationText: "Online store ready for nationwide shipping",
};

export const heroContent = {
  eyebrow: "Store collection",
  title: storeInfo.slogan,
  description: storeInfo.shortDescription,
  primaryAction: "View catalog",
  secondaryAction: `About ${storeInfo.name}`,
};

export const categories = ["Todos", "Apparel", "Accessories", "Featured"];
export const visibleCategoryShortcuts = [
  { label: "Catalogo completo", value: "Todos" },
  { label: "Apparel essentials", value: "Apparel" },
  { label: "Accessories", value: "Accessories" },
  { label: "Featured products", value: "Featured" },
];

export const showcaseCategories = [
  { label: "Apparel essentials", value: "Apparel", imageKey: "apparel", featured: true },
  { label: "Accessories", value: "Accessories", imageKey: "accessories" },
  { label: "Featured products", value: "Featured", imageKey: "featured" },
];

export const introHighlights = [
  { number: "01", title: "Flexible catalog", text: "Sections ready to adapt to apparel, accessories or any retail category." },
  { number: "02", title: "Visible stock", text: "Products support sizes, colors, images and availability from the admin panel." },
  { number: "03", title: "Simple checkout", text: "Cart, customer data and order confirmation are prepared for real stores." },
];

export const shippingTickerItems = ["Shipping options available", "Payment methods ready", "Shipping options available", "Payment methods ready"];

export const homeCarouselContent = {
  eyebrow: "New arrivals",
  title: "Featured products",
  viewAllText: "View all",
};

export const catalogContent = {
  eyebrow: "Catalog",
  title: "Products",
  emptyMessage: "No encontramos productos con esos filtros.",
};

export const contactSection = {
  eyebrow: "Shipping",
  title: "Orders ready to coordinate",
  description: "Prepare orders, coordinate delivery and keep customers informed from checkout.",
  note: "Delivery and pickup texts can be customized from the store configuration.",
};

export const currencyConfig = {
  locale: "es-AR",
  currency: "ARS",
};

export const availableSizes = ["4", "6", "8", "10", "12", "14", "S", "M", "L", "XL"];
export const freeShippingThreshold = 60000;
export const shippingCost = 4500;

export const deliveryMethods = ["Retiro en tienda", "Envio a domicilio", "Coordinar entrega"];
export const paymentMethods = ["Efectivo", "Transferencia", "Mercado Pago", "Coordinar"];
export const paymentHelpText = {
  Transferencia: "Al confirmar, guardamos el pedido y te pasamos los datos de transferencia.",
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
    phone: { label: "Telefono", placeholder: "Telefono de contacto" },
    email: { label: "Email registrado", placeholder: "tu@email.com" },
    delivery: { label: "Entrega" },
    address: { label: "Direccion", placeholder: "Calle, numero, localidad" },
    payment: { label: "Pago" },
    notes: { label: "Comentarios", placeholder: "Talle, color o cualquier detalle del pedido" },
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
  emailPlaceholder: "admin@example.com",
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
  { id: "basic-t-shirt", name: "Basic T-shirt", category: "Apparel", tags: ["Basics", "Tops"], description: "Soft everyday t-shirt for a reusable store catalog.", price: 24900, image: productFallbackImages.basicTShirt, badge: "New" },
  { id: "urban-jacket", name: "Urban jacket", category: "Featured", tags: ["Outerwear", "Urban"], description: "Light jacket sample product ready to replace with real stock.", price: 54900, image: productFallbackImages.urbanJacket, badge: "Featured" },
  { id: "daily-accessory", name: "Daily accessory", category: "Accessories", tags: ["Accessories"], description: "Accessory sample item for testing the checkout flow.", price: 19900, image: productFallbackImages.dailyAccessory, badge: "Accessory" },
].map((product) => ({
  ...product,
  images: product.images || [product.image],
  stock: [
    { size: "S", quantity: 3 },
    { size: "M", quantity: 3 },
    { size: "L", quantity: 3 },
  ],
  colors: [],
}));
