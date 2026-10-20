import { describe, expect, it } from "vitest";
import {
  getLocationServiceAvailability,
  hasLocationCapability,
  hasVariantForLocationService,
  isLocationServiceAvailable,
  locationServiceAvailability,
} from "./availability";

describe("location-service availability", () => {
  it("flags Nashville/siding as available", () => {
    expect(isLocationServiceAvailable("nashville", "siding")).toBe(true);
  });

  it("flags Nashville/windows as available", () => {
    expect(isLocationServiceAvailable("nashville", "windows")).toBe(true);
  });

  it("flags Ann Arbor/siding as unavailable (not published on reference)", () => {
    expect(isLocationServiceAvailable("ann-arbor", "siding")).toBe(false);
  });

  it("flags Lexington scoped service hubs as available (Sprint 5.5.7 correction)", () => {
    expect(isLocationServiceAvailable("lexington", "roofing")).toBe(true);
    expect(isLocationServiceAvailable("lexington", "siding")).toBe(true);
    expect(isLocationServiceAvailable("lexington", "insulation")).toBe(false);
  });

  it("flags Detroit/<anything> as unavailable (hub only)", () => {
    expect(isLocationServiceAvailable("detroit", "roofing")).toBe(false);
    expect(isLocationServiceAvailable("detroit", "siding")).toBe(false);
  });

  it("exposes Nashville roofing commercial-roofing variant", () => {
    expect(
      hasVariantForLocationService(
        "nashville",
        "roofing",
        "commercial-roofing"
      )
    ).toBe(true);
  });

  it("does not expose a variant that is not published for a location", () => {
    expect(
      hasVariantForLocationService("nashville", "roofing", "metal-roofing")
    ).toBe(false);
  });

  it("resolves capabilities per location", () => {
    expect(hasLocationCapability("nashville", "hasFreeEstimate")).toBe(true);
    expect(hasLocationCapability("nashville", "hasFinancing")).toBe(true);
    expect(hasLocationCapability("nashville", "hasServiceAreaIndex")).toBe(true);
    expect(hasLocationCapability("lexington", "hasFreeEstimate")).toBe(false);
    expect(hasLocationCapability("ann-arbor", "hasFinancing")).toBe(false);
  });

  it("returns undefined for an unavailable combo", () => {
    expect(
      getLocationServiceAvailability("detroit", "roofing")
    ).toBeUndefined();
  });

  it("has at least one availability entry (dataset is populated)", () => {
    expect(locationServiceAvailability.length).toBeGreaterThan(0);
  });
});
