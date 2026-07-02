import React from "react";

export function Hero({ cssImageUrl, images }) {
  return (
    <section className="hero" style={{ "--hero-image": cssImageUrl(images.heroDesktop), "--hero-mobile-image": cssImageUrl(images.heroMobile) }}>
      <div className="hero-copy">
        <p className="eyebrow">AyRe indumentaria</p>
        <h1>Prendas y accesorios para tu estilo diario</h1>
        <p className="hero-text">Remeras de selecciones, conjuntos deportivos y relojes seleccionados para completar tu look.</p>
        <div className="hero-actions">
          <a className="primary-action" href="#productos">Ver catalogo</a>
          <a className="secondary-action" href="#coleccion">Conocer AyRe</a>
        </div>
      </div>
    </section>
  );
}
