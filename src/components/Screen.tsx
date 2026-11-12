/** A dashboard screenshot in the current theme. Only the visible one loads. */
export function ScreenImage({ name, alt }: { name: string; alt: string }) {
  const props = { width: 2860, height: 1800, loading: "lazy" as const };
  return (
    <>
      <img
        {...props}
        src={`/screens/${name}-light.webp`}
        alt={alt}
        className="block h-auto w-full dark:hidden"
      />
      <img
        {...props}
        src={`/screens/${name}-dark.webp`}
        alt={alt}
        className="hidden h-auto w-full dark:block"
      />
    </>
  );
}

/** The window a screenshot sits in. */
export function ScreenFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[0_24px_80px_-24px_rgb(0_0_0/0.35)] ${className}`}
    >
      {children}
    </div>
  );
}
