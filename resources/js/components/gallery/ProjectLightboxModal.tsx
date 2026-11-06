import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "@/app/assets";
import type { GalleryProject, GalleryProjectImage } from "@/data/galleryProjects";

export interface ProjectLightboxModalProps {
  project: GalleryProject | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), select:not([disabled])';

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

export function ProjectLightboxModal({
  project,
  onClose,
  triggerRef,
}: ProjectLightboxModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset photo index whenever a new project is opened
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [project?.id]);

  const allPhotos: GalleryProjectImage[] = project
    ? [project.primaryImage, ...(project.additionalImages ?? [])]
    : [];

  const activePhoto = allPhotos[activePhotoIndex] ?? project?.primaryImage;

  // Handle focus lock, Escape key, backdrop dismiss, and body scroll lock
  useEffect(() => {
    if (!project) return;

    const returnTarget = triggerRef?.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Set initial focus to close button
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      // Left / Right arrow navigation for multiple photos
      if (allPhotos.length > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setActivePhotoIndex((prev) =>
            prev === 0 ? allPhotos.length - 1 : prev - 1
          );
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setActivePhotoIndex((prev) =>
            prev === allPhotos.length - 1 ? 0 : prev + 1
          );
          return;
        }
      }

      // Tab trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      returnTarget?.focus();
    };
  }, [project, onClose, triggerRef, allPhotos.length]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        // Dismiss if clicking outer backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      aria-hidden={!project}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-project-title"
        aria-describedby="lightbox-project-desc"
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Header bar */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--color-brand-primary)] rounded-xs">
                {project.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {project.propertyType}
              </span>
            </div>
            <h2
              id="lightbox-project-title"
              className="text-lg sm:text-xl md:text-2xl font-black text-[var(--color-brand-primary)] tracking-tight leading-snug"
            >
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project viewer"
            className="p-2 -mr-1 text-slate-500 hover:text-slate-900 rounded-sm hover:bg-slate-200/80 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors shrink-0"
          >
            <span aria-hidden="true" className="text-2xl leading-none font-bold">
              ×
            </span>
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Photo Viewer */}
          {activePhoto && (
            <div className="relative rounded-sm overflow-hidden bg-slate-900 shadow-inner">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
                <img
                  src={assetUrl(activePhoto.src)}
                  srcSet={formatSrcSet(activePhoto.srcSet)}
                  sizes="(max-width: 896px) 100vw, 896px"
                  alt={activePhoto.alt}
                  width={activePhoto.width}
                  height={activePhoto.height}
                  className="w-full h-full object-cover"
                />

                {/* Multiple photo controls */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous photo"
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === 0 ? allPhotos.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-lg focus-visible:outline-2 focus-visible:outline-white transition-colors"
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <button
                      type="button"
                      aria-label="Next photo"
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === allPhotos.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center text-lg focus-visible:outline-2 focus-visible:outline-white transition-colors"
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-semibold text-white bg-black/70 rounded-xs">
                      Photo {activePhotoIndex + 1} of {allPhotos.length}
                    </div>
                  </>
                )}
              </div>

              {activePhoto.caption && (
                <div className="p-3 bg-slate-900/90 text-slate-200 text-xs sm:text-sm">
                  {activePhoto.caption}
                </div>
              )}
            </div>
          )}

          {/* Thumbnail selector strip if more than 1 image */}
          {allPhotos.length > 1 && (
            <div
              role="tablist"
              aria-label="Project photo gallery"
              className="flex items-center gap-2.5 overflow-x-auto pb-1"
            >
              {allPhotos.map((photo, idx) => {
                const isSelected = idx === activePhotoIndex;
                return (
                  <button
                    key={photo.src}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`View photo ${idx + 1}`}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-xs overflow-hidden shrink-0 border-2 transition-all focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
                      isSelected
                        ? "border-[var(--color-brand-accent)] ring-2 ring-[var(--color-brand-accent)]/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={assetUrl(photo.src)}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Project Details Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Project Overview
            </h3>
            <p
              id="lightbox-project-desc"
              className="text-slate-700 text-sm sm:text-base leading-relaxed"
            >
              {project.description}
            </p>
          </div>

          {/* Specifications & Scope Grid */}
          <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)] mb-3">
                Scope &amp; Workmanship
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {project.scopeHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="text-green-600 font-bold shrink-0"
                    >
                      ✓
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.materials && project.materials.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)] mb-3">
                  Installed Materials
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {project.materials.map((material) => (
                    <li key={material} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="text-[var(--color-brand-accent)] font-bold shrink-0"
                      >
                        ▪
                      </span>
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Honest Demo Notice */}
          {project.demoNotice && (
            <div className="p-3.5 rounded-sm bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <strong className="text-slate-800">Portfolio Note:</strong>{" "}
              {project.demoNotice}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 border-t border-slate-200 bg-slate-50 shrink-0">
          <p className="text-xs text-slate-600">
            Need similar exterior craftsmanship for your property?
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              Close
            </button>
            <Link
              to="/free-estimate"
              onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-white bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-600)] rounded-sm shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              Request an Estimate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
