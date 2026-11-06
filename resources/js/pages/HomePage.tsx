import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { ProtectBand } from "@/components/sections/ProtectBand";
import { WhyUs } from "@/components/sections/WhyUs";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { PromotionsRow } from "@/components/sections/PromotionsRow";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { AwardsStrip } from "@/components/sections/AwardsStrip";
import { applyRouteMeta } from "@/app/seo";

export default function HomePage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Residential exterior contractor",
      description:
        "Roofing, siding, windows, gutters and masonry — reproduction landing for frontend verification.",
      canonicalPath: "/",
    });
  }, []);

  return (
    <>
      <Hero />
      <ProtectBand />
      <WhyUs />
      <ServiceCards />
      <PromotionsRow />
      <ReviewsStrip />
      <AwardsStrip />
    </>
  );
}
