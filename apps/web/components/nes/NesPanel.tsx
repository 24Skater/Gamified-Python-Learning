import { HTMLAttributes, ReactNode } from "react";

interface NesPanelProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  dark?: boolean;
  centered?: boolean;
  children: ReactNode;
}

export function NesPanel({
  title,
  dark = true,
  centered = false,
  className = "",
  children,
  ...rest
}: NesPanelProps) {
  const cls = [
    "nes-container",
    title ? "with-title" : "",
    dark ? "is-dark" : "",
    centered ? "is-centered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cls} {...rest}>
      {title && <p className="title">{title}</p>}
      {children}
    </section>
  );
}
