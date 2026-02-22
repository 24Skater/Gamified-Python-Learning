type Variant = "primary" | "success" | "warning" | "error";

interface NesProgressBarProps {
  value: number;
  max?: number;
  variant?: Variant;
  label?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "is-primary",
  success: "is-success",
  warning: "is-warning",
  error: "is-error",
};

export function NesProgressBar({
  value,
  max = 100,
  variant = "primary",
  label,
}: NesProgressBarProps) {
  return (
    <div>
      {label && (
        <label
          style={{
            fontFamily: "var(--nes-font-display)",
            fontSize: "var(--nes-text-xs)",
            color: "var(--nes-fg)",
            display: "block",
            marginBottom: "var(--nes-space-1)",
          }}
        >
          {label}
        </label>
      )}
      <progress
        className={`nes-progress ${variantClass[variant]}`}
        value={value}
        max={max}
        aria-label={label ?? `Progress: ${value}/${max}`}
      />
    </div>
  );
}
