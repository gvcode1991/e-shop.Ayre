export const appVersion = "1.5.5";

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
