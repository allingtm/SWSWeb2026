import { cn } from "@/lib/utils";

// Adapted from the Aceternity registry's `bento-grid` item. Kept: the grid
// template and the content nudge on hover, which are the parts doing real work.
// Changed, for the same reasons the other registry components here were changed:
//
//  - Retinted from `bg-white`/`bg-black`/`neutral-*` to the site's tokens, since
//    this project themes via CSS variables rather than a fixed palette.
//  - Dropped `md:auto-rows-[18rem]`. That height is sized for cells carrying a
//    decorative header image; ours carry text, so rows size to content instead.
//    Note this rules out `auto-rows-fr` as well: equal-height rows means the
//    row-spanning cell, which is the tallest thing in the grid, sets the height
//    of every other row too, and short rows are left with dead space under
//    their copy. Cells still stretch level within their own row by default.
//  - Dropped the `header` slot entirely. It exists to hold a gradient or
//    skeleton blob, and this section has to read as credible rather than
//    decorated.
//  - Descriptions moved off `text-xs`, which undersells copy of this length.
//  - Dropped `shadow-input`, an Aceternity globals utility this project has no
//    definition for, so it was a silent no-op.
//
// The registry lists `@tabler/icons-react` as a dependency. The component never
// imports it — icons arrive as a prop — so it is not installed here.

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  icon,
  footer,
  children,
}: {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /**
   * Sits in the lower middle of the cell. A cell that spans two rows is taller
   * than its content, and the leftover height is split by the flex spacers
   * around this block rather than collected in one place: pinning the footer
   * to the bottom opened a dead band under the copy, and letting it follow the
   * copy directly left the whole cell bottom-heavy with empty space.
   */
  footer?: React.ReactNode;
  /**
   * Overlay slot, rendered behind the content. Takes the place of the
   * registry's decorative `header` — used here for GlowingEffect on the one
   * cell that leads.
   */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group/bento relative flex flex-col rounded-xl border border-border bg-muted/40 p-6",
        "transition-colors hover:border-primary/50",
        className
      )}
    >
      {children}
      <div className="relative transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <h3 className="mt-4 mb-3 text-xl font-semibold">{title}</h3>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {footer && (
        <>
          {/* Two thirds of the slack above, one third below. `min-h-6` is the
              floor for a cell with no slack to give — a single-row cell, or any
              cell below md where the spans drop and rows size to content. */}
          <div aria-hidden className="min-h-6 grow-[2]" />
          <div className="relative">{footer}</div>
          <div aria-hidden className="grow" />
        </>
      )}
    </div>
  );
}
