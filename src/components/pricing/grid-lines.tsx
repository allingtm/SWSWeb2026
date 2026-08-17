import { cn } from "@/lib/utils";

// Decorative primitives adapted from the Aceternity registry, retinted to the
// site's own tokens. All are non-interactive and aria-hidden.

// Dot grid that fades out radially, from the background-dots-masked block.
// Dialled well below the source's 0.3 alpha — at hero size it should read as
// paper texture, not as a graphic.
export function DottedBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full",
        "bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(0,0,0,0.14)_0.5px,transparent_0)]",
        "dark:bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(255,255,255,0.12)_0.5px,transparent_0)]",
        "[mask-image:radial-gradient(circle_at_center,white,transparent_75%)]",
        "bg-repeat [background-size:8px_8px]",
        className
      )}
    />
  );
}

// Dashed rules with a fade mask at both ends, adapted from Aceternity's
// cta-with-dashed-grid-lines block. Retinted to `--border` so they follow the
// theme, and the surrounding block's testimonial panel and second button were
// dropped — the pricing page allows neither.

export function GridLineHorizontal({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--border),var(--border)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,black_var(--fade-stop),transparent),linear-gradient(to_right,black_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-20",
        className
      )}
    />
  );
}

export function GridLineVertical({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--border),var(--border)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,black_var(--fade-stop),transparent),linear-gradient(to_bottom,black_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-20",
        className
      )}
    />
  );
}
