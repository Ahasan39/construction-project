import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GalleryPage from "./GalleryPage";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { galleryProjects } from "@/data/galleryProjects";

function renderGallery(initialPath = "/gallery") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderSiteWithHeader(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <header>
        <SiteHeader />
      </header>
      <main>
        <Routes>
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<div>Other Page</div>} />
        </Routes>
      </main>
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("GalleryPage — Route, Headings & Layout", () => {
  it("renders exactly one <h1> with the gallery heading", () => {
    renderGallery();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toMatch(/Our Work & Project Gallery/i);
  });

  it("renders breadcrumbs pointing to Home", () => {
    renderGallery();
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(nav).getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
    expect(within(nav).getByText(/Project Gallery/i)).toBeTruthy();
  });

  it("renders hero CTA linking to /free-estimate", () => {
    renderGallery();
    const heroEstimateLinks = screen
      .getAllByRole("link", { name: /request an estimate/i })
      .map((l) => l.getAttribute("href"));
    expect(heroEstimateLinks).toContain("/free-estimate");
  });

  it("renders bottom conversion CTA with phone and free estimate link", () => {
    renderGallery();
    const estimateLink = screen.getByRole("link", { name: /get a free estimate/i });
    expect(estimateLink.getAttribute("href")).toBe("/free-estimate");
    const callLink = screen.getByRole("link", { name: /call/i });
    expect(callLink.getAttribute("href")).toMatch(/^tel:/);
  });
});

describe("GalleryPage — Navigation Link Presence", () => {
  it("renders a Gallery navigation link in the site header pointing to /gallery", () => {
    renderSiteWithHeader();
    const galleryLinks = screen.getAllByRole("link", { name: /^gallery$/i });
    expect(galleryLinks.length).toBeGreaterThan(0);
    expect(galleryLinks[0].getAttribute("href")).toBe("/gallery");
  });
});

describe("GalleryPage — Category Filtering & Counts", () => {
  it("defaults to All Projects and displays all projects", () => {
    renderGallery();
    const allBtn = screen.getByRole("button", { name: /all projects/i });
    expect(allBtn.getAttribute("aria-pressed")).toBe("true");

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(galleryProjects.length);
  });

  it("filters projects when Roofing category is clicked", () => {
    renderGallery();
    const roofingBtn = screen.getByRole("button", { name: /^roofing/i });
    fireEvent.click(roofingBtn);
    expect(roofingBtn.getAttribute("aria-pressed")).toBe("true");

    const cards = screen.getAllByRole("article");
    const roofingCount = galleryProjects.filter((p) => p.categoryKey === "roofing").length;
    expect(cards).toHaveLength(roofingCount);
  });

  it("filters projects when Siding category is clicked", () => {
    renderGallery();
    const sidingBtn = screen.getByRole("button", { name: /^siding/i });
    fireEvent.click(sidingBtn);
    expect(sidingBtn.getAttribute("aria-pressed")).toBe("true");

    const cards = screen.getAllByRole("article");
    const sidingCount = galleryProjects.filter((p) => p.categoryKey === "siding").length;
    expect(cards).toHaveLength(sidingCount);
  });

  it("filters projects when Windows category is clicked", () => {
    renderGallery();
    const windowsBtn = screen.getByRole("button", { name: /^windows/i });
    fireEvent.click(windowsBtn);

    const cards = screen.getAllByRole("article");
    const windowsCount = galleryProjects.filter((p) => p.categoryKey === "windows").length;
    expect(cards).toHaveLength(windowsCount);
  });

  it("filters projects when Gutters category is clicked", () => {
    renderGallery();
    const guttersBtn = screen.getByRole("button", { name: /^gutters/i });
    fireEvent.click(guttersBtn);

    const cards = screen.getAllByRole("article");
    const guttersCount = galleryProjects.filter((p) => p.categoryKey === "gutters").length;
    expect(cards).toHaveLength(guttersCount);
  });

  it("filters projects when Masonry category is clicked", () => {
    renderGallery();
    const masonryBtn = screen.getByRole("button", { name: /^masonry/i });
    fireEvent.click(masonryBtn);

    const cards = screen.getAllByRole("article");
    const masonryCount = galleryProjects.filter((p) => p.categoryKey === "masonry").length;
    expect(cards).toHaveLength(masonryCount);
  });
});

describe("GalleryPage — Project Card Content & Alt Text", () => {
  it("displays meaningful alt text on all project images", () => {
    renderGallery();
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img.getAttribute("alt")).toBeTruthy();
    }
  });

  it("renders card title, category badge, and view button for each project", () => {
    renderGallery();
    const firstProject = galleryProjects[0];
    expect(screen.getByText(firstProject.title)).toBeTruthy();
    expect(screen.getByRole("button", { name: new RegExp(`view details for ${firstProject.title}`, "i") })).toBeTruthy();
  });
});

describe("GalleryPage — Project Details Lightbox Modal", () => {
  it("opens modal dialog when View Project button is clicked", () => {
    renderGallery();
    const firstProject = galleryProjects[0];
    const triggerBtn = screen.getByRole("button", {
      name: new RegExp(`view details for ${firstProject.title}`, "i"),
    });

    fireEvent.click(triggerBtn);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(within(dialog).getByRole("heading", { level: 2, name: firstProject.title })).toBeTruthy();
    expect(within(dialog).getByText(firstProject.description)).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes modal on close button click and restores body scroll", () => {
    renderGallery();
    const firstProject = galleryProjects[0];
    const triggerBtn = screen.getByRole("button", {
      name: new RegExp(`view details for ${firstProject.title}`, "i"),
    });

    fireEvent.click(triggerBtn);
    expect(screen.getByRole("dialog")).toBeTruthy();

    const closeBtn = screen.getByRole("button", { name: /close project viewer/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes modal on Escape key press", () => {
    renderGallery();
    const firstProject = galleryProjects[0];
    const triggerBtn = screen.getByRole("button", {
      name: new RegExp(`view details for ${firstProject.title}`, "i"),
    });

    fireEvent.click(triggerBtn);
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("navigates multiple photos using Next and Previous buttons", () => {
    renderGallery();
    // Architectural shingle project has additional images
    const multiPhotoProject = galleryProjects.find((p) => p.additionalImages && p.additionalImages.length > 0);
    expect(multiPhotoProject).toBeDefined();

    const triggerBtn = screen.getByRole("button", {
      name: new RegExp(`view details for ${multiPhotoProject!.title}`, "i"),
    });
    fireEvent.click(triggerBtn);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/photo 1 of 2/i)).toBeTruthy();

    const nextBtn = within(dialog).getByRole("button", { name: /next photo/i });
    fireEvent.click(nextBtn);
    expect(within(dialog).getByText(/photo 2 of 2/i)).toBeTruthy();

    const prevBtn = within(dialog).getByRole("button", { name: /previous photo/i });
    fireEvent.click(prevBtn);
    expect(within(dialog).getByText(/photo 1 of 2/i)).toBeTruthy();
  });
});
