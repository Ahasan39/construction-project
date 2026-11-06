import { useRef } from "react";
import { assetUrl } from "@/app/assets";
import type { GalleryProject } from "@/data/galleryProjects";

export interface ProjectCardProps {
  project: GalleryProject;
  onSelectProject: (project: GalleryProject, triggerEl: HTMLElement) => void;
}

function formatSrcSet(srcSet?: string): string | undefined {
  if (!srcSet) return undefined;
  return srcSet
    .split(",")
    .map((entry) => {
      const parts = entry.trim().split(" ");
      if (parts.length >= 2) {
        return `${assetUrl(parts[0])} ${parts[1]}`;
      }
      return assetUrl(parts[0]);
    })
    .join(", ");
}

export function ProjectCard({ project, onSelectProject }: ProjectCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    // If the click is already on the button, let the button's own handler fire
    if ((e.target as HTMLElement).closest("button")) return;
    if (buttonRef.current) {
      onSelectProject(project, buttonRef.current);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group rounded-sm border border-slate-200 bg-white overflow-hidden shadow-sm hover-lift flex flex-col cursor-pointer transition-shadow hover:shadow-md"
    >
      {/* Project Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={assetUrl(project.primaryImage.src)}
          srcSet={formatSrcSet(project.primaryImage.srcSet)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          alt={project.primaryImage.alt}
          width={project.primaryImage.width}
          height={project.primaryImage.height}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white bg-[var(--color-brand-primary)]/90 backdrop-blur-xs rounded-xs shadow-xs">
            {project.category}
          </span>
          {project.additionalImages && project.additionalImages.length > 0 && (
            <span className="px-2 py-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-xs rounded-xs">
              +{project.additionalImages.length + 1} photos
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {project.propertyType}
          </p>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-brand-primary)] group-hover:text-[var(--color-brand-accent)] transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Card Action */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {project.scopeHighlights.length} Scope Highlights
          </span>
          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(project, e.currentTarget);
            }}
            aria-label={`View details for ${project.title}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-accent)] group-hover:translate-x-0.5 transition-transform focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-xs"
          >
            <span>View Project</span>
            <span aria-hidden="true">»</span>
          </button>
        </div>
      </div>
    </article>
  );
}
