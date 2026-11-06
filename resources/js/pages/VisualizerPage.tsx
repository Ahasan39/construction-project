import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";

export default function VisualizerPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Design Visualizer",
      description:
        "Design visualizer entry point. The visualization tool is not integrated in this frontend reproduction.",
      canonicalPath: "/visualizer/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="visualizer-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Visualizer</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Exterior design preview
          </p>
          <h1
            id="visualizer-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Design visualizer.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            A design visualizer lets a homeowner preview roofing, siding,
            window, trim and masonry choices on a photo of their house. We
            review design options with you during the estimate using physical
            samples and reference imagery — a visualization is a useful
            starting point, not a replacement for seeing the real materials.
          </p>
        </Container>
      </section>

      <section
        aria-labelledby="visualizer-status-title"
        className="bg-white"
      >
        <Container width="content" className="py-12 sm:py-16">
          <h2
            id="visualizer-status-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Design review during your estimate
          </h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            Rather than host a visualizer on this page, we walk through
            product and color options with you in person. Bring reference
            photos of homes you like, and we will match materials and
            finishes against the exterior of your house.
          </p>

          <h3 className="mt-10 text-base font-bold text-[var(--color-brand-primary)]">
            How a visualizer fits into a project conversation
          </h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            A visual preview is a starting point. Final material and color
            selections usually involve physical samples and the installer's
            own notes about how a product looks in sunlight, under shade and
            next to the surrounding exterior materials. A digital preview is
            useful alongside those conversations, not a replacement for them.
          </p>

          <h3 className="mt-8 text-base font-bold text-[var(--color-brand-primary)]">
            Prefer to start with an estimate?
          </h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            A free written estimate is the fastest way to begin a project
            conversation. Design choices can be reviewed during the walkthrough.
          </p>
          <Link
            to="/free-estimate"
            className="mt-5 inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
          >
            Get a FREE Estimate
          </Link>
        </Container>
      </section>
    </>
  );
}
