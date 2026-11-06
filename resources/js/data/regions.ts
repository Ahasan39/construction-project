import type { ServiceAreaRegionKey } from "@/types";

/**
 * Service-area regions presented in the lead-form location dropdown. Mirrors
 * the reference's eight observed options from `/free-estimate/`. Lexington is
 * absent on the reference and remains flagged in `REFERENCE_AUDIT.md` — we
 * include it here as an explicit choice rather than silently drop it.
 */
export const serviceAreaRegions: ReadonlyArray<{
  key: ServiceAreaRegionKey;
  label: string;
  /** True when confirmed on the reference's own form dropdown. */
  observedOnReference: boolean;
}> = [
  { key: "south-east-michigan", label: "South East Michigan", observedOnReference: true },
  { key: "grand-rapids-area", label: "Grand Rapids Area", observedOnReference: true },
  { key: "lansing-area", label: "Lansing Area", observedOnReference: true },
  { key: "cleveland-area", label: "Cleveland Area", observedOnReference: true },
  { key: "cincinnati-area", label: "Cincinnati Area", observedOnReference: true },
  { key: "dayton-area", label: "Dayton Area", observedOnReference: true },
  { key: "louisville-area", label: "Louisville Area", observedOnReference: true },
  { key: "lexington-area", label: "Lexington Area", observedOnReference: false },
  { key: "nashville-area", label: "Nashville Area", observedOnReference: true },
];
