"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "success" | "warning" | "error";

interface NesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary: "is-primary",
  success: "is-success",
  warning: "is-warning",
  error: "is-error",
};

export const NesButton = forwardRef<HTMLButtonElement, NesButtonProps>(
  ({ variant, disabled, className = "", children, ...rest }, ref) => {
    const cls = [
      "nes-btn",
      variant ? variantClass[variant] : "",
      disabled ? "is-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={cls} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  },
);

NesButton.displayName = "NesButton";
