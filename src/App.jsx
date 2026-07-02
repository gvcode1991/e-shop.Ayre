import { Facebook, Heart, Instagram, PackageCheck, Search, ShoppingBag, Truck, UserRound, X } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";

import { AccountPanel } from "./components/account/AccountPanel";
import { AdminPanel } from "./components/admin/AdminPanel";
import { CartDrawer } from "./components/cart/CartDrawer";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/layout/Hero";
import { ProductGrid } from "./components/products/ProductGrid";
import { images } from "./config/images";
import { applyThemeVariables } from "./config/themeConfig";
import { footerNavigationLinks, headerActions, mainNavLinks, mobileMenuLinks, searchPlaceholders } from "./config/navigation";
import {
  appVersion,
  catalogContent,
  contactSection,
  footerContent,
  heroContent,
  homeCarouselContent,
  introHighlights,
  showcaseCategories,
  shippingTickerItems,
  storeInfo,
  visibleCategoryShortcuts,
} from "./config/storeConfig";
import { AdminProvider } from "./contexts/AdminContext";
import { CartProvider, useCartContext } from "./contexts/CartContext";
import { StoreProvider, useStoreContext } from "./contexts/StoreContext";
import { UserProvider } from "./contexts/UserContext";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useAdminProducts } from "./hooks/useAdminProducts";
import { useCheckout } from "./hooks/useCheckout";
import { useProductImageUpload } from "./hooks/useProductImageUpload";
import { useProducts } from "./hooks/useProducts";
import { useUserAccount } from "./hooks/useUserAccount";
import { formatter } from "./utils/formatters";
import { getProductSizes, stockTotal } from "./utils/stock";

function cssImageUrl(imageUrl) {
  return `url("${imageUrl}")`;
}
export default function App() {
  return (
    <StoreProvider>
      <UserProvider>
        <AdminProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AdminProvider>
      </UserProvider>
    </StoreProvider>
  );
}

function AppContent() {
  const { images: storeImages, navigation: storeNavigation, storeConfig: storeSettings, themeConfig: activeThemeConfig } = useStoreContext();
  const storeLogo = storeImages.logo;
  const activeStoreInfo = storeSettings.storeInfo;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || activeStoreInfo.whatsappFallback;
  const activeHeroContent = storeSettings.heroContent;
  const activeFooterContent = storeSettings.footerContent;
  const activeContactSection = storeSettings.contactSection;
  const activeCatalogContent = storeSettings.catalogContent;
  const activeHomeCarouselContent = storeSettings.homeCarouselContent;
  const activeIntroHighlights = storeSettings.introHighlights;
  const activeShowcaseCategories = storeSettings.showcaseCategories;
  const activeShippingTickerItems = storeSettings.shippingTickerItems;
  const activeVisibleCategoryShortcuts = storeSettings.visibleCategoryShortcuts;
  const activeFooterNavigationLinks = storeNavigation.footerNavigationLinks;
  const activeHeaderActions = storeNavigation.headerActions;
  const activeMainNavLinks = storeNavigation.mainNavLinks;
  const activeMobileMenuLinks = storeNavigation.mobileMenuLinks;
  const activeSearchPlaceholders = storeNavigation.searchPlaceholders;
  const {
    addToCart,
    cart,
    clearCart,
    isCartOpen,
    setCartOpen,
    updateCartColor,
    updateCartSize,
    updateQuantity,
  } = useCartContext();
  const {
    adminHeaders,
    adminLogin,
    adminStatus,
    adminUnlocked,
    setAdminStatus,
    unlockAdmin,
    updateAdminLogin,
  } = useAdminAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const { activeProducts, carouselProducts, catalogStatus, loadProducts, products, visibleProducts } = useProducts({ category, query });
  const {
    appendProductImage,
    editingProductId,
    editProduct,
    productForm,
    removeProduct,
    resetProductForm,
    submitProduct,
    updateProductForm,
  } = useAdminProducts({
    adminHeaders,
    adminUnlocked,
    loadProducts,
    onResetProductMedia: () => resetProductImageUpload(),
    setAdminStatus,
  });
  const {
    imageUpload,
    resetProductImageUpload,
    updateProductImageFile,
    uploadProductImage,
  } = useProductImageUpload({
    adminHeaders,
    adminUnlocked,
    appendProductImage,
  });
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    applyThemeVariables(activeThemeConfig);
  }, [activeThemeConfig]);

  useEffect(() => {
    const handleNavigation = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  const cartLines = useMemo(
    () => cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity, size: item.size || "", color: item.color || "" })).filter((item) => item.id),
    [cart, products],
  );

  const cartQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const {
    accountLookup,
    loadAccount: loadUserAccount,
    saveAccountPreferences,
    setUserAccount,
    submitUser,
    toggleFavorite,
    updateAccountLookup,
    updateUserForm,
    userAccount,
    userForm,
    userStatus,
    userToken,
  } = useUserAccount({ navigateTo });
  const {
    buildWhatsAppMessage,
    cartSubtotal,
    cartTotal,
    checkout,
    checkoutStatus,
    checkoutStep,
    currentShippingCost,
    setCheckoutStep,
    submitOrder,
    syncCheckoutEmail,
    updateCheckout,
  } = useCheckout({
    cartLines,
    loadProducts,
    setUserAccount,
    storeName: activeStoreInfo.name,
    userAccount,
    userToken,
  });

  function loadAccount(event) {
    return loadUserAccount(event, syncCheckoutEmail);
  }

  const selectedProduct = useMemo(() => {
    const match = currentPath.match(/^\/producto\/([^/]+)/);
    if (!match) return null;
    return activeProducts.find((product) => product.id === decodeURIComponent(match[1])) || null;
  }, [activeProducts, currentPath]);

  const isAdminRoute = currentPath === "/admin";
  const isRegisterRoute = currentPath === "/registro";
  const isAccountRoute = currentPath === "/cuenta";

  useEffect(() => {
    document.body.classList.toggle("has-open-layer", isCartOpen || isMenuOpen);
    return () => document.body.classList.remove("has-open-layer");
  }, [isCartOpen, isMenuOpen]);

  function navigateTo(path) {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToSection(path, sectionId) {
    navigateTo(path);
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function searchFromMobile(value) {
    setQuery(value);
    setCategory("Todos");
  }

  function openMobileCategory(nextCategory) {
    setQuery("");
    setCategory(nextCategory);
    setMenuOpen(false);
    navigateToSection("/", "productos");
  }

  function closeLayers() {
    setMenuOpen(false);
    setCartOpen(false);
  }

  return (
    <>
      <Header
        cartQuantity={cartQuantity}
        headerActions={activeHeaderActions}
        storeLogo={storeLogo}
        mainNavLinks={activeMainNavLinks}
        navigateTo={navigateTo}
        navigateToSection={navigateToSection}
        query={query}
        searchPlaceholders={activeSearchPlaceholders}
        setCartOpen={setCartOpen}
        setMenuOpen={setMenuOpen}
        setQuery={setQuery}
        storeInfo={activeStoreInfo}
      />

      <main id={isAdminRoute ? "admin" : isRegisterRoute ? "registro" : isAccountRoute ? "cuenta" : "inicio"}>
        {!isAdminRoute && !isRegisterRoute && !isAccountRoute && (
          <>
        <Hero cssImageUrl={cssImageUrl} heroContent={activeHeroContent} images={storeImages} />

        <section className="shipping-band" aria-label="Beneficio de envio">
          <div>
            {activeShippingTickerItems.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
        </section>

        {selectedProduct && (
          <section className="product-detail" aria-label={`Detalle de ${selectedProduct.name}`}>
            <button className="text-link detail-back" type="button" onClick={() => navigateTo("/")}>Volver al catalogo</button>
            <div className="product-detail-layout">
              <div className="product-gallery">
                <img className="product-gallery-main" src={selectedProduct.image} alt={selectedProduct.name} />
                {selectedProduct.images?.length > 1 && (
                  <div className="product-gallery-thumbs" aria-label="Galeria de imagenes">
                    {selectedProduct.images.map((image) => (
                      <img src={image} alt="" key={`${selectedProduct.id}-${image}`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="eyebrow">{selectedProduct.category}</p>
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>
                <strong className="detail-price">{formatter.format(selectedProduct.price)}</strong>
                <div className="variant-summary" aria-label="Variantes disponibles">
                  <span>Stock total: {stockTotal(selectedProduct.stock)}</span>
                  <span>Talles: {getProductSizes(selectedProduct).join(", ")}</span>
                  {selectedProduct.colors?.length > 0 && <span>Colores: {selectedProduct.colors.join(", ")}</span>}
                </div>
                <div className="detail-actions">
                  <button className="primary-action" type="button" onClick={() => addToCart(selectedProduct.id)}>Agregar al carrito</button>
                  <button className="favorite-button" type="button" onClick={() => toggleFavorite(selectedProduct.id)}>
                    <Heart size={18} />
                    {(userAccount?.favorites || []).includes(selectedProduct.id) ? "Guardado" : "Favorito"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="intro-band" id="coleccion" aria-label={`Valores de ${activeStoreInfo.name}`}>
          {activeIntroHighlights.map((highlight) => (
            <div key={highlight.number}><span>{highlight.number}</span><strong>{highlight.title}</strong><p>{highlight.text}</p></div>
          ))}
        </section>

        <section className="category-showcase" aria-label="Categorias destacadas">
          {activeShowcaseCategories.map((showcase) => (
            <button className={`category-tile${showcase.featured ? " large" : ""}`} type="button" style={{ "--tile-image": cssImageUrl(storeImages.categories[showcase.imageKey]) }} onClick={() => openMobileCategory(showcase.value)} key={showcase.value}>
              <span>{showcase.label}</span>
            </button>
          ))}
        </section>

        <section className="home-carousel" aria-label="Productos destacados en inicio">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">{activeHomeCarouselContent.eyebrow}</p>
              <h2>{activeHomeCarouselContent.title}</h2>
            </div>
            <a className="text-link" href="#productos">{activeHomeCarouselContent.viewAllText}</a>
          </div>

          <div className="carousel-track">
            {carouselProducts.map((product) => (
              <article className="carousel-card" key={`carousel-${product.id}`} role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
                <img src={product.image} alt={product.name} />
                <div>
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <strong>{formatter.format(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ProductGrid
          addToCart={addToCart}
          catalogStatus={catalogStatus}
          catalogContent={activeCatalogContent}
          category={category}
          navigateTo={navigateTo}
          setCategory={setCategory}
          setQuery={setQuery}
          toggleFavorite={toggleFavorite}
          userAccount={userAccount}
          visibleCategoryShortcuts={activeVisibleCategoryShortcuts}
          visibleProducts={visibleProducts}
        />
          </>
        )}

        {isAdminRoute && (
          <AdminPanel
            adminLogin={adminLogin}
            adminStatus={adminStatus}
            adminUnlocked={adminUnlocked}
            editingProductId={editingProductId}
            editProduct={editProduct}
            imageUpload={imageUpload}
            productForm={productForm}
            products={products}
            removeProduct={removeProduct}
            resetProductForm={resetProductForm}
            submitProduct={submitProduct}
            unlockAdmin={unlockAdmin}
            updateAdminLogin={updateAdminLogin}
            updateProductForm={updateProductForm}
            updateProductImageFile={updateProductImageFile}
            uploadProductImage={uploadProductImage}
          />
        )}

        {(isRegisterRoute || isAccountRoute) && (
          <AccountPanel
            accountLookup={accountLookup}
            isRegisterRoute={isRegisterRoute}
            loadAccount={loadAccount}
            saveAccountPreferences={saveAccountPreferences}
            submitUser={submitUser}
            updateAccountLookup={updateAccountLookup}
            updateUserForm={updateUserForm}
            userAccount={userAccount}
            userForm={userForm}
            userStatus={userStatus}
          />
        )}

        {!isAdminRoute && !isRegisterRoute && !isAccountRoute && (
        <section className="contact-band" id="contacto">
          <div className="shipping-icon" aria-hidden="true">
            <Truck size={38} />
          </div>
          <div>
            <p className="eyebrow">{activeContactSection.eyebrow}</p>
            <h2>{activeContactSection.title}</h2>
            <p>{activeContactSection.description}</p>
          </div>
          <div className="shipping-note">
            <PackageCheck size={24} />
            <span>{activeContactSection.note}</span>
          </div>
        </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <details>
            <summary>{activeFooterContent.navigationTitle}</summary>
            {activeFooterNavigationLinks.map((link) => link.path ? (
              <a href={link.path} onClick={(event) => { event.preventDefault(); navigateTo(link.path); }} key={link.label}>{link.label}</a>
            ) : (
              <a href={link.href} key={link.label}>{link.label}</a>
            ))}
          </details>
          <details>
            <summary>{activeFooterContent.contactTitle}</summary>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`mailto:${activeStoreInfo.contactEmail}`}>{activeStoreInfo.contactEmail}</a>
          </details>
        </div>

        <div className="footer-social" aria-label="Redes sociales">
          <a href={activeStoreInfo.instagramUrl} target="_blank" rel="noreferrer" aria-label={`Instagram de ${activeStoreInfo.name}`}><Instagram size={25} /></a>
          <a href={activeStoreInfo.facebookUrl} target="_blank" rel="noreferrer" aria-label={`Facebook de ${activeStoreInfo.name}`}><Facebook size={25} /></a>
        </div>

        <a className="footer-brand" href="#inicio" aria-label={`${activeStoreInfo.name} inicio`}>
          <img src={storeLogo} alt="" />
          <span>{activeStoreInfo.name}</span>
        </a>

        <div className="footer-legal">
          <p>{activeFooterContent.copyright}</p>
          <span className="version-mark">v{appVersion}</span>
        </div>
      </footer>

      <CartDrawer
        buildWhatsAppMessage={buildWhatsAppMessage}
        cartLines={cartLines}
        cartSubtotal={cartSubtotal}
        cartTotal={cartTotal}
        checkout={checkout}
        checkoutStatus={checkoutStatus}
        checkoutStep={checkoutStep}
        clearCart={clearCart}
        currentShippingCost={currentShippingCost}
        isCartOpen={isCartOpen}
        setCartOpen={setCartOpen}
        setCheckoutStep={setCheckoutStep}
        submitOrder={submitOrder}
        updateCartColor={updateCartColor}
        updateCartSize={updateCartSize}
        updateCheckout={updateCheckout}
        updateQuantity={updateQuantity}
        whatsappNumber={whatsappNumber}
      />

      <aside className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`} aria-label="Menu mobile" aria-hidden={!isMenuOpen}>
        <div className="mobile-menu-top">
          <button className="menu-plain-button" type="button" aria-label="Cerrar menu" onClick={() => setMenuOpen(false)}><X size={24} /></button>
          <button className="menu-bag" type="button" aria-label="Abrir carrito" onClick={() => { setMenuOpen(false); setCartOpen(true); }}>
            <ShoppingBag size={23} />
            <strong>{cartQuantity}</strong>
          </button>
        </div>

        <label className="mobile-search">
          <Search size={20} />
          <input value={query} onChange={(event) => searchFromMobile(event.target.value)} type="search" placeholder={activeSearchPlaceholders.mobile} />
        </label>

        {query.trim() && (
          <div className="mobile-search-results" aria-live="polite">
            {visibleProducts.slice(0, 5).map((product) => (
              <button type="button" key={`mobile-result-${product.id}`} onClick={() => { setMenuOpen(false); navigateTo(`/producto/${product.id}`); }}>
                <img src={product.image} alt="" />
                <span>{product.name}</span>
                <strong>{formatter.format(product.price)}</strong>
              </button>
            ))}
            {!visibleProducts.length && <p>No encontramos productos.</p>}
          </div>
        )}

        <nav className="mobile-links">
          {activeMobileMenuLinks.map((link) => link.category ? (
            <a href="#productos" onClick={(event) => { event.preventDefault(); openMobileCategory(link.category); }} key={link.label}>{link.label}</a>
          ) : (
            <a href={link.path} onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigateTo(link.path); }} key={link.label}>{link.label}</a>
          ))}
          </nav>

        <div className="mobile-account">
          <UserRound size={21} />
          <a href="/cuenta" onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigateTo("/cuenta"); }}>Mi cuenta</a>
        </div>
      </aside>

      {(isMenuOpen || isCartOpen) && <button className="overlay" type="button" aria-label="Cerrar" onClick={closeLayers} />}
    </>
  );
}
