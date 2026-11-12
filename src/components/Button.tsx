import { Link, type LinkProps } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

// Pyo's pill buttons: one primary action per section, secondary for the rest.
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "btn-emerge text-primary-foreground",
  secondary: "border border-border-strong bg-card text-foreground hover:bg-accent",
  ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[12px]",
  lg: "h-11 px-6 text-[14px]",
};

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <a
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

/** The same button for pages of this site: navigates without a page load. */
export function RouteButton({
  variant = "primary",
  size = "lg",
  className = "",
  children,
  ...props
}: LinkProps & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
