import { useNavigate } from "react-router-dom";
import { useId } from "react";
import { locations } from "@/data/locations";
import { useLocationContext } from "@/features/location-context/useLocationContext";

/**
 * Native-select location picker:
 * - no custom popup state or keyboard handlers,
 * - built-in keyboard support on every platform,
 * - clear mobile UX via the OS wheel/sheet.
 *
 * We do not request geolocation and do not persist a selection. The URL is
 * the source of truth; the selector just navigates.
 */
export function LocationSelector({ idPrefix, inverse = false }: { idPrefix: string; inverse?: boolean }) {
  const navigate = useNavigate();
  const current = useLocationContext();
  const labelId = useId();

  return (
    <div className={`location-selector${inverse ? " location-selector--inverse" : ""}`}>
      <label
        id={labelId}
        htmlFor={`${idPrefix}-location-select`}
        className="location-selector__label"
      >
        Location
      </label>
      <div className="location-selector__field">
        <select
          id={`${idPrefix}-location-select`}
          aria-labelledby={labelId}
          value={current?.slug ?? ""}
          onChange={(e) => {
            const slug = e.target.value;
            if (slug) navigate(`/${slug}`);
          }}
          className="location-selector__select"
        >
          <option value="" disabled>
            Select location
          </option>
          {locations.map((loc) => (
            <option key={loc.slug} value={loc.slug}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>
        <svg className="location-selector__arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
