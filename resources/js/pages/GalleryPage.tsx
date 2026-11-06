import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";
import {
  galleryCategories,
  getCategoryProjectCount,
  getProjectsByCategory,
  type GalleryCategoryKey,
  type GalleryProject,
} from "@/data/galleryProjects";
import { ProjectCard } from "@/components/gallery/ProjectCard";
import { ProjectLightboxModal } from "@/components/gallery/ProjectLightboxModal";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategoryKey>("all");
  const [activeProject, setActiveProject] = useState<GalleryProject | null>(
    null
  );
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    applyRouteMeta({
      title: "Our Work & Project Gallery",
      description:
        "Explore project photos and exterior renovation craftsmanship across roofing, siding, windows, gutters, and masonry.",
      canonicalPath: "/gallery/",
    });
  }, []);

  const visibleProjects = getProjectsByCategory(selectedCategory);
  const activeCategoryObj = galleryCategories.find(
    (c) => c.key === selectedCategory
  );

  const handleSelectProject = (
    project: GalleryProject,
    triggerEl: HTMLElement
  ) => {
    triggerRef.current = triggerEl;
    setActiveProject(project);
  };

  return (
    <>
      {/* Compact Hero Section */}
      <section
        aria-labelledby="gallery-hero-title"
        className="bg-gradient-to-b from-[#F4F6F8] to-white border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-6 sm:py-8 lg:py-9">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-2 sm:mb-2.5">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden="true"> › </span>
            <span>Project Gallery</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Exterior Craftsmanship &amp; Portfolio
              </p>
              <h1
                id="gallery-hero-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--color-brand-primary)] leading-snug"
              >
                Our Work &amp; Project Gallery.
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Explore our residential and commercial exterior projects. From
                complete architectural roof replacements to seamless gutters,
                custom siding, replacement windows, and masonry restoration,
                discover the craftsmanship behind our work.
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <Link
                to="/free-estimate"
                className="inline-flex items-center justify-center h-11 px-5 rounded-sm bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-600)] text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
              >
                Request an Estimate
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Gallery Area */}
      <section
        aria-labelledby="gallery-portfolio-heading"
        className="pt-5 sm:pt-6 pb-12 sm:pb-16 bg-white"
      >
        <Container width="wide">
          <h2 id="gallery-portfolio-heading" className="sr-only">
            Project Categories and Portfolio Grid
          </h2>

          {/* Accessible Category Filters Toolbar */}
          <div className="mb-5 sm:mb-6">
            <div
              role="toolbar"
              aria-label="Filter projects by service category"
              className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin"
            >
              {galleryCategories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const count = getCategoryProjectCount(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
                      isSelected
                        ? "bg-[var(--color-brand-primary)] text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-4.5 h-4.5 px-1.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Accessible Live Region for Screen Readers */}
            <p className="sr-only" role="status" aria-live="polite">
              Showing {visibleProjects.length}{" "}
              {visibleProjects.length === 1 ? "project" : "projects"} for{" "}
              {activeCategoryObj?.label ?? "category"}
            </p>
          </div>

          {/* Empty State */}
          {visibleProjects.length === 0 ? (
            <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 p-12 text-center my-8">
              <p className="text-base font-bold text-slate-700 mb-2">
                No projects found in this category.
              </p>
              <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
                We are actively photographing and updating new completed
                projects for this service.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-600)] rounded-sm"
              >
                View All Projects
              </button>
            </div>
          ) : (
            /* Responsive Project Gallery Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelectProject={handleSelectProject}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Project Details Lightbox Modal */}
      <ProjectLightboxModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        triggerRef={triggerRef}
      />

      {/* Bottom Conversion Section */}
      <section
        aria-labelledby="gallery-cta-title"
        className="bg-[#0C1F33] text-white border-t border-slate-800"
      >
        <Container
          width="wide"
          className="py-12 sm:py-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-accent)] mb-2">
              Ready to Discuss Your Project?
            </p>
            <h2
              id="gallery-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Get a Free, No-Obligation Written Estimate.
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              Every home and building has unique requirements. Reach out today
              to discuss materials, scheduling, and transparent pricing with our
              exterior specialists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full sm:w-auto">
            <a
              href={brand.phoneHref}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide transition-colors border border-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">📞</span>
              <span>Call {brand.phoneDisplay}</span>
            </a>
            <Link
              to="/free-estimate"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-600)] text-white font-extrabold uppercase tracking-wider text-sm shadow-md transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              Get a FREE Estimate
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
