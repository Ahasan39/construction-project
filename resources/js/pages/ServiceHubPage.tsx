import { useEffect } from "react";
import { applyRouteMeta } from "@/app/seo";
import { AwardsStrip } from "@/components/sections/AwardsStrip";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { ServiceAction, ServiceCallout, ServiceDisclosures, ServiceEstimate, ServiceFaq, ServiceFeatureSection, ServiceIntro, ServiceLocations, ServiceProducts, ServiceRelated, ServiceTrust, SidingStyleCarousel } from "@/components/sections/ServiceSections";
import { roofingBenefits, servicePages, type ServiceHubKey } from "@/data/servicePages";
import type { Service } from "@/types";
import "@/styles/services.css";

export interface ServiceHubPageProps { service: Service }

export default function ServiceHubPage({ service }: ServiceHubPageProps) {
  const key = service.key as ServiceHubKey;
  const page = servicePages[key];
  useEffect(() => { applyRouteMeta({ title: page.title, description: page.intro, canonicalPath: `/${service.slug}/` }); }, [page, service.slug]);

  return <div className={`service-page service-page--${key}`}>
    <ServiceIntro page={page} service={key} />
    {key === "roofing" && <>
      <ServiceTrust /><ServiceProducts products={page.products!} />
      <section className="service-awards service-muted"><div className="service-container"><h2>Award-Winning Roofing Contractors</h2><p>The reference places customer care and craftsmanship at the center of its roofing service. Credential artwork below is existing illustrative material, not certification of this demo.</p></div><AwardsStrip /></section>
      <ServiceFeatureSection feature={page.features[0]} imageFirst><ServiceDisclosures items={roofingBenefits} compact /></ServiceFeatureSection>
      <div className="service-reviews"><ReviewsStrip single /></div>
      <ServiceRelated service={key} /><ServiceEstimate />
    </>}
    {key === "siding" && <>
      <ServiceTrust /><ServiceProducts products={page.products!} />
      {page.features.map((feature, index) => <ServiceFeatureSection key={feature.title} feature={feature} imageFirst={index % 2 === 0} muted={index === 2} media={index === 0 ? <SidingStyleCarousel /> : undefined} />)}
      <ServiceFaq items={page.faqs!} /><ServiceRelated service={key} /><ServiceEstimate />
    </>}
    {key === "windows" && <>
      <ServiceFeatureSection feature={page.features[0]} /><ServiceTrust />
      <ServiceFeatureSection feature={page.features[1]} imageFirst muted><ServiceLocations service={key} /></ServiceFeatureSection>
      <ServiceFeatureSection feature={page.features[2]} />
      <ServiceCallout title="Not sure which window is right for your home?" text="Explore how different window styles could look with your exterior before discussing the final selection."><ServiceAction to="/visualizer/" outline>Try the Window Visualizer</ServiceAction><ServiceAction outline /></ServiceCallout>
      <ServiceRelated service={key} list />
      <ServiceCallout title="Flexible Financing Available" text="The reference advertises financing for qualifying projects. Review current terms and eligibility before making a decision. No credit applications are processed by this demo." muted><ServiceAction to="/financing/" outline>See Financing Options</ServiceAction></ServiceCallout>
      <ServiceCallout title="Schedule a Free No-Obligation Estimate Today" text="Review measurements, product choices and installation details in a written project estimate." />
      <ServiceFaq items={page.faqs!} windows /><ServiceEstimate windows />
    </>}
    {(key === "gutters" || key === "masonry") && <>
      {page.products && <ServiceProducts products={page.products} masonry />}
      <ServiceFeatureSection feature={page.features[0]} /><ServiceTrust />
      {page.features.slice(1).map((feature, index) => <ServiceFeatureSection key={feature.title} feature={feature} imageFirst={key === "masonry" || index === 0} muted={index === 0} />)}
      <ServiceRelated service={key} /><ServiceEstimate />
    </>}
  </div>;
}
