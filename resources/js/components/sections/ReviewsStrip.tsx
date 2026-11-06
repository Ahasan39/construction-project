import { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "@/components/ui";
import { reviews } from "@/data/reviews";
import type { Review } from "@/types";

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div
      role="img"
      className="flex items-center gap-1.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${
            i < rating
              ? "fill-[#59BBD7] text-[#59BBD7]"
              : "fill-slate-200 text-slate-200"
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  return (
    <div className="flex flex-col justify-between rounded-sm border border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md transition-shadow min-h-[340px] h-full">
      <div>
        <Stars rating={r.rating} />
        <blockquote className="mt-5 text-sm sm:text-[15px] text-slate-700 leading-relaxed font-normal">
          &ldquo;{r.body}&rdquo;
        </blockquote>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="min-w-0">
          <p className="text-base font-bold text-[var(--color-brand-primary)]">
            {r.author}
          </p>
          <p className="text-xs text-slate-600 font-medium">
            {r.cityState ?? "Customer"}
          </p>
        </div>

        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded border border-slate-300">
          Reference
        </span>
      </div>
    </div>
  );
}

/**
 * Reviews carousel.
 *
 * Two coexisting modes:
 *  - **marquee** (default under no-preference) — continuous horizontal
 *    scroll via a CSS keyframe animation on a track that renders the
 *    reviews twice; the second copy is `aria-hidden` so screen readers see
 *    one canonical list. Translating by -50% snaps the loop to the start of
 *    the second copy, so there is no visible jump. Pauses automatically on
 *    pointer hover and keyboard focus-within via the `.marquee-root` CSS
 *    selector, and pauses when a user explicitly toggles the Play/Pause
 *    control (which drops to stepped mode so Prev/Next are usable).
 *  - **stepped** — the original index-based transform. Entered the first
 *    time a user clicks Prev/Next/a dot, presses Arrow keys, or swipes;
 *    also entered on `prefers-reduced-motion: reduce` so reduced-motion
 *    viewers see no auto-motion. All manual controls operate against this
 *    mode.
 */
export function ReviewsStrip({ single = false }: { single?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  // Single-slide usages (e.g. inside service hub pages) start in stepped
  // mode — the marquee is for the homepage reviews band where it makes sense.
  const [mode, setMode] = useState<"marquee" | "stepped">(
    single ? "stepped" : "marquee"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(() => {
    if (single) return 1;
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 1024) return 2;
    }
    return 3;
  });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const total = reviews.length;

  // Responsive card count for stepped mode.
  useEffect(() => {
    function updateVisibleCount() {
      const width = window.innerWidth;
      if (single || width < 640) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [single]);

  const maxIndex = Math.max(0, total - visibleCount);

  // Keep index in bounds across resize.
  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  // Reduced-motion → force stepped mode and listen for live changes.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setMode("stepped");
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const isMarquee = mode === "marquee" && !reducedMotion;

  const stepTo = useCallback(
    (idx: number) => {
      setMode("stepped");
      setCurrentIndex(Math.max(0, Math.min(idx, maxIndex)));
    },
    [maxIndex]
  );
  const goNext = useCallback(() => {
    if (mode === "marquee") {
      // First manual step out of marquee lands on index 1 (first forward slide).
      stepTo(1);
    } else {
      stepTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }
  }, [mode, currentIndex, maxIndex, stepTo]);
  const goPrev = useCallback(() => {
    if (mode === "marquee") {
      stepTo(0);
    } else {
      stepTo(currentIndex <= 0 ? maxIndex : currentIndex - 1);
    }
  }, [mode, currentIndex, maxIndex, stepTo]);

  const togglePlayPause = () => {
    if (reducedMotion) return;
    setMode((prev) => (prev === "marquee" ? "stepped" : "marquee"));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const min = 40;
    if (distance > min) goNext();
    else if (distance < -min) goPrev();
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Customer Reviews"
      className="bg-[#F4F6F8] border-b border-[var(--color-border)] py-14 sm:py-18 lg:py-24"
    >
      <Container width="wide">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <h2
            id="reviews-heading"
            className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[var(--color-brand-primary)] tracking-tight leading-snug max-w-3xl"
          >
            Reference testimonials — displayed for this frontend demo.
          </h2>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={togglePlayPause}
              aria-disabled={reducedMotion}
              aria-label={
                isMarquee ? "Pause reviews autoplay" : "Start reviews autoplay"
              }
              className="p-2.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
              title={
                reducedMotion
                  ? "Autoplay disabled by reduced motion preference"
                  : isMarquee
                    ? "Pause"
                    : "Play"
              }
            >
              {isMarquee ? (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={goPrev}
              disabled={isMarquee ? true : currentIndex === 0}
              aria-label="Previous reviews"
              className="p-2.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={isMarquee ? false : currentIndex >= maxIndex}
              aria-label="Next reviews"
              className="p-2.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel window */}
        <div
          ref={carouselRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-live={isMarquee ? "off" : "polite"}
          className={`overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm ${
            isMarquee ? "marquee-root" : ""
          }`}
        >
          {isMarquee ? (
            // Marquee track — reviews rendered twice; second copy aria-hidden.
            // Width `w-max` so each copy's cards sit at their intrinsic width;
            // translating by -50% snaps to the start of the second copy.
            <div
              className="flex w-max marquee-track"
              style={{ ["--marquee-duration" as never]: "60s" }}
            >
              {[...reviews, ...reviews].map((r, idx) => {
                const isClone = idx >= total;
                return (
                  <div
                    key={isClone ? `clone-${r.id}` : r.id}
                    aria-hidden={isClone || undefined}
                    role={isClone ? undefined : "group"}
                    aria-roledescription={isClone ? undefined : "slide"}
                    aria-label={isClone ? undefined : `${(idx % total) + 1} of ${total}`}
                    style={{ width: `${100 / visibleCount}vw` }}
                    className="min-w-0 shrink-0 p-2 sm:p-3 [overflow-wrap:anywhere] max-w-[22rem]"
                  >
                    <ReviewCard review={r} />
                  </div>
                );
              })}
            </div>
          ) : (
            // Stepped track — original index-based transform.
            <div
              className="flex"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                transition: "transform var(--duration-emphasized) var(--ease-standard)",
                willChange: "transform",
              }}
            >
              {reviews.map((r, idx) => {
                const isVisible =
                  idx >= currentIndex && idx < currentIndex + visibleCount;
                return (
                  <div
                    key={r.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${total}`}
                    aria-hidden={!isVisible}
                    inert={!isVisible}
                    style={{ width: `${100 / visibleCount}%` }}
                    className="min-w-0 shrink-0 p-2 sm:p-3 [overflow-wrap:anywhere]"
                  >
                    <ReviewCard review={r} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dots pagination (always visible; a click enters stepped mode) */}
        <div
          className="flex flex-wrap justify-center items-center gap-1 mt-6"
          role="tablist"
          aria-label="Review pages"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={!isMarquee && currentIndex === idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => stepTo(idx)}
              className="shrink-0 p-2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-full"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 block ${
                  !isMarquee && currentIndex === idx
                    ? "w-8 bg-[var(--color-brand-accent)]"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Testimonials reproduced from the reference website for layout
          demonstration. Not verified reviews of this demo or its operator.
        </p>
      </Container>
    </section>
  );
}
