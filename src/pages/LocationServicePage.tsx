import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { PageShell } from "@/components/layout/PageShell";
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
import { hasLocationCapability } from "@/data/availability";
import type { Location, Service, ServiceVariant } from "@/types";
import "@/styles/services.css";

export interface LocationServicePageProps {
  location: Location;
  service: Service;
  variant?: ServiceVariant;
}

const HUB_KEYS: ServiceHubKey[] = ["roofing", "siding", "windows", "gutters", "masonry"];

function isHubKey(key: string): key is ServiceHubKey {
  return (HUB_KEYS as string[]).includes(key);
}

export default function LocationServicePage({
  location,
  service,
  variant,
}: LocationServicePageProps) {
  if (variant) {
    // Variant pages remain Sprint 1 shells; completing them is out of scope.
    return (
      <PageShell
        meta={{
          title: `${variant.title} — ${service.title} — ${location.city}, ${location.state} — scaffold`,
          description: `${variant.summary} Serving ${location.city}, ${location.state}.`,
          canonicalPath: `/${location.slug}/${service.slug}/${variant.slug}/`,
        }}
        title={`${variant.title} — ${location.city}`}
        intro={variant.summary}
      />
    );
  }

  const hubKey = isHubKey(service.key) ? service.key : null;
  const content = hubKey ? findLocationServiceContent(location.slug, hubKey) : undefined;

  if (!hubKey || !content) {
    // No typed local content yet — keep the scaffold so unfinished combinations
    // read as unfinished rather than silently reusing the global page.
    return (
      <PageShell
        meta={{
          title: `${service.title} — ${location.city}, ${location.state} — scaffold`,
          description: `${service.tagline} Serving ${location.city}, ${location.state}.`,
          canonicalPath: `/${location.slug}/${service.slug}/`,
        }}
        title={`${service.title} — ${location.city}`}
        intro={service.tagline}
      />
    );
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

interface BodyProps {
  location: Location;
  service: Service;
  hubKey: ServiceHubKey;
  content: NonNullable<ReturnType<typeof findLocationServiceContent>>;
}

function LocationServiceBody({ location, service, hubKey, content }: BodyProps) {
  const page = servicePages[hubKey];
  const canonicalPath = `/${location.slug}/${service.slug}/`;

  useEffect(() => {
    applyRouteMeta({
      title: content.title,
      description: content.intro,
      canonicalPath,
    });
  }, [content.title, content.intro, canonicalPath]);

  // Prefer the scoped free-estimate route; otherwise fall back to the
  // completed location-hub hero form via its `#estimate` anchor. This keeps
  // the primary CTA off an unfinished shell without inventing a nonexistent
  // local route.
  const estimateTo = content.finalCtaTo
    ?? (hasLocationCapability(location.slug, "hasFreeEstimate")
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
              <Link to={`/${location.slug}/`}>{location.city}, {location.state}</Link>
              <span aria-hidden="true"> › </span>
              <span>{service.title}</span>
            </nav>
            {content.eyebrow && <p className="service-eyebrow">{content.eyebrow}</p>}
            <h1 id="loc-service-title">{content.title}</h1>
            <p>{content.intro}</p>
            <ServiceAction to={estimateTo}>Get a Free Estimate</ServiceAction>
          </div>
          <aside className="service-specials" aria-labelledby="loc-service-specials">
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

      {page.features[0] && <ServiceFeatureSection feature={page.features[0]} />}
      <ServiceTrust />
      {page.products && <ServiceProducts products={page.products} masonry={hubKey === "masonry"} />}
      {page.features[1] && (
        <ServiceFeatureSection feature={page.features[1]} imageFirst muted />
      )}
      {page.features[2] && <ServiceFeatureSection feature={page.features[2]} />}

      {content.faqs && content.faqs.length > 0 && (
        <ServiceFaq items={content.faqs} windows={hubKey === "windows"} />
      )}

      <ServiceRelated service={hubKey} />
      <ServiceEstimate estimateTo={estimateTo} windows={hubKey === "windows"} />
    </div>
  );
}
