import { findService } from "../data/services";
import { locations, findLocation } from "../data/locations";
import { servicePages, type ServiceHubKey } from "../data/servicePages";
import { findRoofingDetail } from "../data/roofingDetails";
import { findLocationPage, type LocationPageContent } from "../data/locationPages";
import { findLocationServiceContent } from "../data/locationServicePages";
import { findArticle } from "../data/articles";
import type { Location, Service, ServiceVariant, RouteMeta } from "../types";

export const BRAND_PHONE = "+880 1842-299275";
export const BRAND_EMAIL = "amamulahasan77@gmail.com";

export const LOCAL_COMMERCIAL_INTROS: Record<string, string> = {
  nashville:
    "Serving Nashville and Middle Tennessee commercial, multifamily, and HOA properties with low-slope TPO and EPDM membranes, standing-seam metal, and architectural shingle systems. Projects are planned around tenant access, operating hours, and documented specifications.",
  dayton:
    "Commercial and multifamily roofing across Dayton, Montgomery County, and the Miami Valley. Compare low-slope membrane systems, metal roofing, and steep-slope replacements with a written scope and minimal disruption to building occupants.",
  cincinnati:
    "Commercial, apartment, and institutional roofing across Cincinnati and the Tri-State region. From TPO and EPDM flat-roof assemblies to steep-slope and metal installations, each project starts with a thorough roof assessment and written proposal.",
};

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildLocationJsonLd(
  location: Location,
  content?: LocationPageContent
): Record<string, unknown> {
  const areas = [
    {
      "@type": "City",
      name: `${location.city}, ${location.state}`,
    },
    ...location.serviceAreaChildren.slice(0, 10).map((child) => ({
      "@type": "City",
      name: `${child.name}, ${location.state}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RoofingContractor"],
    "@id": `https://ahasan39.github.io/construction-project/${location.slug}/#business`,
    name: `Mr. Roof — ${location.city}`,
    url: `https://ahasan39.github.io/construction-project/${location.slug}/`,
    telephone: BRAND_PHONE,
    email: BRAND_EMAIL,
    priceRange: "$$",
    image:
      "https://ahasan39.github.io/construction-project/images/homepage/hero-suburban-home.webp",
    description:
      content?.hero.description ??
      `Residential exterior contracting services in ${location.city}, ${location.state}.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.city,
      addressRegion: location.state,
      addressCountry: "US",
    },
    areaServed: areas,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };
}

export function buildLocationServiceJsonLd(
  location: Location,
  service: Service,
  variant?: ServiceVariant
): Record<string, unknown> {
  const serviceName = variant
    ? `${location.city} ${variant.title} Contractors`
    : `${location.city} ${service.title} Services`;
  const canonicalPath = variant
    ? `/${location.slug}/${service.slug}/${variant.slug}/`
    : `/${location.slug}/${service.slug}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "RoofingContractor"],
        "@id": `https://ahasan39.github.io/construction-project/${location.slug}/#business`,
        name: `Mr. Roof — ${location.city}`,
        url: `https://ahasan39.github.io/construction-project/${location.slug}/`,
        telephone: BRAND_PHONE,
        email: BRAND_EMAIL,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: location.city,
          addressRegion: location.state,
          addressCountry: "US",
        },
      },
      {
        "@type": "Service",
        "@id": `https://ahasan39.github.io/construction-project${canonicalPath}#service`,
        name: serviceName,
        serviceType: service.title,
        description: variant
          ? `${variant.summary} Serving ${location.city}, ${location.state}.`
          : `${service.tagline} Serving ${location.city}, ${location.state}.`,
        provider: {
          "@id": `https://ahasan39.github.io/construction-project/${location.slug}/#business`,
        },
        areaServed: {
          "@type": "City",
          name: `${location.city}, ${location.state}`,
        },
      },
    ],
  };
}

export function getRouteSeo(route: string): RouteMeta {
  const trimmed = route.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!trimmed) {
    return {
      title: "Roofing, Windows, Siding & Gutters",
      description:
        "Mr. Roof provides roofing, replacement windows, siding, gutters and masonry services with same-day installation and lifetime warranties.",
      canonicalPath: "/",
      ogImage:
        "/construction-project/images/homepage/hero-suburban-home.webp",
    };
  }

  const staticPages: Record<string, RouteMeta> = {
    "free-estimate": {
      title: "Free Estimate",
      description:
        "Request a free, no-obligation estimate for roofing, siding, windows, gutters or masonry. Demo form — submissions are not sent.",
      canonicalPath: "/free-estimate/",
    },
    about: {
      title: "About Us",
      description:
        "Learn about our residential exterior craftsmanship, history since 1962, and commitment to done-in-a-day roofing and exterior installations.",
      canonicalPath: "/about/",
    },
    "special-offers": {
      title: "Special Offers",
      description:
        "Explore exterior remodeling promotions for roofing, siding, windows, and gutters. Current incentives subject to confirmation.",
      canonicalPath: "/special-offers/",
    },
    financing: {
      title: "Financing",
      description:
        "Overview of residential-exterior financing — informational only. This reproduction site does not operate a lender or process applications.",
      canonicalPath: "/financing/",
    },
    warranties: {
      title: "Warranties",
      description:
        "Understand manufacturer warranties, workmanship guarantees, and transferable lifetime coverage on qualifying roofing and exterior systems.",
      canonicalPath: "/warranties/",
    },
    "refer-a-friend": {
      title: "Refer a Friend",
      description:
        "Refer a friend or neighbor for roofing and exterior work. Terms, eligibility, and program details.",
      canonicalPath: "/refer-a-friend/",
    },
    "contact-us": {
      title: "Contact Us",
      description:
        "Get in touch with our team for questions, project consultations, and free estimates across all service regions.",
      canonicalPath: "/contact-us/",
    },
    reviews: {
      title: "Customer Reviews",
      description:
        "Read verified customer reviews and experiences for roof replacement, repairs, siding, windows, and masonry installations.",
      canonicalPath: "/reviews/",
    },
    "commercial-projects": {
      title: "Commercial Projects",
      description:
        "Commercial, multi-family, and institutional roofing and exterior restoration projects. Built for durability with minimal downtime.",
      canonicalPath: "/commercial-projects/",
    },
    "careers/sales": {
      title: "Careers — Sales & Project Consulting",
      description:
        "Join our exterior contracting team. Opportunities in residential sales, project estimating, and field consultation.",
      canonicalPath: "/careers/sales/",
    },
    "privacy-policy": {
      title: "Privacy Policy",
      description:
        "Privacy policy for the demonstration website. Details on data handling, cookies, and demo submissions.",
      canonicalPath: "/privacy-policy/",
    },
    "terms-and-conditions": {
      title: "Terms & Conditions",
      description:
        "Terms and conditions governing the use of this exterior construction demonstration website.",
      canonicalPath: "/terms-and-conditions/",
    },
    billpay: {
      title: "Pay My Bill",
      description:
        "Pay-my-bill entry point. This frontend reproduction does not process payments; the real payment portal URL is not configured.",
      canonicalPath: "/billpay/",
    },
    visualizer: {
      title: "Design Visualizer",
      description:
        "Design visualizer entry point. The visualization tool is not integrated in this frontend reproduction.",
      canonicalPath: "/visualizer/",
    },
    crew: {
      title: "Crew Portal",
      description: "External crew and field operations portal entry point.",
      canonicalPath: "/crew/",
      noindex: true,
    },
    blog: {
      title: "News & Resources",
      description:
        "Articles, guides, and homeowner resources on roofing, siding, windows, gutters, and masonry maintenance.",
      canonicalPath: "/blog/",
    },
    gallery: {
      title: "Project Gallery",
      description:
        "Explore completed residential roofing, siding, windows, gutters, and masonry projects across our service areas.",
      canonicalPath: "/gallery/",
    },
  };

  if (staticPages[trimmed]) {
    return staticPages[trimmed];
  }

  if (trimmed.startsWith("blog/")) {
    const slug = trimmed.slice("blog/".length);
    const article = findArticle(slug);
    return {
      title: article ? `${article.title} — Mr. Roof Blog` : "Blog Article",
      description: article?.excerpt ?? "",
      canonicalPath: `/blog/${slug}/`,
      ogType: "article",
      ogImage: article?.thumbnailSrc
        ? `/construction-project${article.thumbnailSrc}`
        : undefined,
    };
  }

  const segments = trimmed.split("/");

  // Global service variants: /roofing/:variant
  if (segments.length === 2 && segments[0] === "roofing") {
    const detail = findRoofingDetail(segments[1]);
    if (detail) {
      return {
        title: detail.title,
        description: detail.intro,
        canonicalPath: `/roofing/${segments[1]}/`,
        ogImage: detail.hero
          ? `/construction-project/images/roofing-details/${detail.hero.name}-${detail.hero.width}.webp`
          : undefined,
      };
    }
  }

  // Global services: /roofing, /gutters, etc.
  if (segments.length === 1) {
    const service = findService(segments[0]);
    if (service) {
      const page = servicePages[service.key as ServiceHubKey];
      return {
        title: page?.title ?? service.title,
        description: page?.intro ?? service.tagline,
        canonicalPath: `/${service.slug}/`,
        ogImage: page?.hero
          ? `/construction-project/images/services/photos/${page.hero.file}-900.webp`
          : undefined,
      };
    }
  }

  // Locations: /:location, /:location/:sub, /:location/:service/:variant
  const location = findLocation(segments[0]);
  if (location) {
    if (segments.length === 1) {
      const content = findLocationPage(location.slug);
      return {
        title: `${location.city}, ${location.state} roofing & home exterior`,
        description:
          content?.hero.description ??
          `Residential exterior contracting services in ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/`,
        jsonLd: buildLocationJsonLd(location, content),
        ogImage:
          "/construction-project/images/homepage/hero-suburban-home.webp",
      };
    }

    if (segments[1] === "free-estimate") {
      return {
        title: `Free estimate — ${location.city}, ${location.state}`,
        description: `Request a free, no-obligation estimate for ${location.city}, ${location.state}. Demo form — submissions are not sent.`,
        canonicalPath: `/${location.slug}/free-estimate/`,
      };
    }

    if (segments[1] === "financing") {
      return {
        title: `Financing — ${location.city}, ${location.state}`,
        description: `Overview of residential exterior project financing for ${location.city}, ${location.state} homeowners — informational only. This reproduction site does not operate a lender or process credit applications.`,
        canonicalPath: `/${location.slug}/financing/`,
      };
    }

    if (segments[1] === "service-area") {
      if (segments.length === 2) {
        return {
          title: `Service area — ${location.city}, ${location.state}`,
          description: `Communities served by Mr. Roof in the ${location.city}, ${location.state} market.`,
          canonicalPath: `/${location.slug}/service-area/`,
        };
      }
      const child = location.serviceAreaChildren.find(
        (c) => c.slug === segments[2]
      );
      return {
        title: `${child?.name ?? segments[2]} — ${location.city} service area`,
        description: `Residential exterior services serving ${child?.name ?? segments[2]} near ${location.city}, ${location.state}. Demonstration page — contact routes are demo only.`,
        canonicalPath: `/${location.slug}/service-area/${segments[2]}/`,
      };
    }

    const service = findService(segments[1]);
    if (service) {
      if (segments.length === 3) {
        const variant = service.variants.find((v) => v.slug === segments[2]);
        const heading = `${location.city} ${variant?.title ?? segments[2]} Contractors`;
        const intro =
          LOCAL_COMMERCIAL_INTROS[location.slug] ??
          `${variant?.summary ?? ""} Serving ${location.city}, ${location.state} with written project scopes, coordinated site access, and commercial roofing systems.`;
        return {
          title: heading,
          description: intro,
          canonicalPath: `/${location.slug}/${service.slug}/${segments[2]}/`,
          jsonLd: buildLocationServiceJsonLd(location, service, variant),
        };
      }

      const content = findLocationServiceContent(
        location.slug,
        service.key as ServiceHubKey
      );
      return {
        title: content?.title ?? `${location.city} ${service.title}`,
        description:
          content?.intro ??
          `${service.tagline} Serving ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/${service.slug}/`,
        jsonLd: buildLocationServiceJsonLd(location, service),
      };
    }
  }

  return {
    title: "Mr. Roof Construction",
    description:
      "Quality roofing, siding, windows, gutters and masonry services with same-day installation and lifetime warranties.",
    canonicalPath: `/${trimmed}/`,
  };
}

export function generateSitemapXml(
  routes: string[],
  siteBase: string = "https://ahasan39.github.io/construction-project"
): string {
  const normalizedBase = siteBase.replace(/\/+$/, "");
  const entries = routes
    .filter((r) => !r.startsWith("/admin") && r !== "/__preview")
    .map((route) => {
      const loc =
        route === "/" ? `${normalizedBase}/` : `${normalizedBase}${route}/`;
      let priority = "0.6";
      let changefreq = "monthly";
      if (route === "/") {
        priority = "1.0";
        changefreq = "weekly";
      } else if (
        [
          "/roofing",
          "/siding",
          "/windows",
          "/gutters",
          "/masonry",
          "/free-estimate",
          "/gallery",
        ].includes(route) ||
        locations.some((l) => `/${l.slug}` === route)
      ) {
        priority = "0.8";
        changefreq = "weekly";
      } else if (
        [
          "/privacy-policy",
          "/terms-and-conditions",
          "/billpay",
          "/crew",
        ].includes(route)
      ) {
        priority = "0.3";
        changefreq = "yearly";
      } else if (route.startsWith("/blog/")) {
        priority = "0.7";
        changefreq = "monthly";
      }
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}
