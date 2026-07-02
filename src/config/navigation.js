import { storeInfo } from "./storeConfig";

export const mainNavLinks = [
  { label: "Coleccion", href: "#productos" },
  { label: "Camisetas", href: "#productos" },
  { label: "Conjuntos", href: "#productos" },
  { label: storeInfo.name, href: "#coleccion" },
  { label: "Contacto", href: "#contacto" },
  { label: "Admin", href: "/admin", external: true },
];

export const headerActions = {
  favorites: "Favoritos",
  account: "Mi cuenta",
  stores: "Tiendas",
  cart: "Cesta",
};

export const mobileMenuLinks = [
  { label: "Indumentaria", category: "Todos" },
  { label: "Accesorios", category: "Accesorios" },
  { label: "Registro", path: "/registro" },
  { label: "Mi cuenta", path: "/cuenta" },
];

export const footerNavigationLinks = [
  { label: "Catalogo", href: "#productos" },
  { label: "Coleccion", href: "#coleccion" },
  { label: "Mi cuenta", path: "/cuenta" },
];

export const searchPlaceholders = {
  desktop: "Buscar camisetas, conjuntos, clubes...",
  mobile: "Buscar productos",
};
