/**
 * Inline-SVG placeholder for any image slot where no client asset exists yet.
 * Carries explicit width/height to prevent CLS and an accessible label so
 * screen readers announce it as a placeholder, never as real imagery.
 *
 * Replace with real `<picture>` / `<img>` once client assets land.
 */
export interface PlaceholderImageProps {
  /** Display size in CSS pixels (also drives the SVG viewBox). */
  width: number;
  height: number;
  label: string;
  tone?: "neutral" | "brand" | "warm";
  className?: string;
}

const tonePalette: Record<
  NonNullable<PlaceholderImageProps["tone"]>,
  { bg: string; fg: string }
> = {
  neutral: { bg: "#e5e7eb", fg: "#6b7280" },
  brand: { bg: "#dbe6f1", fg: "#0a2a4e" },
  warm: { bg: "#f3e4d0", fg: "#9a6a2a" },
};

export function PlaceholderImage({
  width,
  height,
  label,
  tone = "neutral",
  className = "",
}: PlaceholderImageProps) {
  const { bg, fg } = tonePalette[tone];
  return (
    <svg
      role="img"
      aria-label={`Placeholder: ${label}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      <rect width={width} height={height} fill={bg} />
      <g fill={fg} opacity="0.35">
        <circle cx={width * 0.3} cy={height * 0.45} r={Math.min(width, height) * 0.12} />
        <polygon
          points={`${width * 0.5},${height * 0.75} ${width * 0.72},${height * 0.4} ${width * 0.95},${height * 0.75}`}
        />
      </g>
      <text
        x="50%"
        y="92%"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize={Math.max(10, Math.min(width, height) * 0.03)}
        fill={fg}
        opacity="0.75"
      >
        {label} — placeholder
      </text>
    </svg>
  );
}
