import { useEffect } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "@/app/assets";
import { applyRouteMeta } from "@/app/seo";
import {
  ServiceAction,
  ServiceEstimate,
  ServiceFaq,
  ServiceFeatureSection,
  ServiceImage,
  ServiceProducts,
  ServiceRelated,
  ServiceTrust,
} from "@/components/sections/ServiceSections";
import { servicePages, type ServiceHubKey } from "@/data/servicePages";
import { findLocationServiceContent } from "@/data/locationServicePages";
import {
  commercialProcess,
  commercialProducts,
  detailPhotos,
  findRoofingDetail,
  type DetailDisclosure,
  type DetailFeature,
  type DetailPhoto,
} from "@/data/roofingDetails";
import { hasLocationCapability } from "@/data/availability";
import type { Location, Service, ServiceVariant } from "@/types";
import NotFoundPage from "./NotFoundPage";
import "@/styles/services.css";
import "@/styles/roofing-details.css";

export interface LocationServicePageProps {
  location: Location;
  service: Service;
  variant?: ServiceVariant;
}

const HUB_KEYS: ServiceHubKey[] = [
  "roofing",
  "siding",
  "windows",
  "gutters",
  "masonry",
];

function isHubKey(key: string): key is ServiceHubKey {
  return (HUB_KEYS as string[]).includes(key);
}

const LOCAL_COMMERCIAL_INTROS: Record<string, string> = {
  nashville:
    "Serving Nashville and Middle Tennessee commercial, multifamily, and HOA properties with low-slope TPO and EPDM membranes, standing-seam metal, and architectural shingle systems. Projects are planned around tenant access, operating hours, and documented specifications.",
  dayton:
    "Commercial and multifamily roofing across Dayton, Montgomery County, and the Miami Valley. Compare low-slope membrane systems, metal roofing, and steep-slope replacements with a written scope and minimal disruption to building occupants.",
  cincinnati:
    "Commercial, apartment, and institutional roofing across Cincinnati and the Tri-State region. From TPO and EPDM flat-roof assemblies to steep-slope and metal installations, each project starts with a thorough roof assessment and written proposal.",
};

export default function LocationServicePage({
  location,
  service,
  variant,
}: LocationServicePageProps) {
  if (variant) {
    return (
      <LocationVariantBody
        location={location}
        service={service}
        variant={variant}
      />
    );
  }

  const hubKey = isHubKey(service.key) ? service.key : null;
  const content = hubKey
    ? findLocationServiceContent(location.slug, hubKey)
    : undefined;

  if (!hubKey || !content) {
    return <NotFoundPage />;
  }

  return (
    <LocationServiceBody
      location={location}
      service={service}
      hubKey={hubKey}
      content={content}
    />
  );
}

function DetailImage({
  photo,
  hero = false,
  sizes,
}: {
  photo: DetailPhoto;
  hero?: boolean;
  sizes?: string;
}) {
  const path = `/images/roofing-details/${photo.name}`;
  return (
    <img
      src={assetUrl(`${path}-${photo.width}.webp`)}
      srcSet={`${assetUrl(`${path}-480.webp`)} 480w, ${assetUrl(`${path}-${photo.width}.webp`)} ${photo.width}w`}
      sizes={
        sizes ??
        (hero
          ? "100vw"
          : "(max-width: 1023px) 100vw, (min-width: 1440px) 630px, 50vw")
      }
      alt={photo.alt}
      width={photo.width}
      height={Math.round((photo.width * 2) / 3)}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : undefined}
      decoding="async"
    />
  );
}

function VariantDisclosures({
  items,
  compact = false,
}: {
  items: DetailDisclosure[];
  compact?: boolean;
}) {
  return (
    <div
      className={`service-disclosures${compact ? " service-disclosures--compact" : ""}`}
    >
      {items.map((item) => (
        <details key={item.title}>
          <summary>
            <h3>{item.title}</h3>
            <span aria-hidden="true">+</span>
          </summary>
          <p>
            {item.body}
            {item.link && (
              <>
                {" "}
                <Link className="detail-text-link" to={item.link.to}>
                  {item.link.label}
                </Link>
              </>
            )}
          </p>
        </details>
      ))}
    </div>
  );
}

function VariantFeature({
  feature,
  imageFirst = false,
  muted = false,
}: {
  feature: DetailFeature;
  imageFirst?: boolean;
  muted?: boolean;
}) {
  return (
    <section className={`service-feature${muted ? " service-muted" : ""}`}>
      <div
        className={`service-container service-feature-grid${imageFirst ? " service-feature-grid--image-first" : ""}`}
      >
        <div className="service-feature-copy">
          <h2>{feature.title}</h2>
          {feature.subtitle && (
            <h3 className="detail-subtitle">{feature.subtitle}</h3>
          )}
          {feature.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {feature.bullets && (
            <ul className="service-checks">
              {feature.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {feature.disclosures && (
            <VariantDisclosures items={feature.disclosures} compact />
          )}
        </div>
        <figure className="service-feature-media">
          <DetailImage photo={feature.photo} />
          {feature.photo.generated && (
            <figcaption>AI-generated illustrative scene</figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

function LocationVariantBody({
  location,
  service,
  variant,
}: {
  location: Location;
  service: Service;
  variant: ServiceVariant;
}) {
  const detail = findRoofingDetail(variant.slug);
  const canonicalPath = `/${location.slug}/${service.slug}/${variant.slug}/`;
  const heading = `${location.city} ${variant.title} Contractors`;
  const intro =
    LOCAL_COMMERCIAL_INTROS[location.slug] ??
    `${variant.summary} Serving ${location.city}, ${location.state} with written project scopes, coordinated site access, and commercial roofing systems.`;
  const estimateTo = hasLocationCapability(location.slug, "hasFreeEstimate")
    ? `/${location.slug}/free-estimate/`
    : `/${location.slug}/#estimate`;

  useEffect(() => {
    applyRouteMeta({
      title: heading,
      description: intro,
      canonicalPath,
    });
  }, [heading, intro, canonicalPath]);

  const heroPhoto = detail?.hero ?? detailPhotos.commercial;

  return (
    <div className={`service-page roofing-detail roofing-detail--${variant.slug}`}>
      <section className="service-intro" aria-labelledby="loc-variant-title">
        <div className="service-panorama">
          <DetailImage photo={heroPhoto} hero />
        </div>
        <div className="service-container service-intro-panel">
          <div className="service-intro-copy">
            <nav aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true"> › </span>
              <Link to={`/${location.slug}/`}>
                {location.city}, {location.state}
              </Link>
              <span aria-hidden="true"> › </span>
              <Link to={`/${location.slug}/${service.slug}/`}>
                {service.title}
              </Link>
              <span aria-hidden="true"> › </span>
              <span>{variant.title}</span>
            </nav>
            <p className="service-eyebrow">
              Commercial &amp; Multifamily Roofing · {location.city},{" "}
              {location.state}
            </p>
            <h1 id="loc-variant-title">{heading}</h1>
            {detail?.subtitle && (
              <p className="detail-subtitle">{detail.subtitle}</p>
            )}
            <p>{intro}</p>
            <ServiceAction to={estimateTo}>Get a Free Estimate</ServiceAction>
          </div>

          <aside
            className="service-specials"
            aria-labelledby="loc-variant-specials"
          >
            <DetailImage photo={detailPhotos.exterior} sizes="400px" />
            <h2 id="loc-variant-specials">
              {location.city} Commercial Services
            </h2>
            <p>
              Explore local roofing and project resources for {location.city},{" "}
              {location.state} properties.
            </p>
            <ul className="service-location-links">
              <li>
                <Link to={`/${location.slug}/${service.slug}/`}>
                  {location.city} {service.title.toLowerCase()} hub
                </Link>
              </li>
              {hasLocationCapability(location.slug, "hasFreeEstimate") && (
                <li>
                  <Link to={`/${location.slug}/free-estimate/`}>
                    {location.city} free estimate
                  </Link>
                </li>
              )}
              {hasLocationCapability(location.slug, "hasFinancing") && (
                <li>
                  <Link to={`/${location.slug}/financing/`}>
                    {location.city} financing
                  </Link>
                </li>
              )}
              {hasLocationCapability(location.slug, "hasServiceAreaIndex") && (
                <li>
                  <Link to={`/${location.slug}/service-area/`}>
                    {location.city} service area
                  </Link>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {detail?.features[0] && <VariantFeature feature={detail.features[0]} />}

      <section
        className="service-container service-trust"
        aria-label="Reference company indicators"
      >
        <p className="service-reference-note">
          Reference company statistics — not claims about this demo.
        </p>
        <div>
          {[
            ["#1", "Consumer Choice for 20 years running"],
            ["A+", "Rating on the BBB"],
            ["100k+", "Satisfied customers"],
            ["25+", "Years of commercial experience"],
          ].map(([value, label]) => (
            <p key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </p>
          ))}
        </div>
      </section>

      {detail?.features[1] && (
        <VariantFeature feature={detail.features[1]} imageFirst muted />
      )}

      <section
        className="service-container service-products detail-commercial-products"
        aria-label="Commercial roofing systems"
      >
        {commercialProducts.map((product) => (
          <article key={product.title}>
            <DetailImage
              photo={product.photo}
              sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 375px"
            />
            <div>
              <h2>{product.title}</h2>
              <p>{product.body}</p>
              <ServiceAction
                to={
                  product.to === "/free-estimate/" ? estimateTo : product.to
                }
              >
                {product.action}
              </ServiceAction>
            </div>
          </article>
        ))}
      </section>

      <section className="detail-process service-muted">
        <div className="service-container">
          <header>
            <h2>Your {location.city} Commercial Project, Simplified</h2>
            <p>
              From the first on-site assessment to the final walkthrough, a
              documented process keeps the building and its occupants in view.
            </p>
          </header>
          <div className="detail-three-grid">
            {commercialProcess.map((step, i) => (
              <article
                key={step.title}
                className={`detail-tier detail-tier--${i}`}
              >
                <header>
                  <span aria-hidden="true">0{i + 1}</span>
                  <h3>{step.title}</h3>
                </header>
                <div>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="service-actions">
            <ServiceAction to={estimateTo}>
              Schedule a Project Consultation
            </ServiceAction>
          </div>
        </div>
      </section>

      {detail?.faqs && (
        <section className="service-faq service-muted">
          <div className="service-container">
            <h2>Frequently Asked Questions</h2>
            <VariantDisclosures items={detail.faqs} />
          </div>
        </section>
      )}

      <ServiceEstimate estimateTo={estimateTo} />
    </div>
  );
}

interface BodyProps {
  location: Location;
  service: Service;
  hubKey: ServiceHubKey;
  content: NonNullable<ReturnType<typeof findLocationServiceContent>>;
}

function LocationServiceBody({
  location,
  service,
  hubKey,
  content,
}: BodyProps) {
  const page = servicePages[hubKey];
  const canonicalPath = `/${location.slug}/${service.slug}/`;

  useEffect(() => {
    applyRouteMeta({
      title: content.title,
      description: content.intro,
      canonicalPath,
    });
  }, [content.title, content.intro, canonicalPath]);

  const estimateTo =
    content.finalCtaTo ??
    (hasLocationCapability(location.slug, "hasFreeEstimate")
      ? `/${location.slug}/free-estimate/`
      : `/${location.slug}/#estimate`);

  return (
    <div className={`service-page service-page--${hubKey}`}>
      <section className="service-intro" aria-labelledby="loc-service-title">
        <div className="service-panorama">
          <ServiceImage photo={page.hero} hero />
        </div>
        <div className="service-container service-intro-panel">
          <div className="service-intro-copy">
            <nav aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true"> › </span>
              <Link to={`/${location.slug}/`}>
                {location.city}, {location.state}
              </Link>
              <span aria-hidden="true"> › </span>
              <span>{service.title}</span>
            </nav>
            {content.eyebrow && (
              <p className="service-eyebrow">{content.eyebrow}</p>
            )}
            <h1 id="loc-service-title">{content.title}</h1>
            <p>{content.intro}</p>
            <ServiceAction to={estimateTo}>Get a Free Estimate</ServiceAction>
          </div>
          <aside
            className="service-specials"
            aria-labelledby="loc-service-specials"
          >
            <ServiceImage photo={page.features[0].photo} />
            <h2 id="loc-service-specials">{location.city} Specials</h2>
            <p>
              Reference promotions for {location.city} homeowners. This demo
              does not sell or redeem offers.
            </p>
            <ul className="service-location-links">
              {hasLocationCapability(location.slug, "hasFreeEstimate") && (
                <li>
                  <Link to={`/${location.slug}/free-estimate/`}>
                    {location.city} free estimate
                  </Link>
                </li>
              )}
              {hasLocationCapability(location.slug, "hasFinancing") && (
                <li>
                  <Link to={`/${location.slug}/financing/`}>
                    {location.city} financing
                  </Link>
                </li>
              )}
              {hasLocationCapability(location.slug, "hasServiceAreaIndex") && (
                <li>
                  <Link to={`/${location.slug}/service-area/`}>
                    {location.city} service area
                  </Link>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {page.features[0] && (
        <ServiceFeatureSection feature={page.features[0]} />
      )}
      <ServiceTrust />
      {page.products && (
        <ServiceProducts
          products={page.products}
          masonry={hubKey === "masonry"}
        />
      )}
      {page.features[1] && (
        <ServiceFeatureSection
          feature={page.features[1]}
          imageFirst
          muted
        />
      )}
      {page.features[2] && (
        <ServiceFeatureSection feature={page.features[2]} />
      )}

      {content.faqs && content.faqs.length > 0 && (
        <ServiceFaq items={content.faqs} windows={hubKey === "windows"} />
      )}

      <ServiceRelated service={hubKey} />
      <ServiceEstimate
        estimateTo={estimateTo}
        windows={hubKey === "windows"}
      />
    </div>
  );
}
