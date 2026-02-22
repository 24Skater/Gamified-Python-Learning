import { ReactNode } from "react";

type Variant = "success" | "warning" | "error";

interface NesAlertProps {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, { border: string; icon: string }> = {
  success: { border: "var(--nes-success)", icon: "✓" },
  warning: { border: "var(--nes-warning)", icon: "!" },
  error: { border: "var(--nes-danger)", icon: "✗" },
};

export function NesAlert({ variant = "success", children }: NesAlertProps) {
  const { border, icon } = variantStyles[variant];

  return (
    <section
      className="nes-container is-dark"
      role="alert"
      style={{
        borderColor: border,
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--nes-space-2)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--nes-font-display)",
          fontSize: "var(--nes-text-lg)",
          color: border,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div
        style={{
          fontFamily: "var(--nes-font-body)",
          fontSize: "var(--nes-text-base)",
          lineHeight: "var(--nes-leading-normal)",
        }}
      >
        {children}
      </div>
    </section>
  );
}
