import React from "react";

export function Hero({ cssImageUrl, heroContent, images }) {
  return (
    <section className="hero" style={{ "--hero-image": cssImageUrl(images.heroDesktop), "--hero-mobile-image": cssImageUrl(images.heroMobile) }}>
      <div className="hero-copy">
        <p className="eyebrow">{heroContent.eyebrow}</p>
        <h1>{heroContent.title}</h1>
        <p className="hero-text">{heroContent.description}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#productos">{heroContent.primaryAction}</a>
          <a className="secondary-action" href="#coleccion">{heroContent.secondaryAction}</a>
        </div>
      </div>
    </section>
  );
}
