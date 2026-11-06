import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assetUrl } from "@/app/assets";
import { applyRouteMeta } from "@/app/seo";
import { ServiceAction, ServiceEstimate, ServiceRelated, ServiceTrust } from "@/components/sections/ServiceSections";
import { commercialProcess, commercialProducts, detailPhotos, findRoofingDetail, roofingDetailLocationLinks, roofingPackages } from "@/data/roofingDetails";
import type { DetailDisclosure, DetailFeature, DetailPhoto, RoofingDetail } from "@/data/roofingDetails";
import type { Service, ServiceVariant } from "@/types";
import NotFoundPage from "./NotFoundPage";
import "@/styles/services.css";
import "@/styles/roofing-details.css";

export interface ServiceVariantPageProps { service: Service; variant: ServiceVariant }
function DetailImage({ photo, hero = false, sizes }: { photo: DetailPhoto; hero?: boolean; sizes?: string }) {
  const path = `/images/roofing-details/${photo.name}`;
  return <img src={assetUrl(`${path}-${photo.width}.webp`)} srcSet={`${assetUrl(`${path}-480.webp`)} 480w, ${assetUrl(`${path}-${photo.width}.webp`)} ${photo.width}w`}
    sizes={sizes ?? (hero ? "100vw" : "(max-width: 1023px) 100vw, (min-width: 1440px) 630px, 50vw")} alt={photo.alt} width={photo.width} height={Math.round(photo.width * 2 / 3)}
    loading={hero ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} decoding="async" />;
}
function Disclosures({ items, compact = false }: { items: DetailDisclosure[]; compact?: boolean }) {
  return <div className={`service-disclosures${compact ? " service-disclosures--compact" : ""}`}>{items.map(item =>
    <details key={item.title}><summary><h3>{item.title}</h3><span aria-hidden="true">+</span></summary><p>{item.body}{item.link && <> <Link className="detail-text-link" to={item.link.to}>{item.link.label}</Link></>}</p></details>)}</div>;
}
function Feature({ feature, imageFirst = false, muted = false, visualizer = false }: { feature: DetailFeature; imageFirst?: boolean; muted?: boolean; visualizer?: boolean }) {
  return <section className={`service-feature${muted ? " service-muted" : ""}`}><div className={`service-container service-feature-grid${imageFirst ? " service-feature-grid--image-first" : ""}`}>
    <div className="service-feature-copy"><h2>{feature.title}</h2>{feature.subtitle && <h3 className="detail-subtitle">{feature.subtitle}</h3>}
      {feature.paragraphs.map(p => <p key={p}>{p}</p>)}{feature.bullets && <ul className="service-checks">{feature.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
      {feature.disclosures && <Disclosures items={feature.disclosures} compact />}
      {visualizer && <Link className="detail-text-link" to="/visualizer/">Try the Visualizer</Link>}
    </div><figure className="service-feature-media"><DetailImage photo={feature.photo} />{feature.photo.generated && <figcaption>AI-generated illustrative scene</figcaption>}</figure>
  </div></section>;
}
function Packages() {
  return <section className="detail-packages service-container"><header><p className="detail-kicker">Shingle Packages</p><h2>Roofing Systems</h2><p>Compare the reference’s three levels of shingle protection, from everyday coverage to its premium roofing system.</p><p className="service-reference-note">Reference package names and warranty labels; this demo does not sell or warrant these products.</p></header>
    <div className="detail-three-grid">{roofingPackages.map((item, i) => <article key={item.title} className={`detail-tier detail-tier--${i}`}><header><h3>{item.title}</h3><p>{item.tier}</p></header><div><strong className="detail-product-name">{item.product}</strong><p>{item.body}</p><ul><li>{item.protection}</li><li>{item.warranty}</li><li>Review full written terms and exclusions.</li></ul><ServiceAction /></div></article>)}</div>
  </section>;
}
function CommercialSections() {
  return <><section className="service-container service-products detail-commercial-products" aria-label="Commercial roofing systems">{commercialProducts.map(product => <article key={product.title}><DetailImage photo={product.photo} sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 375px" /><div><h2>{product.title}</h2><p>{product.body}</p><ServiceAction to={product.to}>{product.action}</ServiceAction></div></article>)}</section>
    <section className="detail-process service-muted"><div className="service-container"><header><h2>Your Roofing Project, Simplified</h2><p>From the first assessment to the final walkthrough, a clear process keeps the building and its occupants in view.</p></header><div className="detail-three-grid">{commercialProcess.map((step, i) => <article key={step.title} className={`detail-tier detail-tier--${i}`}><header><span aria-hidden="true">0{i + 1}</span><h3>{step.title}</h3></header><div><p>{step.body}</p></div></article>)}</div><div className="service-actions"><ServiceAction>Schedule a Project Consultation</ServiceAction></div></div></section></>;
}
function DetailBody({ page }: { page: RoofingDetail }) {
  const navigate = useNavigate();
  const commercial = page.slug === "commercial-roofing";
  const replacement = page.slug === "roof-replacement";
  const metal = page.slug === "metal-roofing";
  useEffect(() => { applyRouteMeta({ title: page.title, description: page.intro, canonicalPath: `/roofing/${page.slug}/` }); }, [page]);
  return <div className={`service-page roofing-detail roofing-detail--${page.slug}`}>
    <section className="service-intro" aria-labelledby="detail-title"><div className="service-panorama"><DetailImage photo={page.hero} hero /></div><div className="service-container service-intro-panel">
      <div className="service-intro-copy"><nav aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> › </span><Link to="/roofing/">Roofing</Link><span aria-hidden="true"> › </span><span>{page.title}</span></nav><h1 id="detail-title">{page.title}</h1>{page.subtitle && <p className="detail-subtitle">{page.subtitle}</p>}<p>{page.intro}</p></div>
      <aside className="service-specials" aria-labelledby="detail-specials"><DetailImage photo={detailPhotos.exterior} sizes="400px" /><h2 id="detail-specials">Current Specials</h2><p>Select a location to explore local roofing services and offers.</p><label htmlFor="detail-location" className="sr-only">Select a location</label><select id="detail-location" value="" onChange={e => { if (e.target.value) navigate(e.target.value); }}><option value="" disabled>Select Location</option>{roofingDetailLocationLinks(page.slug).map(location => <option key={location.to} value={location.to}>{location.label}</option>)}</select></aside>
    </div></section>
    <Feature feature={page.features[0]} />
    {commercial ? <section className="service-container service-trust" aria-label="Reference company indicators"><p className="service-reference-note">Reference company statistics — not claims about this demo.</p><div>{[["#1", "Consumer Choice for 20 years running"], ["A+", "Rating on the BBB"], ["100k+", "Satisfied customers"], ["25+", "Years of commercial experience"]].map(([value, label]) => <p key={value}><strong>{value}</strong><span>{label}</span></p>)}</div></section> : <ServiceTrust />}
    <Feature feature={page.features[1]} imageFirst muted />
    {replacement && <Packages />}
    {commercial ? <CommercialSections /> : <Feature feature={page.features[2]} />}
    {(replacement || metal) && <Feature feature={page.features[3]} imageFirst visualizer />}
    {page.faqs && <section className="service-faq service-muted"><div className="service-container"><h2>Frequently Asked Questions</h2><Disclosures items={page.faqs} /></div></section>}
    {(replacement || metal) && <ServiceRelated service="roofing" />}
    <ServiceEstimate />
  </div>;
}
export default function ServiceVariantPage({ service, variant }: ServiceVariantPageProps) {
  const page = service.key === "roofing" ? findRoofingDetail(variant.slug) : undefined;
  return page ? <DetailBody page={page} /> : <NotFoundPage />;
}
