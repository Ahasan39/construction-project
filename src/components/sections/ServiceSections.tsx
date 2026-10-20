import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assetUrl } from "@/app/assets";
import { brand } from "@/data/brand";
import { services } from "@/data/services";
import { serviceLocationLinks, servicePages, sidingStyles } from "@/data/servicePages";
import type { Disclosure, ServiceFeature, ServiceHubKey, ServicePageContent, ServicePhoto, ServiceProduct } from "@/data/servicePages";

export function ServiceImage({ photo, hero = false }: { photo: ServicePhoto; hero?: boolean }) {
  return <img src={assetUrl(`/images/services/photos/${photo.file}-900.webp`)}
    srcSet={`${assetUrl(`/images/services/photos/${photo.file}-480.webp`)} 480w, ${assetUrl(`/images/services/photos/${photo.file}-900.webp`)} 900w`}
    sizes={hero ? "100vw" : "(max-width: 767px) 100vw, 50vw"}
    alt={photo.alt} width={900} height={600} loading={hero ? "eager" : "lazy"}
    fetchPriority={hero ? "high" : undefined} decoding="async" />;
}

export function ServiceAction({ to = "/free-estimate/", children = "Get a Free Estimate", outline = false }: { to?: string; children?: ReactNode; outline?: boolean }) {
  return <Link className={`service-action${outline ? " service-action--outline" : ""}`} to={to}>{children}</Link>;
}

export function ServiceIntro({ page, service }: { page: ServicePageContent; service: ServiceHubKey }) {
  const navigate = useNavigate();
  return <section className="service-intro" aria-labelledby="service-title">
    <div className="service-panorama"><ServiceImage photo={page.hero} hero /></div>
    <div className="service-container service-intro-panel">
      <div className="service-intro-copy">
        <nav aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> › </span>{services.find(s => s.key === service)?.title}</nav>
        {page.eyebrow && <p className="service-eyebrow">{page.eyebrow}</p>}
        <h1 id="service-title">{page.title}</h1><p>{page.intro}</p>
      </div>
      <aside className="service-specials" aria-labelledby="specials-title">
        <ServiceImage photo={{ file: "promo-warranty", alt: "Illustrative home exterior" }} />
        <h2 id="specials-title">Current Specials</h2>
        <p>Select a location to explore local {service} services and offers.</p>
        <label className="sr-only" htmlFor="service-location">Select a location for {service}</label>
        <select id="service-location" value="" onChange={e => { if (e.target.value) navigate(e.target.value); }}>
          <option value="" disabled>Select Location</option>
          {serviceLocationLinks(service).map(location => <option key={location.to} value={location.to}>{location.label}{location.isService ? "" : " — regional hub"}</option>)}
        </select>
      </aside>
    </div>
  </section>;
}

export function ServiceTrust() {
  return <section className="service-container service-trust" aria-label="Reference company indicators">
    <p className="service-reference-note">Reference company statistics — not claims about this demo.</p>
    <div>{[["#1", "Consumer Choice for 20 years running"], ["A+", "Rating on the BBB"], ["500k+", "Satisfied customers"], ["60+", "Years in business"]].map(([value, label]) => <p key={value}><strong>{value}</strong><span>{label}</span></p>)}</div>
  </section>;
}

export function ServiceProducts({ products, masonry = false }: { products: ServiceProduct[]; masonry?: boolean }) {
  return <section className={`service-container service-products${masonry ? " service-products--masonry" : ""}`} aria-label={masonry ? "Masonry services" : "Service and product options"}>
    {products.map((product, index) => <article key={product.title}>
      {!masonry && <ServiceImage photo={product.photo} />}
      <div>{masonry && <span className="service-product-number" aria-hidden="true">0{index + 1}</span>}<h2>{product.title}</h2><p>{product.body}</p>
        {!masonry && <ServiceAction to={product.to} outline={!product.to}>{product.action ?? "Learn more"}</ServiceAction>}
      </div>
    </article>)}
  </section>;
}

export function ServiceFeatureSection({ feature, imageFirst = false, muted = false, children, media }: { feature: ServiceFeature; imageFirst?: boolean; muted?: boolean; children?: ReactNode; media?: ReactNode }) {
  return <section className={`service-feature${muted ? " service-muted" : ""}`}>
    <div className={`service-container service-feature-grid${imageFirst ? " service-feature-grid--image-first" : ""}`}>
      <div className="service-feature-copy"><h2>{feature.title}</h2>
        {feature.paragraphs.map(p => <p key={p}>{p}</p>)}
        {feature.bullets && <ul className="service-checks">{feature.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
        {children}
        {feature.action && <ServiceAction to={feature.action.to}>{feature.action.label}</ServiceAction>}
      </div>
      <div className="service-feature-media">{media ?? <ServiceImage photo={feature.photo} />}</div>
    </div>
  </section>;
}

export function ServiceDisclosures({ items, compact = false }: { items: Disclosure[]; compact?: boolean }) {
  return <div className={`service-disclosures${compact ? " service-disclosures--compact" : ""}`}>
    {items.map(item => <details key={item.title}><summary><h3>{item.title}</h3><span aria-hidden="true">+</span></summary><p>{item.body}</p></details>)}
  </div>;
}

export function ServiceFaq({ items, windows = false }: { items: Disclosure[]; windows?: boolean }) {
  return <section className="service-faq service-muted"><div className="service-container"><h2>{windows ? "Frequently Asked Questions about Window Replacement" : "Frequently Asked Questions"}</h2><ServiceDisclosures items={items} /></div></section>;
}

export function SidingStyleCarousel() {
  const [index, setIndex] = useState(0);
  const style = sidingStyles[index];
  return <div className="siding-style-carousel" role="region" aria-label="Siding styles" aria-roledescription="carousel">
    <ServiceImage photo={servicePages.siding.features[0].photo} />
    <div className="siding-style-caption"><div className="siding-style-controls">
      <button aria-label="Previous siding style" onClick={() => setIndex((index + sidingStyles.length - 1) % sidingStyles.length)}>←</button>
      <p aria-live="polite" aria-atomic="true"><strong>{style.title}</strong><span>{index + 1} / {sidingStyles.length}</span></p>
      <button aria-label="Next siding style" onClick={() => setIndex((index + 1) % sidingStyles.length)}>→</button>
    </div><p>{style.body}</p><small>Illustrative exterior photo; profiles are described above.</small></div>
  </div>;
}

export function ServiceLocations({ service }: { service: ServiceHubKey }) {
  return <ul className="service-location-links">{serviceLocationLinks(service).filter(l => !l.to.startsWith("/lexington")).map(l => <li key={l.to}><Link to={l.to}>{l.label}{l.isService ? " — Windows" : " — Regional services"}</Link></li>)}</ul>;
}

export function ServiceRelated({ service, list = false }: { service: ServiceHubKey; list?: boolean }) {
  const related = (["roofing", "siding", "windows", "gutters", "masonry"] as const)
    .filter(key => key !== service).map(key => services.find(s => s.key === key)!);
  const contents = <><h2>Bundle &amp; Save on Additional Services</h2>
    <div className={list ? "service-related-list" : "service-related-grid"}>
      {related.map(s => <article key={s.key}>
        {!list && <ServiceImage photo={servicePages[s.key as ServiceHubKey].hero} />}
        <h3>{s.title}</h3><p>{s.tagline}</p><ServiceAction to={`/${s.slug}/`} outline>Learn More<span className="sr-only"> about {s.title}</span></ServiceAction>
      </article>)}
      <article>{!list && <ServiceImage photo={servicePages.roofing.hero} />}<h3>Insulation</h3><p>Discuss attic insulation alongside your exterior project.</p><ServiceAction outline>Ask About Insulation</ServiceAction></article>
    </div></>;
  return <section className={`service-related${list ? " service-related--list" : " service-muted"}`}><div className="service-container">{list ? <div className="service-feature-grid"><div>{contents}</div><div className="service-feature-media"><ServiceImage photo={servicePages.windows.hero} /></div></div> : contents}</div></section>;
}

export function ServiceCallout({ title, text, children, muted = false }: { title: string; text: string; children?: ReactNode; muted?: boolean }) {
  return <section className={`service-callout${muted ? " service-muted" : ""}`}><div className="service-container"><h2>{title}</h2><p>{text}</p><div className="service-actions">{children ?? <ServiceAction />}</div></div></section>;
}

export function ServiceEstimate({ windows = false, estimateTo }: { windows?: boolean; estimateTo?: string }) {
  return <section className="service-estimate"><div className="service-container"><h2>{windows ? "Ready to get started?" : "Schedule a Free No-Obligation Estimate Today"}</h2><p>Discuss your project, compare the options and request a written estimate.</p><div className="service-actions"><ServiceAction to={estimateTo}>Get a Free Estimate</ServiceAction>{windows && <a className="service-action" href={brand.phoneHref}>Call {brand.phoneDisplay}</a>}</div></div></section>;
}
