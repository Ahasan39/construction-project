import { useNavigate } from "react-router-dom";
import { useId } from "react";
import { locations } from "@/data/locations";
import { Select } from "@/components/ui";
import { useLocationContext } from "@/features/location-context/useLocationContext";

/**
 * Native-select location picker. Chosen over a custom combobox for honesty:
 * - zero JS cost on first paint,
 * - built-in keyboard support on every platform,
 * - clear mobile UX via the OS wheel/sheet.
 *
 * We do not request geolocation and do not persist a selection. The URL is
 * the source of truth; the selector just navigates.
 */
export function LocationSelector({ idPrefix }: { idPrefix: string }) {
  const navigate = useNavigate();
  const current = useLocationContext();
  const labelId = useId();

  return (
    <div className="flex items-center gap-2">
      <label
        id={labelId}
        htmlFor={`${idPrefix}-location-select`}
        className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)]"
      >
        Location
      </label>
      <Select
        id={`${idPrefix}-location-select`}
        aria-labelledby={labelId}
        value={current?.slug ?? ""}
        onChange={(e) => {
          const slug = e.target.value;
          if (slug) navigate(`/${slug}`);
        }}
        className="h-9 w-44 text-sm"
      >
        <option value="" disabled>
          Select a location
        </option>
        {locations.map((loc) => (
          <option key={loc.slug} value={loc.slug}>
            {loc.city}, {loc.state}
          </option>
        ))}
      </Select>
    </div>
  );
}
