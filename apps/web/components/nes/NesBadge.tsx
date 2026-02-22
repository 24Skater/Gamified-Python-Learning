import { ReactNode } from "react";

type Variant = "primary" | "success" | "warning" | "error";

interface NesBadgeProps {
  variant?: Variant;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "is-primary",
  success: "is-success",
  warning: "is-warning",
  error: "is-error",
};

export function NesBadge({ variant, children }: NesBadgeProps) {
  const inner = variant ? variantClass[variant] : "is-primary";

  return (
    <span className="nes-badge">
      <span className={inner}>{children}</span>
    </span>
  );
}
