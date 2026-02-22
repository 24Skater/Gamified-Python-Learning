import { CSSProperties } from "react";

type Size = "sm" | "md" | "lg" | "xl";

interface NesIconProps {
  name: string;
  size?: Size;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const sizeMap: Record<Size, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

/**
 * Renders a pixelarticons SVG from /public/icons/pixelarticons/.
 * Icons are copied there from node_modules at setup time.
 * To add more icons, copy SVGs from node_modules/pixelarticons/svg/ into
 * apps/web/public/icons/pixelarticons/.
 */
export function NesIcon({
  name,
  size = "md",
  label,
  className = "",
  style,
}: NesIconProps) {
  const px = sizeMap[size];

  return (
    <img
      src={`/icons/pixelarticons/${name}.svg`}
      alt={label ?? ""}
      role={label ? "img" : "presentation"}
      aria-hidden={!label ? true : undefined}
      width={px}
      height={px}
      className={`nes-icon-${size} ${className}`}
      style={{
        display: "inline-block",
        width: px,
        height: px,
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
}
